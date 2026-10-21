// Builds the data for the site search (see theme/SearchPalette.vue) from the built pages
// NOTE Reads the rendered HTML rather than the markdown so that everything visitors see is
//      searchable, including content from components and JSON data

import fs from 'fs'
import path from 'path'

// NOTE linkedom rather than jsdom as it parses pages around 5x faster
import {parseHTML} from 'linkedom'

import owners from '../src/_data/watch/owners.json'
import translations from '../src/_data/watch/translations.json'
import license_terms from '../src/_data/watch/license_terms.json'
import languages from '../src/_data/watch/languages.json'


// Where the search data is written to within the output dir
export const search_dir = '_search'

// Paths that aren't searchable
// NOTE /watch/owner only shows something for an owner in its hash (owners are indexed separately)
const excluded = /^\/(404|watch\/owner)(\/|$)/

// Pages that aren't in the sidebar, and which group they belong to in search results
const extras:Record<string, string> = {
    '/': "Pages",
    '/about/': "About",
    '/free/': "About",
    '/ianal/': "About",
    '/share/': "Pages",
    '/publish/book/': "Pages",
    '/statement/explanation/': "Act",
    '/initiatives/bibles/open/': "Ratings",
    '/initiatives/bibles/privacy/': "Ratings",
    '/watch/translations/': "Ratings",
}

// Searches that should lead to a page even if it doesn't say them prominently (comma separated)
const keywords:Record<string, string> = {
    '/': "home, start, welcome, introduction",
    '/about/': "contact, email, team, who we are",
    '/free/': "public domain, cc0, reuse, republish, license",
    '/ianal/': "legal advice, lawyer, disclaimer",
    '/share/': "memes, images, pictures, graphics",
    '/dedicate/': "cc0, public domain, license, badge, waive copyright, unlicense",
    '/statement/': "sunnyvale, petition, sign, signatures",
    '/watch/': "owners, publishers, licensing, bible publishers, translation owners",
    '/watch/translations/': "bible versions, translations, all bibles, languages",
    '/initiatives/bibles/': "bible translations, english bibles, versions",
    '/explain/copyright/': "how copyright works, fair use, licenses",
    '/explain/objections/': "objections, faq, questions",
}


export interface PageEntry {
    u:string  // url
    t:string  // title
    s:string  // section
    d?:string  // description
    k?:string  // keywords
    x:string  // text
    h?:[string, string][]  // headings [anchor, text]
}

// Owners and Bible versions in Bible Org Watch, as arrays as there are thousands of versions
export interface WatchData {
    owners:[string, string][]  // [id, name]
    languages:string[]  // names
    // [name, abbreviation as shown, language (index), owners (indexes), abbreviation in data if
    //  different, 1 if audio]
    versions:[string, string, number, number[], string?, 1?][]
}


// Collapse an element's text, ignoring things that aren't content
// NOTE Bible Org Watch's table of owners is left out as each owner is indexed separately
function text_of(el:Element):string{
    el.querySelectorAll(
        'script, style, svg, template, noscript, form, dialog, nav, button, .header-anchor, .footnote-ref, '
        + '.footnote-backref, .footnote-back, .owner_table'
    ).forEach(e => e.remove())
    // Separate block elements so words in adjacent blocks don't join together
    el.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, td, th, div, br, blockquote')
        .forEach(e => e.after(' '))
    return (el.textContent ?? '').replace(/[\s​⁠]+/g, ' ').trim()
}


// Which group each page in the sidebar belongs to in search results
type SidebarItem = {text?:string, link?:string, items?:SidebarItem[]}
function sections_from(sidebar:Record<string, SidebarItem[]>):Record<string, string>{
    const sections:Record<string, string> = {...extras}
    for (const [base, groups] of Object.entries(sidebar)){
        for (const group of groups){
            for (const item of group.items ?? []){
                // NOTE Groups without a name (e.g. a link back to all objections) aren't sections
                if (item.link?.startsWith('/') && !(item.link in sections) && group.text){
                    sections[item.link] = base === '/objections/' ? `Objections · ${group.text}`
                        : group.text || "Pages"
                }
            }
        }
    }
    return sections
}


// Convert a built file path to the url it is served at (clean urls, with directory indexes)
function url_for(file:string):string{
    return ('/' + file.replace(/\\/g, '/'))
        .replace(/(^|\/)index\.html$/, '$1')
        .replace(/\.html$/, '')
}


const h1_titles = new Map<string, string>()

function page_entry(html:string, url:string, section:string, site_title:string,
        site_desc:string):PageEntry|null{
    const doc = parseHTML(html).document
    if (doc.querySelector('meta[name="robots"][content*="noindex"]')){
        return null
    }

    // The content area (the home page has no <main>)
    const content = doc.querySelector('main .vp-doc') ?? doc.querySelector('main')
        ?? doc.querySelector('#VPContent')
    if (!content){
        return null
    }

    const title = (doc.querySelector('title')?.textContent ?? '')
        .replace(new RegExp(` \\| ${site_title}$`), '').trim() || site_title
    const desc = doc.querySelector('meta[name="description"]')?.getAttribute('content') ?? ''

    // Headings that can be linked to, other than the page's title
    const headings:[string, string][] = []
    for (const h of content.querySelectorAll('h2[id], h3[id]')){
        const heading = text_of(h.cloneNode(true) as Element)
        if (heading && heading !== title){
            headings.push([h.id, heading])
        }
    }

    // A page's <h1> is more specific than a <title> shared with other pages (see build_search)
    const h1 = content.querySelector('h1')
    const h1_text = h1 ? text_of(h1.cloneNode(true) as Element) : ''
    if (h1_text && h1_text !== title){
        h1_titles.set(url, h1_text)
    }

    const entry:PageEntry = {u: url, t: title, s: section, x: text_of(content)}
    if (desc && desc !== site_desc){
        entry.d = desc
    }
    if (keywords[url]){
        entry.k = keywords[url]
    }
    if (headings.length){
        entry.h = headings
    }
    return entry
}


// Owners and Bible versions from Bible Org Watch (only on pages once their data has loaded)
function watch_data():WatchData{
    const owned = new Set<string>()
    const owners_of:Record<string, string[]> = {}
    for (const term of license_terms){
        if (term.owner_id !== 'unknown'){
            (owners_of[term.translation_id] ??= []).push(term.owner_id)
            owned.add(term.owner_id)
        }
    }
    // Only owners of a version, as the owner page shows nothing otherwise
    const owner_list = owners.filter(o => owned.has(o.id))
    const owner_index = new Map(owner_list.map((o, i) => [o.id, i]))
    const language_list:string[] = []
    const language_index = new Map<string, number>()
    const language_names:Record<string, string> = languages

    const versions = translations.map(item => {
        const language = language_names[item.language] ?? item.language
        if (!language_index.has(language)){
            language_index.set(language, language_list.push(language) - 1)
        }
        // Abbreviations often lead with the language code, which the versions page doesn't show
        const abbrev = item.abbrev.length > 3
            && item.abbrev.slice(0, 3).toLowerCase() === item.language.toLowerCase()
            ? item.abbrev.slice(3) : item.abbrev
        const version:WatchData['versions'][number] = [item.name, abbrev, language_index.get(language)!,
            (owners_of[item.id] ?? []).flatMap(id => owner_index.get(id) ?? [])]
        if (abbrev !== item.abbrev || item.medium === 'audio'){
            version.push(abbrev === item.abbrev ? undefined : item.abbrev)
        }
        if (item.medium === 'audio'){
            version.push(1)
        }
        return version
    })
    return {owners: owner_list.map(o => [o.id, o.name]), languages: language_list, versions}
}


// Write the search data into the built site (run after pages are rendered)
export async function build_search(out_dir:string, site_title:string, site_desc:string,
        sidebar:Record<string, SidebarItem[]>){

    const sections = sections_from(sidebar)
    const files = (fs.readdirSync(out_dir, {recursive: true}) as string[])
        .filter(f => f.endsWith('.html'))
        .sort()

    const pages:PageEntry[] = []
    for (const file of files){
        const url = url_for(file)
        if (excluded.test(url)){
            continue
        }
        if (!(url in sections)){
            console.warn(`[search] ${url} isn't in the sidebar or extras (.vitepress/search.ts), `
                + `so is listed under "Pages"`)
        }
        const html = fs.readFileSync(path.join(out_dir, file), 'utf8')
        const entry = page_entry(html, url, sections[url] ?? "Pages", site_title, site_desc)
        if (entry){
            pages.push(entry)
        }
    }

    // Order so that ties are won by main pages, then the rest
    const rank = (url:string) => url === '/' ? 0 : url.split('/').length
    pages.sort((a, b) => rank(a.u) - rank(b.u))

    // Pages that share a <title> with a main page above them are known by their <h1> instead
    const first_with_title = new Map<string, PageEntry>()
    for (const page of pages){
        if (!first_with_title.has(page.t)){
            first_with_title.set(page.t, page)
        } else if (h1_titles.has(page.u)){
            page.t = h1_titles.get(page.u)!
        }
    }
    h1_titles.clear()

    fs.mkdirSync(path.join(out_dir, search_dir), {recursive: true})
    // Text separately so that titles etc. can be searched sooner, while it downloads
    fs.writeFileSync(path.join(out_dir, search_dir, 'pages.json'),
        JSON.stringify(pages.map(({x, ...rest}) => rest)))
    fs.writeFileSync(path.join(out_dir, search_dir, 'text.json'),
        JSON.stringify(Object.fromEntries(pages.map(p => [p.u, p.x]))))
    fs.writeFileSync(path.join(out_dir, search_dir, 'watch.json'), JSON.stringify(watch_data()))
}
