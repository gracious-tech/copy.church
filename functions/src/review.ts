
import {timingSafeEqual} from 'node:crypto'

import {onRequest} from 'firebase-functions/v2/https'
import {FieldValue} from 'firebase-admin/firestore'

import {fire_db, petition_ids} from './common.js'


// Whether running in the local emulator
const DEV = !!process.env['FUNCTIONS_EMULATOR']

// URL of the review_signing function
const REVIEW_URL = DEV ? 'http://127.0.0.1:5001/copy-church/us-west1/review_signing'
    : 'https://us-west1-copy-church.cloudfunctions.net/review_signing'


// Details of a new signing needed for the notification
export interface SigningNotice {
    petition:string
    signing_id:string
    review_token:string
    type:string
    name:string
    position:string
    country:string
    email:string
    ip:string
}


// Shorten user-provided text so a message can't exceed Discord's 2000 char limit
function clip(text:string, max=200):string{
    return text.length > max ? text.slice(0, max) + '…' : text
}


// Escape user-provided text for safe inclusion in HTML
function escape_html(text:string):string{
    return text.replace(/[&<>"']/g, char => `&#${char.charCodeAt(0)};`)
}


// Compare tokens in constant time
function tokens_match(expected:unknown, given:string):boolean{
    if (typeof expected !== 'string' || expected.length !== given.length){
        return false
    }
    return timingSafeEqual(Buffer.from(expected), Buffer.from(given))
}


// Post a Discord message about a new signing, with a link for reviewing it
export async function notify_new_signing(webhook:string, notice:SigningNotice):Promise<void>{

    // Can't notify without a webhook (e.g. secret not set in emulator)
    if (!webhook){
        return
    }

    // NOTE Signing is already saved, so a failed notification only gets logged
    try {

        // Count signings from same IP to help spot spam
        const same_ip = await fire_db.collection(`petitions/${notice.petition}/uniqueness`)
            .where('ip', '==', notice.ip).count().get()

        // Compose message
        const params = new URLSearchParams({
            petition: notice.petition,
            id: notice.signing_id,
            token: notice.review_token,
        })
        const content = [
            `New signing (${notice.type}): **${clip(notice.name) || '[unpublished]'}**`,
            `Position: ${clip(notice.position)}`,
            `Country: ${notice.country}`,
            `Email: ${clip(notice.email)}`,
            `IP: ${notice.ip} (${same_ip.data().count} signings from this IP)`,
            // NOTE Angle brackets stop Discord from previewing the link
            `Review: <${REVIEW_URL}?${params.toString()}>`,
        ].join('\n')

        // Send without allowing any @mentions from user-provided text
        const resp = await fetch(webhook, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({content, allowed_mentions: {parse: []}}),
        })
        if (!resp.ok){
            console.error(`Discord notification failed: ${resp.status}`)
        }
    } catch (error){
        console.error(error)
    }
}


// Wrap content in a minimal mobile-friendly HTML page
function render_page(body:string):string{
    return `<!doctype html>
<html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Review signing</title>
<style>
body{font-family:system-ui,sans-serif;max-width:500px;margin:32px auto;padding:0 16px}
form{display:inline-block;margin-right:12px}
form.edit{display:block;margin-bottom:24px}
label{display:block;font-weight:bold;margin-bottom:12px}
label input{display:block;width:100%;box-sizing:border-box;font-size:16px;padding:8px;font-weight:normal}
button{font-size:18px;padding:12px 24px;border-radius:8px;border:none;cursor:pointer}
.approve{background:#2a2;color:white}
.reject{background:#c22;color:white}
</style>
</head><body>${body}</body></html>`
}


// Page for approving or rejecting a signing (GET shows details, POST performs the action)
// NOTE Actions need a POST so link previews and prefetching can't trigger them
export const review_signing = onRequest({
    serviceAccount: 'save-signing@copy-church.iam.gserviceaccount.com',
}, async (request, response) => {
    const form = (request.method === 'POST' ? request.body : {}) as Record<string, unknown>
    const body = await review_signing_inner(
        String(request.query['petition'] ?? ''),
        String(request.query['id'] ?? ''),
        String(request.query['token'] ?? ''),
        String(form['action'] ?? ''),
        String(form['name'] ?? '').trim(),
        String(form['position'] ?? '').trim(),
    )
    response.status(200).send(render_page(body))
})


// Main logic for reviewing a signing (returns HTML body)
async function review_signing_inner(petition:string, id:string, token:string, action:string,
        name:string, position:string):Promise<string>{

    // Validate params before using them in db paths
    if (!petition_ids.includes(petition) || !/^[\w~-]+$/.test(id) || !token){
        return `<p>Invalid review link.</p>`
    }

    // Get signing and verify token
    const doc_signing = fire_db.doc(`petitions/${petition}/signers/${id}`)
    const doc_private = doc_signing.collection('private').doc('data')
    const [signing, priv] = await Promise.all([doc_signing.get(), doc_private.get()])
    if (!signing.exists || !tokens_match(priv.data()?.['review_token'], token)){
        return `<p>Signing not found (it may have already been rejected).</p>`
    }

    // Get signing data
    const data = signing.data() as Record<string, string|boolean>
    const type = String(data['type'])

    // Approve, saving any edits to name/position (only for types that show those fields)
    if (action === 'approve'){
        const changes:Record<string, string|boolean> = {reviewed: true}
        if (type !== 'unpub'){
            if (!name){
                return `<p>Name can't be empty. Go back and try again.</p>`
            }
            changes['name'] = name
            data['name'] = name
        }
        if (type === 'person'){
            changes['position'] = position
            data['position'] = position
        }
        await doc_signing.update(changes)
    }

    // Summarise signing
    const summary = `
        <h2>${escape_html(String(data['name'])) || '[unpublished]'}</h2>
        <p>Type: ${escape_html(type)}<br>
        Position: ${escape_html(String(data['position']))}<br>
        Country: ${escape_html(String(data['country']))}<br>
        Email: ${escape_html(String(priv.data()?.['email']))}</p>`

    // Confirm approval
    if (action === 'approve'){
        return summary + `<p><strong>Approved</strong> and now public.</p>`
    }

    // Reject by deleting the signing, but keep the uniqueness record so the email can't reuse it
    if (action === 'reject'){
        const batch = fire_db.batch()
        batch.delete(doc_private)
        batch.delete(doc_signing)
        batch.update(fire_db.doc(`petitions/${petition}/uniqueness/${id}`), {
            rejected: FieldValue.serverTimestamp(),
        })
        await batch.commit()
        return summary + `<p><strong>Rejected</strong> and deleted.</p>`
    }

    // Editable fields, matching those the signing form shows for each type
    let fields = ''
    if (type !== 'unpub'){
        fields += `<label>Name<input name="name" required
            value="${escape_html(String(data['name']))}"></label>`
    }
    if (type === 'person'){
        fields += `<label>Position<input name="position"
            value="${escape_html(String(data['position']))}"></label>`
    }

    // Show current status and action buttons
    const reviewed = !!data['reviewed']
    const status = reviewed ? "Already approved (public)" : "Awaiting review"
    return summary + `
        <p><em>${status}</em></p>
        <form method="post" class="edit">${fields}<input type="hidden" name="action" value="approve">
            <button class="approve">${reviewed && fields ? "Save" : "Approve"}</button></form>
        <form method="post"><input type="hidden" name="action" value="reject">
            <button class="reject">Reject</button></form>`
}
