
import {HttpsFunction, onRequest, Request} from 'firebase-functions/v2/https'
import {defineString, defineSecret} from 'firebase-functions/params'

import {allowed_domains, fire_db, validate_turnstile} from './common.js'
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
    state:{
        status:'new'|'sent_lulu'|'sent_manually'
        lulu_id:null|number
        cost:number
        currency:string
    }
}


// CONSTANTS
// SKU/pod (combination of printing options)
// 6x9", black/white, cream paper, matte cover
const POD_PACKAGE_ID = '0600X0900BWSTDPB060UC444MXX'
const PAGE_COUNT = 377


// CONFIG (update when confident everything working)
const DEV = !!process.env['FUNCTIONS_EMULATOR']
const SANDBOX = DEV
// NOTE Since manually confirming orders anyway, can already delay as long as like so set to 60min
const PRODUCTION_DELAY = 60  // Mininum is 60 minutes to allow cancelling
const LULU_DOMAIN = SANDBOX ? 'https://api.sandbox.lulu.com/' : 'https://api.lulu.com/'

// Firebase config
const TURNSTILE_SECRET = defineSecret('TURNSTILE_SECRET')
const DISCORD_WEBHOOK_DEV = defineString('DISCORD_WEBHOOK_DEV')
const DISCORD_WEBHOOK_US = defineSecret('DISCORD_WEBHOOK_US')
const DISCORD_WEBHOOK_AU = defineSecret('DISCORD_WEBHOOK_AU')
const DISCORD_WEBHOOK_OTHER = defineSecret('DISCORD_WEBHOOK_OTHER')
const LULU_AUTH_SANDBOX = defineString('LULU_AUTH_SANDBOX')
const LULU_AUTH_PROD = defineSecret('LULU_AUTH_PROD')


export const record_order:HttpsFunction = onRequest({
    serviceAccount: 'save-signing@copy-church.iam.gserviceaccount.com',
    cors: allowed_domains,
    secrets: [LULU_AUTH_PROD, DISCORD_WEBHOOK_US, DISCORD_WEBHOOK_AU, DISCORD_WEBHOOK_OTHER, TURNSTILE_SECRET],
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
    const ip_total = num_from_ip.data().count
    if (ip_total > 6){
        return "You have submitted too many orders"
    }

    // Prepare data to be saved
    const order_data:Order = {

        datetime: new Date(),
        ip,

        name,
        email,

        books: {abolish: {quantity: 1}},  // Hardcoded for now

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

        state: {
            status: 'new',
            lulu_id: null,
            cost: 0,
            currency: '',
        },
    }

    // Validate with Lulu so requestor can fix anything missing themselves
    const access_token = await get_lulu_access_token()
    if (!access_token){
        return "Couldn't connect, please try again"
    }
    const validation = await validate_order(access_token, order_data)
    if (typeof validation === 'string'){
        return validation
    }
    order_data.state.cost = validation.cost
    order_data.state.currency = validation.currency

    // Check turnstile token last of all checks, as will invalidate it once used
    // If checked earlier and some other problem, then user would have to redo each time
    if (! await validate_turnstile(ip, String(data['turnstile']), TURNSTILE_SECRET.value())){
        // WARN "human" string is looked for in form UI, so don't remove
        return "Not sure if you're human (please try again or email us)"
    }

    // Add new record to db
    // SECURITY Do not publicly expose record id, as can use it to trigger send to Lulu
    const record = await fire_db.collection('book_orders').add(order_data)

    // Determine action URL
    let action_url:string
    if (order_data.address.country === 'US' || order_data.address.country === 'AU'){
        action_url = DEV ? 'http://127.0.0.1:5001/copy-church/us-west1/mark_as_sent'
            : 'https://mark-as-sent-eyjvbqmvpa-uw.a.run.app'
    } else {
        action_url = DEV ? 'http://127.0.0.1:5001/copy-church/us-west1/send_to_lulu'
            : 'https://send-to-lulu-eyjvbqmvpa-uw.a.run.app'
    }

    // Format details for easy copy-pasting to Amazon
    const discord_msg = [
        `Country: ${order_data.address.country}`,
        `Name: ${order_data.name}`,
        `Phone: ${order_data.address.phone}`,
        `Address line 1: ${order_data.address.street1}`,
        `Address line 2: ${order_data.address.street2}`,
        `Postcode: ${order_data.address.postcode}`,
        `City/Suburb: ${order_data.address.city}`,
        `State: ${order_data.address.state}`,
        '',
        `Email: ${order_data.email}`,
        `IP: ${order_data.ip} (${ip_total} previous orders)`,
        `Tax ID: ${order_data.address.tax_id}`,
        `Lulu cost: ${order_data.state.cost} ${order_data.state.currency}`,
        `Order ID: ${record.id}`,
        '',
        // NOTE '~' added to end of URL to prevent Discord spam/preview requests from triggering
        `Confirm: ${action_url}?id=${encodeURIComponent(record.id)}~`,
    ].join('\n')

    // Determine discord webhook/channel
    let webhook = DISCORD_WEBHOOK_DEV.value()
    if (!DEV){
        webhook = DISCORD_WEBHOOK_OTHER.value()
        if (order_data.address.country === 'US'){
            webhook = DISCORD_WEBHOOK_US.value()
        } else if (order_data.address.country === 'AU'){
            webhook = DISCORD_WEBHOOK_AU.value()
        }
    }

    // Notify via discord
    try {
        await fetch(webhook, {
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


// Function for marking an order as manually sent
export const mark_as_sent:HttpsFunction = onRequest({
    serviceAccount: 'save-signing@copy-church.iam.gserviceaccount.com',
}, async (request, response) => {

    // Get the order id from query param
    const order_id = String(request.query['id'])

    // Do main logic
    const msg = await mark_as_sent_inner(order_id)

    // Send back response message
    response.status(200).send(msg)
})


// The main logic for marking an order as manually sent (returns string for feedback)
async function mark_as_sent_inner(order_id:string):Promise<string>{

    // Rm ~ for sake of getting record
    let real_id = order_id
    if(order_id.endsWith('~')){
        real_id = order_id.slice(0, -1)
    }

    // Get record for order
    const order_ref = fire_db.collection('book_orders').doc(real_id)
    const order = await order_ref.get()
    if (!order.exists){
        return `Order does not exist with id "${real_id}"`
    }

    // Only relevant for new orders
    const order_data = order.data() as Order
    const name = order_data.name.replace(/[&<>"']/g, '')
    if (order_data.state.status !== 'new'){
        return `Order for "${name}" already has status "${order_data.state.status}"`
    }

    // Warn if id has '~' appended which is to prevent Discord from auto-triggering URL
    if (order_id.endsWith('~')){
        return `You're going to mark the order to "${name}" as being sent.
            Remove the '~' from the end of the URL to confirm.`
    }

    // Update status
    await order_ref.update({
        'state.status': 'sent_manually',
    })

    return `Order for "${name}" has been successfully marked as "sent_manually".`
}


// Function for triggering an order to be sent to Lulu
export const send_to_lulu:HttpsFunction = onRequest({
    serviceAccount: 'save-signing@copy-church.iam.gserviceaccount.com',
    secrets: [LULU_AUTH_PROD],
}, async (request, response) => {

    // Get the order id from query param
    const order_id = String(request.query['id'])

    // Do main logic
    const error = await send_to_lulu_inner(order_id)

    // Send back response message
    if (error){
        response.status(400).send("Error: " + error)
    } else {
        response.status(200).send("Successfully sent to Lulu")
    }
})


// The main logic of sending order to Lulu (returns string if error)
export async function send_to_lulu_inner(order_id:string):Promise<null|string>{

    // Rm ~ for sake of getting record
    let real_id = order_id
    if(order_id.endsWith('~')){
        real_id = order_id.slice(0, -1)
    }

    // Get record for order
    const order_ref = fire_db.collection('book_orders').doc(real_id)
    const order = await order_ref.get()
    if (!order.exists){
        return `Order does not exist with id "${real_id}"`
    }

    // Can only send new orders (or ones reset to new to retry)
    const order_data = order.data() as Order
    const name = order_data.name.replace(/[&<>"']/g, '')
    if (order_data.state.status !== 'new'){
        return `Order for "${name}" already has status "${order_data.state.status}"`
    }

    // Warn if id has '~' appended which is to prevent Discord from auto-triggering URL
    if (order_id.endsWith('~')){
        return `You're going to send order for "${name}" to Lulu.
            Remove the '~' from the end of the URL to confirm.`
    }

    // Get access token
    const access_token = await get_lulu_access_token()
    if (!access_token){
        return "Couldn't get access token"
    }

    // Double check order is valid and not too expensive
    const validation = await validate_order(access_token, order_data)
    if (typeof validation === 'string'){
        return validation
    }

    // Submit order
    const request_data = order_to_lulu_request(order.id, order_data, false)
    const resp_data = await lulu_request(access_token, 'print-jobs/', request_data)
    if (!resp_data){
        return "Couldn't connect to Lulu to send order"
    }
    if ('error' in resp_data){
        // Pass on all data since this is for developer viewing
        return JSON.stringify(resp_data, undefined, 4)
    }

    // Update state of record
    // NOTE cost and shipping dates not available straight away (at least in sandbox)
    await order_ref.update({
        'state.status': 'sent_lulu',
        'state.lulu_id': resp_data['id'],  // order_id is null when tested in sandbox
        // TODO Below resulted in NaN in sandbox, maybe docs are incorrect?
        // 'state.cost': parseFloat(resp_data['costs']['total_cost_incl_tax']),
    })

    return null
}


// Function for estimating delivery time
export const estimate_delivery:HttpsFunction = onRequest({
    secrets: [LULU_AUTH_PROD],
}, async (request, response) => {

    // Accepts a country param
    const country = String(request.query['country'])

    // Do main logic
    const result = await estimate_delivery_inner(country)

    // Send back response message
    if (result.error){
        response.status(500).send("Error: " + result)
    } else {
        response.status(200).send({days: result.days})
    }
})


// The main logic of function that estimates delivery time
export async function estimate_delivery_inner(country:string):Promise<{error?:string, days?:number}>{

    // Get access token
    const access_token = await get_lulu_access_token()
    if (!access_token){
        return {error: "Couldn't get access token"}
    }

    // Submit request
    const resp_data = await lulu_request(access_token, 'shipping-options/', {
        line_items: [
            {
                page_count: PAGE_COUNT,
                pod_package_id: POD_PACKAGE_ID,
                quantity: 1,
            }
        ],
        shipping_address: {
            country,
        },
    })
    if (!resp_data){
        return {error: "Couldn't connect to Lulu"}
    }
    if ('error' in resp_data){
        // Print to console in case sensitive
        console.error(JSON.stringify(resp_data, undefined, 4))
        return {error: "Internal"}
    }

    return {days: resp_data[0].total_days_max}
}


// Get access token from Lulu
async function get_lulu_access_token():Promise<string|null>{
    const url = LULU_DOMAIN + 'auth/realms/glasstree/protocol/openid-connect/token'
    const auth_token = SANDBOX ? LULU_AUTH_SANDBOX.value() : LULU_AUTH_PROD.value()
    let resp:Response
    try {
        resp = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + auth_token,
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
            }),
        })
    } catch (caught){
        console.error(caught)
        return null  // Null for network errors as may be able to retry
    }

    // Extract token from response (throw if fail)
    if (!resp.ok){
        throw new Error(`Failed to get access token (${resp.status} ${resp.statusText})`)
    }
    const data = await resp.json() as {access_token:string}
    return data.access_token
}


// Generate data for a Lulu request from an order record
function order_to_lulu_request(id:string, order:Order, validation:boolean){
    return {
        external_id: id,
        contact_email: 'admin@gracious.tech',
        production_delay: PRODUCTION_DELAY,  // Can't cancel once sent to production
        shipping_level: 'MAIL',  // Cheapest option
        line_items: [
            {
                title: "Abolish the Jesus Trade",
                quantity: 1,
                external_id: 'abolish',
                pod_package_id: POD_PACKAGE_ID,
                interior: 'https://sellingjesus.org/book/Abolish-the-Jesus-Trade.pdf',
                cover: 'https://sellingjesus.org/book/Abolish-cover-lulu.pdf',
                // page_count is required for validation but will cause 500 error for orders
                ...validation ? {page_count: PAGE_COUNT} : {},
            }
        ],
        shipping_address: {
            name: order.name,
            email: order.email,
            phone_number: order.address.phone,

            street1: order.address.street1,
            street2: order.address.street2,
            city: order.address.city,
            state_code: order.address.state,
            postcode: order.address.postcode,
            country_code: order.address.country,

            recipient_tax_id: order.address.tax_id,
        },
    }
}


// Submit a request to Lulu (returns null for network failure)
async function lulu_request(token:string, path:string, data:unknown)
        :Promise<Record<string, any>|null>{

    // Try send
    const url = LULU_DOMAIN + path
    let resp:Response
    try {
        resp = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
    } catch {
        return null
    }

    // Throw for issues user can't resolve themselves
    if (!resp.ok && resp.status !== 400){
        throw new Error(`Request to Lulu failed: ${resp.status} ${resp.statusText}`)
    }
    const resp_data = await resp.json() as Record<string, unknown>
    return resp.ok ? resp_data : {error: resp_data}
}


// Validate order details and cost, and return string if user-resolvable error
async function validate_order(token:string, order:Order)
        :Promise<string|{cost:number, currency:string}>{

    // Prepare request data (don't need order id for validation)
    const request_data = order_to_lulu_request('', order, true)

    // Check cost (which also validates address)
    const resp_data = await lulu_request(token, 'print-job-cost-calculations/', request_data)
    if (!resp_data){
        return "Could not connect, please try again"
    }

    // See if any issue with provided details
    if ('error' in resp_data){
        return extract_human_error_msg(resp_data['error'] as ErrorResponse)
    }

    // Tell user if order too expensive
    const currency = resp_data['currency'] as string  // This should always be account's currency
    let limit = 50  // AUD (high as will manually verify anyway, normally 26 US, 32 AU, 40 PH)
    if (currency === 'USD'){
        limit = limit / 1.5
    }
    const dollars = parseFloat(resp_data['total_cost_incl_tax'] as string)
    if (dollars > limit){
        return `Sorry, it's too expensive to ship to that address (${dollars} ${currency})`
    }

    // Passed validation
    return {cost: dollars, currency}
}


// Extract human-readable error messages from Lulu error data
function extract_human_error_msg(data:ErrorResponse){
    try {
        return Object.values(data)
            .map(item => item.detail.errors.map(e => e.message))
            .flat()
            .join('\n')
    } catch {
        return JSON.stringify(data)
    }
}


type ErrorResponse = Record<string, {detail: {errors: Array<{message:string}>}}>
// EXAMPLE (noting that first error prop is from this function and not Lulu)
// { "shipping_address": { "detail": { "errors": [ { "code": "INVALID", "path": "postcode", "message": "The format of the Postal Code entered does not match the country you entered. It should look like 1000, 2888, 3585, 3707." } ] } } }
