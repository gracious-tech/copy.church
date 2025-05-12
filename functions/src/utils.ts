
export function buffer_to_url64(buffer:ArrayBuffer):string{
    // Encode binary data as a url-safe base64 string
    // NOTE btoa only works with strings so convert each byte to a char
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))
    // Convert to urlsafe base64
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '~')
}


export function generate_token(bytes=15):string{
    // Return a random string that is url safe (can be used for authentication or uuid etc)
    // NOTE Standard UUIDs are 15.25 bytes random + 0.75 version info (16 in total)
    // NOTE Returned string will be bytes/3*4 in length (multiples of 3 best for base64)
    const random_buffer = crypto.getRandomValues(new Uint8Array(bytes)).buffer
    return buffer_to_url64(random_buffer)
}
