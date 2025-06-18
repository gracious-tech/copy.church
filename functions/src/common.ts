
import {initializeApp} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'


// Init firebase
export const fire_app = initializeApp()
export const fire_db = getFirestore(fire_app)


// CORS allowed domains
export const allowed_domains = [
    'https://sellingjesus.org',
    'https://copy.church',
    'https://copy-church.web.app',
]
