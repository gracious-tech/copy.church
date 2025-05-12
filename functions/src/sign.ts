
import {onCall} from 'firebase-functions/v2/https'
import {initializeApp} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'
import {generate_token} from './utils.js'


// Init firebase
const fire_app = initializeApp()
const fire_db = getFirestore(fire_app)


// Main function
export const save_signing = onCall(async (request):Promise<{error:string|null}> => {

    // Determine origin and ensure either localhost or production site
    const domain_origin = request.rawRequest.headers.origin!
    if (domain_origin !== 'https://copy.church'
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
        const same_email = await fire_db.collection(`petitions/${petition}/signers`)
            .where('email', '==', email)
            .where('type', '!=', 'org')
            .get()
        if (!same_email.empty){
            return {error: "Email address already used to sign."}
        }
    }

    // Generate random id for signing
    const signing_id = generate_token()

    // Save the signing to db
    const batch = fire_db.batch()
    const doc = fire_db.doc(`petitions/${petition}/signers/${signing_id}`)
    // NOTE type needed in main doc and subdoc for querying
    batch.set(doc, {email, ip, type})
    batch.set(doc.collection('public').doc('data'),
        {type, name, country, position, reviewed: false})
    await batch.commit()

    // Success
    return {error: null}
})
