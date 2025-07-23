
import {HttpsFunction, onRequest, Request} from 'firebase-functions/v2/https'

import {allowed_domains, fire_db} from './common.js'
import region_data from './data/regions.json' with {type: 'json'}


interface BookOptions {
    quantity:number
}


interface Order {

    // Auto-set
    datetime:Date
    ip:string

    // Contact
    name:string  // Required by Lulu
    email:string  // Required by Lulu

    // Order
    books:Partial<Record<'abolish'|'dorean', BookOptions>>
    color:'white'|'cream'
    address:{
        // Required by Lulu
        country:string
        city:string
        postcode:string
        street1:string
        phone:string
        // Optional
        state:string
        street2:string
        tax_id:string
    }

    // State
    state:'new'|'send'|'send_done'|'send_failed'|'no'
    error:string
}


// CONFIG (update when confident everything working)
process.env['FUNCTIONS_EMULATOR'] = 'true'  // TODO Forcing Lulu sandbox until ready
const PRODUCTION_DELAY = 60 * 24  // 1 day
const LULU_DOMAIN = process.env['FUNCTIONS_EMULATOR'] ? 'https://api.sandbox.lulu.com/'
    : 'https://api.lulu.com/'


export const record_order:HttpsFunction = onRequest({
    serviceAccount: 'save-signing@copy-church.iam.gserviceaccount.com',
    cors: allowed_domains,
}, async (request, response) => {

    const error = await record_order_inner(request)

    response.status(200).send({error})
})


async function record_order_inner(request:Request):Promise<string|null>{

    // Get signer's ip address
    const ip = request.ip || 'localhost'  // ip not available in emulator

    // Extract and validate data
    const data = request.body as Record<string, unknown>

    // Ensure input types correct
    const name = String(data['name']).trim()
    const email = String(data['email']).trim().toLowerCase()  // Lower for easier unique checking
    const color = String(data['color']).trim() === 'white' ? 'white' : 'cream'
    const address_country = String(data['address_country']).trim()
    const address_city = String(data['address_city']).trim()
    const address_postcode = String(data['address_postcode']).trim()
    const address_street1 = String(data['address_street1']).trim()
    const address_phone = String(data['address_phone']).trim()
    const address_state = String(data['address_state']).trim()
    const address_street2 = String(data['address_street2']).trim()
    const address_tax_id = String(data['address_tax_id']).trim()

    // Ensure have required fields
    const required = [
        name,
        email,
        address_country,
        address_city,
        address_postcode,
        address_street1,
        address_phone,
    ]
    for (const value of required){
        if (!value){
            return "Required field is empty"  // Browser UI shows which one
        }
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+$/.test(email)){
        return "Invalid email address"
    }

    // Validate phone (Lulu's regex)
    if (! /^\+?[\d\s\-.\/()]{8,20}$/.test(address_phone)){
        return "Invalid phone number"
    }

    // Validate country
    const country_match = region_data.find(c => c.code === address_country)
    if (!country_match){
        return "Invalid country"
    }
    // If data includes regions then expected to match one of them
    if (country_match.regions.length && !country_match.regions.find(r => r.code === address_state)){
        return "Invalid state/province"
    }

    // Basic spam prevention (drop orders from same ip if exceed limit)
    const num_from_ip = await fire_db.collection('book_orders').where('ip', '==', ip).count().get()
    if (num_from_ip.data().count > 6){
        return "Too many orders from this IP address"
    }

    // Prepare data to be saved
    const order_data:Order = {

        datetime: new Date(),
        ip,

        name,
        email,

        books: {abolish: {quantity: 1}},  // Hardcoded for now
        color,

        address: {
            country: address_country,
            city: address_city,
            postcode: address_postcode,
            street1: address_street1,
            phone: address_phone,

            state: address_state,
            street2: address_street2,
            tax_id: address_tax_id,
        },

        state: 'new',
        error: '',
    }

    // Add new record to db
    await fire_db.collection('book_orders').add(order_data)

    // Notify via discord
    try {
        const webhook_url = process.env['discord_webhook']!
        const discord_msg = "New book order:\n" + JSON.stringify(order_data, undefined, 4)
        await fetch(webhook_url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({content: discord_msg}),
        })
    } catch {
        // Record still recorded, so...
    }

    // Return no error for success
    return null
}


// Get access token from Lulu
async function get_lulu_access_token():Promise<string|null>{
    const url = LULU_DOMAIN + 'auth/realms/glasstree/protocol/openid-connect/token'
    let resp:Response
    try {
        resp = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + process.env['lulu_auth'],
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
            }),
        })
    } catch (caught){
        console.error(caught)
        return null  // Null for network errors as may be able to retry
    }

    // Extract token from response
    const data = await resp.json() as {access_token:string}
    return data.access_token
}
