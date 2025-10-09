
import {onCall} from 'firebase-functions/v2/https'
import {defineSecret} from 'firebase-functions/params'

import {allowed_domains, fire_db, validate_turnstile} from './common.js'
import {generate_token} from './utils.js'


const TURNSTILE_SECRET = defineSecret('TURNSTILE_SECRET')


// Main function
export const save_signing = onCall({
    serviceAccount: 'save-signing@copy-church.iam.gserviceaccount.com',
    cors: allowed_domains,
    secrets: [TURNSTILE_SECRET],
}, async (request):Promise<{error:string|null}> => {

    // Get signer's ip address
    const ip = request.rawRequest.ip || 'localhost'  // ip not available in emulator

    // Extract and validate data
    const data = request.data as Record<string, unknown>
    const petition = String(data['petition'])
    if (!['scripture'].includes(petition)){
        return {error: "Invalid petition id"}
    }
    const type = String(data['type']) as 'person'|'org'|'unpub'
    if (!['person', 'org', 'unpub'].includes(type)){
        return {error: "Invalid signer type"}
    }
    // NOTE Storing email in lowercase so can search for uniqueness (won't send to most anyway)
    const email = String(data['email']).trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+$/.test(email)){
        return {error: "Invalid email address"}
    }
    // Unpub doesn't show name/country fields, so discard any old data (if prev entered in UI)
    const name = type === 'unpub' ? '' : String(data['name']).trim()
    const country = type === 'unpub' ? '' : String(data['country'])
    // Likewise, only person shows position field
    const position = type !== 'person' ? '' : String(data['position']).trim()

    // If type is not 'org', email must be unique
    // NOTE Some may use same email address for multiple orgs, which is fine
    if (type !== 'org'){
        const same_email = await fire_db.collection(`petitions/${petition}/uniqueness`)
            .where('email', '==', email).get()
        if (same_email.docs.filter(s => s.data()['type'] !== 'org').length){
            return {error: "Email address already used to sign."}
        }
    }

    // Check turnstile token last of all checks, as will invalidate it once used
    // If checked earlier and some other problem, then user would have to redo each time
    if (! await validate_turnstile(ip, String(data['turnstile']), TURNSTILE_SECRET.value())){
        // WARN "human" string is looked for in form UI, so don't remove
        return {error: "Not sure if you're human (please try again or email support@gracious.tech)"}
    }

    // Generate random id for signing
    const signing_id = generate_token()

    // Get paths for each doc that will be saved
    const doc_petition = fire_db.doc(`petitions/${petition}`)
    const doc_signing = doc_petition.collection('signers').doc(signing_id)
    const doc_private = doc_signing.collection('private').doc('data')
    const doc_unique = doc_petition.collection('uniqueness').doc(signing_id)

    // Do in batch to avoid partial data upon failure
    const batch = fire_db.batch()
    // Save public data
    batch.set(doc_signing, {
        type,
        name,
        country,
        position,
        date: new Date(),
        sort: 0,
        reviewed: type === 'unpub',  // Auto-mark unpub'd signers as reviewed
    })
    // Save private data in subdoc
    batch.set(doc_private, {email, ip})
    // Save data relevant to uniqueness testing in separate collection
    // (since can't query email/ip across the private subdocs)
    // NOTE Only email is auto-tested for uniqueness, the rest is useful for manual inspection
    batch.set(doc_unique, {type, email, ip, name})
    await batch.commit()

    // Success
    return {error: null}
})
