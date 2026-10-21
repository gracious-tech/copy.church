// Matching, ranking and snippets for the site search (see SearchPalette.vue)
// NOTE Kept free of the DOM so it can be benchmarked in Node


export interface Doc {
    title:string
    href:string
    section:string
    source:'pages'|'heading'|'watch'
    desc?:string
    t:string  // Title words
    m:string  // Metadata words (section, description, keywords)
    x:string  // Body words
    raw:string  // Body as written
    k?:string[]  // Searches this is the best result for
    boost:number  // Added to the score of any match
    starts?:number  // Which characters start a word in t, m or x (see starts_of)
}

export interface Result {
    d:Doc
    href:string  // With a text fragment, for new tabs
    words?:string  // The words as found in the text, for highlighting on arrival
    at?:number  // Where the words are in the text
}


// TEXT

// Words only: lower case, accents and apostrophes dropped (so "gods" finds "God’s") and British
// spellings made American
// NOTE Runs on all text when search data loads, so fewer passes over it matters on phones
export const words = (s:string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ’‘']/g, '')
    .replace(/\b(hon|lab|neighb|savi|fav|behavi|endeav|col|rig)our/g, '$1or')
    .replace(/[^a-z0-9 ]+/g, ' ').replace(/ {2,}/g, ' ').trim()

// Space padded, so that " word" means "starts a word"
export const pad = (s = '') => ` ${words(s)} `

// Which characters start a word in some words() text, as bits, so docs that can't contain a
// query's words can be skipped with one check rather than several string scans
// NOTE There are thousands of docs (Bible versions), and such checks were most of a search's time
const bit = (c:number) => 1 << (c >= 97 ? c - 97 : 26 + c % 6)  // a-z, else 0-9 sharing 6 bits
export function starts_of(...texts:string[]):number{
    let bits = 0
    for (const text of texts){
        for (let i = text.indexOf(' '); i !== -1 && i < text.length - 1; i = text.indexOf(' ', i + 1)){
            bits |= bit(text.charCodeAt(i + 1))
        }
    }
    return bits
}

export const terms = (q:string) => q.split(' ').filter(Boolean)

export const esc = (s:string) => s.replace(/[&<>"]/g,
    c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c]!)


// DATA

export function pages_docs(all:any[]):Doc[]{
    return all.flatMap(e => {
        const page:Doc = {title: e.t, href: e.u, section: e.s, desc: e.d, source: 'pages', t: pad(e.t),
            m: pad([e.s, e.d, e.k].join(' ')), x: ' ', raw: '',  // Text is added by add_text()
            k: e.k?.split(',').map(words), boost: 12}
        // Headings are found by their own words only (the page's title would match every one)
        // and are below their page, which is usually what's wanted when both match
        const headings:Doc[] = (e.h ?? []).map(([anchor, heading]:[string, string]) => ({
            title: heading, href: `${e.u}#${anchor}`, section: e.t, source: 'heading', t: pad(heading),
            m: ' ', x: ' ', raw: '', boost: -25,
        }))
        return [page, ...headings]
    })
}

// Add pages' text (downloaded separately as it's most of the data)
// NOTE Preparing it all takes a few hundred ms on phones, so can pause to let typing etc. respond
export async function add_text(docs:Doc[], text:Record<string, string>, pause?:() => Promise<void>){
    let since = performance.now()
    for (const d of docs){
        const raw = d.source === 'pages' ? text[d.href] : undefined
        if (raw){
            d.raw = raw
            d.x = pad(raw)
        }
        d.starts = starts_of(d.t, d.m, d.x)
        if (pause && performance.now() - since > 8){
            await pause()
            since = performance.now()
        }
    }
}

// Owners and Bible versions from Bible Org Watch (see WatchData in ../search.ts), below pages as
// there are thousands of them
export function watch_docs(data:any):Doc[]{
    const owners:Doc[] = data.owners.map(([id, name]:[string, string]) => ({
        title: name, href: `/watch/owner/#o=${id}`, section: "Bible owner", source: 'watch', t: pad(name),
        m: ' ', x: ' ', raw: '', boost: -5,
    }))
    const versions:Doc[] = data.versions.map(([name, abbrev, language, owned, data_abbrev, audio]:
            [string, string, number, number[], string|null|undefined, 1|undefined]) => {
        const title = name + (abbrev ? ` (${abbrev})` : '') + (audio ? " [audio]" : '')
        const owner_names = owned.map(i => data.owners[i][1]).join(', ')
        // The versions page filters by name or abbreviation, so link to it showing just this one
        return {
            title, href: `/watch/translations/#q=${encodeURIComponent(data_abbrev || abbrev || name)}`,
            section: `Bible version · ${data.languages[language]}`, desc: owner_names, source: 'watch',
            t: pad(title), m: pad([data.languages[language], owner_names, data_abbrev].join(' ')), x: ' ',
            raw: '',
            // Typing a version's abbreviation should find it first, and English ones first of those
            k: [abbrev, data_abbrev].filter(Boolean).map(a => words(a!)),
            boost: data.languages[language] === "English" ? -17 : -20,
        }
    })
    const docs = [...owners, ...versions]
    for (const d of docs){
        d.starts = starts_of(d.t, d.m, d.x)
    }
    return docs
}


// SCORING

// A query (already passed through words()) as the strings score() looks for
// NOTE Made once per search rather than per doc, as there are thousands of docs
interface Query {
    q:string
    phrase:string  // " q", the whole query starting a word
    starts:string[]  // " word", each word starting a word
    whole:string[]  // " word ", each word as a whole word
    in_m:string[]  // What each word must be in the metadata: whole if short and finished
    prefix:boolean[]  // Whether each word may be the start of a longer one
    need:number  // The characters the words start with (see starts_of)
}

function prepare(q:string):Query{
    const ws = terms(q)
    // A finished 1-2 letter word must be a whole word outside the title, but the last word
    // (still being typed) may be the start of one
    const prefix = ws.map((w, i) => w.length > 2 || i === ws.length - 1)
    return {q, phrase: ` ${q}`, starts: ws.map(w => ` ${w}`), whole: ws.map(w => ` ${w} `),
        in_m: ws.map((w, i) => prefix[i] ? ` ${w}` : ` ${w} `), prefix,
        need: starts_of(...ws.map(w => ` ${w}`))}
}

// Score a doc for a query, or null if it doesn't match
function score(p:Query, d:Doc):number|null{
    // Every word must start a word somewhere, so skip docs where none start with its first letter
    const starts = d.starts ??= starts_of(d.t, d.m, d.x)
    if ((starts & p.need) !== p.need){
        return null
    }
    let s = 0
    for (let i = 0; i < p.starts.length; i++){
        if (d.t.includes(p.whole[i]!)) s += 14
        else if (d.t.includes(p.starts[i]!)) s += 10
        else if (d.m.includes(p.in_m[i]!)) s += 5
        // Every word must match somewhere (most docs don't, so the text is only scanned once for them)
        else if (!d.x.includes(p.starts[i]!)) return null
        else if (d.x.includes(p.whole[i]!)) s += 3
        else if (p.prefix[i]) s += 2
        else return null
    }
    // The whole phrase, where it's most prominent (pages may or may not repeat their title in the body)
    if (d.t.startsWith(p.phrase)) s += 60
    else if (d.t.includes(p.phrase)) s += 40
    else {
        if (p.starts.length > 1 && d.x.includes(p.phrase)) s += 25
        if (d.m.includes(p.phrase)) s += 10
    }
    if (d.k?.includes(p.q)) s += 100
    return s + d.boost - d.title.length / 60  // Short, focused titles win ties
}

// The best matches for a query (already passed through words()), best first, and all matches
// NOTE Typing more only ever narrows the matches, so the next search can be of those alone
export function search(q:string, all:Doc[], limit = 50):{top:Doc[], matched:Doc[]}{
    const p = prepare(q)
    const scored:{d:Doc, i:number, s:number}[] = []
    for (let i = 0; i < all.length; i++){
        const s = score(p, all[i]!)
        if (s !== null){
            scored.push({d: all[i]!, i, s})
        }
    }
    const matched = scored.map(r => r.d)
    const top = scored.sort((a, b) => b.s - a.s || a.i - b.i).slice(0, limit).map(r => r.d)
    return {top, matched}
}

// Whether a query only narrows the matches of a previous one (by typing on)
export const narrows = (prev:string, q:string) => prev !== '' && q.startsWith(prev)


// SNIPPETS

// A typed word as it may appear in text: any case, apostrophes allowed between letters
const word_re = (w:string) => [...w].map(c => c.replace(/[.*+?^$()|[\]{}\\]/g, '\\$&')).join("['’]?")
// NOTE Latin letters only (rather than \p{L} with the u flag) as that makes these much faster
const LETTER = "a-z0-9\\u00c0-\\u024f"
const START = `(?<![${LETTER}])`
const REST = `[${LETTER}'’]*`
const GAP = `[^${LETTER}]+`

// The first match of a pattern that starts a word
// NOTE Rather than starting the pattern with START, as a lookbehind makes Safari's regex engine scan
//      long text around 50x slower (START is fine for short text such as titles and snippets)
const letter = new RegExp(`[${LETTER}]`, 'i')
export function at_word_start(pattern:string, text:string):RegExpExecArray|null{
    const re = new RegExp(pattern, 'gi')
    for (let m = re.exec(text); m; m = re.exec(text)){
        if (!letter.test(text[m.index - 1] ?? '')){
            return m
        }
        re.lastIndex = m.index + 1
    }
    return null
}

export function mark(text:string, q:string):string{
    const ws = terms(q)
    if (!ws.length){
        return esc(text)
    }
    // The phrase through to the end of its last word, and each word of 3+ letters on its own
    const phrase = ws.length > 1 ? [`${ws.map(word_re).join(GAP)}${REST}`] : []
    const alone = ws.filter(w => w.length > 2 || ws.length === 1).map(word_re)
    const re = new RegExp(`${START}(${[...phrase, ...alone].join('|')})`, 'gi')
    return text.split(re).map((part, i) => i % 2 ? `<mark>${esc(part)}</mark>` : esc(part)).join('')
}

// Where the words appear in the text as written: the whole phrase if present, else the first word
// NOTE x (the text as words()) is checked first, as a regex that doesn't match must scan the whole
//      text, which for long pages is most of the time a search takes; words in x can be joined
//      where an apostrophe was dropped ("god s" is in "God’s")
export function find(raw:string, q:string, x?:string):RegExpExecArray|null{
    const ws = terms(q)
    if (ws.length > 1 && (x === undefined || new RegExp(ws.join(' ?')).test(x))){
        const phrase = at_word_start(`${ws.map(word_re).join(GAP)}${REST}`, raw)
        if (phrase){
            return phrase
        }
    }
    for (const w of ws){
        if (x !== undefined && !x.includes(w)){
            continue  // E.g. only in the title or keywords
        }
        const m = at_word_start(`${word_re(w)}${REST}`, raw)
        if (m){
            return m
        }
    }
    return null
}

export function snippet(raw:string, at:number, len:number):string{
    const start = at > 40 ? raw.lastIndexOf(' ', at - 40) + 1 : 0
    const end = Math.min(raw.length, at + len + 160)
    return (start > 0 ? '…' : '') + raw.slice(start, end).trim() + (end < raw.length ? '…' : '')
}

export const in_title = (d:Doc, q:string) => terms(q).every(w => d.t.includes(` ${w}`))

// Where a result links to, and the words to highlight there
export function target(d:Doc, q:string):Result{
    if (in_title(d, q) || !d.raw){
        return {d, href: d.href}
    }
    const m = find(d.raw, q, d.x)
    if (!m){
        return {d, href: d.href}
    }
    const fragment = encodeURIComponent(m[0]).replace(/-/g, '%2D')
    return {d, href: d.href + (d.href.includes('#') ? ':~:text=' : '#:~:text=') + fragment, words: m[0],
        at: m.index}
}

// The line under a result's title: where the words were found, else its description
export function line(r:Result, q:string):string{
    if (r.words && r.at !== undefined){
        return mark(snippet(r.d.raw, r.at, r.words.length), q)
    }
    return r.d.desc ? mark(r.d.desc, q) : ''
}
