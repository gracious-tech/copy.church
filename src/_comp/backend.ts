
import {initializeApp} from 'firebase/app'
import {getFirestore, setDoc, doc, connectFirestoreEmulator} from 'firebase/firestore'
import {getFunctions, httpsCallable, connectFunctionsEmulator} from 'firebase/functions'


export interface SigningData {
    type:'person'|'org'|'unpub'
    email:string
    name:string  // Empty string if unpub
    country:string  // Empty string if unpub
    position:string  // 'person' only
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
export async function save_signing(petition:string, data:SigningData){
    const resp = await fire_save_signing({petition, ...data})
    return (resp.data as {error:string|null}).error
}
