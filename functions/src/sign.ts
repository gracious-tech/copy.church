
import {onCall} from 'firebase-functions/v2/https'
import {initializeApp} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'
import {generate_token} from './utils.js'


// Init firebase
const fire_app = initializeApp()
const fire_db = getFirestore(fire_app)


// Main function
export const save_signing = onCall({
    serviceAccount: 'save-signing@copy-church.iam.gserviceaccount.com',
}, async (request):Promise<{error:string|null}> => {

    // Determine origin and ensure either localhost or production site
    const domain_origin = request.rawRequest.headers.origin!
    if (domain_origin !== 'https://copy.church' && domain_origin !== 'https://copy-church.web.app'
            && domain_origin.split('//')[1]?.split(':')[0] !== 'localhost'){
        throw new Error(`Invalid origin: ${domain_origin}`)
    }

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
        reviewed: false,
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
