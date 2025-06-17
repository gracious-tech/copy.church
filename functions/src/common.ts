
import {initializeApp} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'


// Init firebase
export const fire_app = initializeApp()
export const fire_db = getFirestore(fire_app)
