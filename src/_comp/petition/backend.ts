
import {initializeApp} from 'firebase/app'
import {getFirestore, collection, onSnapshot, query, orderBy, connectFirestoreEmulator,
    type Timestamp} from 'firebase/firestore'
import {getFunctions, httpsCallable, connectFunctionsEmulator} from 'firebase/functions'


export interface SigningInput {
    type:'person'|'org'|'unpub'
    email:string
    name:string  // Empty string if unpub
    country:string  // Empty string if unpub
    position:string  // 'person' only
    turnstile:string
}

export interface SigningOutput {
    type:'person'|'org'|'unpub'
    name:string
    country:string
    position:string
    date:Timestamp
    sort:number
    reviewed:boolean
}


// Init firebase
const fire_app = initializeApp({projectId: 'copy-church'})
const fire_functions = getFunctions(fire_app, 'us-west1')
const fire_db = getFirestore(fire_app)
if (import.meta.env.DEV){
    connectFirestoreEmulator(fire_db, '127.0.0.1', 8080)
    connectFunctionsEmulator(fire_functions, '127.0.0.1', 5001)
}


// Access to cloud functions
const fire_save_signing = httpsCallable(fire_functions, 'save_signing')


// Send signer's details to cloud function
export async function save_signing(petition:string, data:SigningInput){
    const resp = await fire_save_signing({petition, ...data})
    return (resp.data as {error:string|null}).error
}


// Listen for signers
export async function listen_for_signers(petition:string, add_signer:(data:SigningOutput)=>void){
    const q = query(collection(fire_db, `petitions/${petition}/signers`), orderBy('date', 'desc'))
    onSnapshot(q, snapshot => {
        snapshot.docChanges().forEach(change => {
            if (change.type === 'added'){
                add_signer(change.doc.data() as SigningOutput)
            }
        })
    })
}
