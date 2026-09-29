
// Helpers and types shared by update_watch_data.ts and the private steps it loads
// (.private/): writing data files, owner names, license detection, and parsing
// copyright notices into their holders.

import {writeFileSync} from 'node:fs'

import type {Translation, Owner, LicenseTerms} from '../src/_data/watch/types.ts'


export const DATA_DIR = new URL('../src/_data/watch/', import.meta.url)

export const args = new Set(process.argv.slice(2))
const DRY_RUN = args.has('--dry-run')


// ---- small generic helpers ----

export function save_json(name:string, data:unknown, dir = DATA_DIR):void{
    // Write one of our own data (or cache) files, matching the repo's existing 4-space formatting
    if (DRY_RUN){
        console.info(`[dry-run] would write ${name}`)
        return
    }
    writeFileSync(new URL(name, dir), JSON.stringify(data, null, 4) + '\n')
}

export function sort_keys<T>(record:Record<string, T>):Record<string, T>{
    // Sort a cache by key before saving, so a refresh only shows real changes in the diff
    return Object.fromEntries(Object.entries(record).sort(([a], [b]) => a.localeCompare(b)))
}

// Fetch each key in `keys` into `cache` one at a time, to go easy on the source — a failed fetch
// is left uncached, to retry next run. Returns how many failed.
export async function fetch_into<T>(cache:Record<string, T>, keys:string[],
        fetcher:(key:string) => Promise<T>):Promise<number>{
    let failed = 0
    for (const key of keys){
        try {
            cache[key] = await fetcher(key)
        } catch (error){
            console.warn(`Lookup failed for ${key}: ${(error as Error).message}`)
            failed += 1
        }
    }
    return failed
}

// Legal-entity suffixes to ignore when turning an owner name into an id, so e.g. "Bridge
// Connectivity Solutions" and "Bridge Connectivity Solutions Pvt. Ltd." collapse to one owner
const ORG_SUFFIX_RE =
    /,?\s*\b(pvt\.?\s*ltd\.?|ltd\.?|llc\.?|inc\.?|corp\.?|corporation|gmbh|plc\.?|s\.a\.?|e\.?\s*v\.?)\s*$/i

export function slugify(name:string):string{
    // Turn an owner display name into a stable, url-safe id — also drops a leading "The" so
    // e.g. "Bible Society of Papua New Guinea" and "The Bible Society of Papua New Guinea"
    // collapse to one owner. Keeps any Unicode letter/number (not just a-z0-9) so a non-Latin-
    // script name (e.g. Cyrillic) still gets a real, distinguishing id instead of every such name
    // collapsing to the same empty string and silently merging into one fake shared owner.
    const stripped = name.replace(ORG_SUFFIX_RE, '').replace(/^the\s+/i, '').trim()
    return stripped.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '_').replace(/^_+|_+$/g, '')
}

export async function fetch_json<T>(url:string, headers:Record<string, string> = {}):Promise<T>{
    const res = await fetch(url, {headers})
    if (!res.ok)
        throw new Error(`Failed to fetch ${url}: ${res.status}`)
    return res.json() as Promise<T>
}

// Other names sources use for an org (short forms, typos, old names, translations), keyed by
// slug, mapped to the one name it's listed under
const ORG_ALIASES:Record<string, string> = {
    hosanna: 'Hosanna/Faith Comes By Hearing',
    twftw: 'The Word for the World International',
    twftw_international: 'The Word for the World International',
    word_for_the_world: 'The Word for the World International',
    word_for_the_world_bible_translators_international: 'The Word for the World International',
    wycliffe: 'Wycliffe Bible Translators, Inc.',
    wyciiffe_bible_translators: 'Wycliffe Bible Translators, Inc.',
    wyclyffe_bible_translators: 'Wycliffe Bible Translators, Inc.',
    pioneer: 'Pioneer Bible Translators',
    pioneer_bible_tanslators: 'Pioneer Bible Translators',
    pioneer_bible_tranalators: 'Pioneer Bible Translators',
    tsco_seed_co: 'The Seed Company',
    seed_co: 'The Seed Company',
    bible_league: 'Bible League International',
    world_home_bible_league: 'Bible League International',  // Its former name
    international_bible_society: 'Biblica, Inc.',  // Its former name
    bible_society_of_australia: 'Bible Society Australia',
    honduras_bible_society_of: 'Bible Society of Honduras',
    nigerian_bible_translation_trust: 'The Nigeria Bible Translation Trust',
    gillbt: 'Ghana Institute of Linguistics, Literacy and Bible Translation',
    cabtal: 'Cameroon Association for Bible Translation and Literacy',
    sil_png: 'SIL Papua New Guinea',
    l_assoc_nationale_traduction_bible_et_l_alphabt:
        'Association Nationale pour la Traduction de la Bible et l’Alphabétisation',
    coordination_inter_eglises_pour_la_traduction_et_l_alphabetisation_en_langue_gabonaise:
        'Coordination Inter-Eglises pour la Traduction et l\'alphabétisation en Langue Gabonaise',
    union_nacional_de_traductores_indigenas: 'Unión Nacional de Traductores Indígenas',
    институт_перевода_библии: 'Institute for Bible Translation, Russia',
    artist_for_israel_international: 'Artists for Israel International',
    door_43_international_mission_community: 'Door43 World Missions Community',
    gilakmedia_com: 'Gilak Media',
    wilbur_n_pickering_thm_phd: 'Wilbur N. Pickering',
    far_east_broadcasting_company: 'Far East Broadcasting Company',
    // Whole notices a parse couldn't reduce to a name
    malayalam_bible_binoy_chacko_audio_bible_nt_ot_binoy_chacko_ministries:
        'Binoy Chacko Ministries',
    yenziwe_yibiblica_inc_kanye_le_davar_partners_international: 'Biblica, Inc.',
}

function clean_owner_name(name:string):string{
    // Drop punctuation left dangling at the end of a name ("Barwani, .", "Odisha.") — but not
    // the period of an abbreviation ("Inc.", "Jr.", "e.V.", "Corp.")
    let cleaned = name.replace(/\s+/g, ' ').replace(/(?:\s*[,;:]\s*\.?|\s+\.)+\s*$/, '').trim()
    const last_word = /(?:^|[^\p{L}.])(\p{L}+)\.$/u.exec(cleaned)?.[1]
    if (last_word && last_word.length >= 4 && last_word.toLowerCase() !== 'corp')
        cleaned = cleaned.slice(0, -1)
    return cleaned
}

function get_or_create_owner(owners:Owner[], raw_name:string):string{
    // Find an existing owner by name (or one of its aliases), or add a new one — returns its id
    const cleaned = clean_owner_name(raw_name)
    const name = ORG_ALIASES[slugify(cleaned)] ?? cleaned
    const id = slugify(name)
    if (!owners.some(o => o.id === id))
        owners.push({id, name})
    return id
}

// Many fetch.bible attributions are full copyright notices ("Copyright © 1927, 2009 Wycliffe
// Bible Translators, Inc.") rather than a bare org name — left as-is, the year list would splinter
// one org into a separate "owner" per copyright-year combination. Strip it down to the org name.
export function strip_copyright_notice(text:string):string{
    let name = text.trim()
    name = name.replace(/^copyright\s*/i, '')
    name = name.replace(/^\(c\)\s*/i, '')
    name = name.replace(/^©\s*/, '')
    // Each date token is a bare year ("2019") or a full ISO date ("2019-07-01") — a full date's
    // "-MM-DD" suffix isn't itself a year-range separator, so it must be consumed here too or it's
    // left dangling in front of the org name (e.g. "-07-01 Wycliffe Bible Translators, Inc.")
    const date_token = String.raw`\d{4}(?:-\d{2}-\d{2})?`
    name = name.replace(
        new RegExp(String.raw`^${date_token}(?:\s*[-–—,]\s*${date_token})*\s*`), '')
    return name.trim()
}

// Names that show up as an "attribution" or "rights holder" in source data but are really just a
// hosting/aggregation platform for texts they don't themselves hold rights to (most often public
// domain ones) — crediting them as the owner would be wrong, e.g. eBible.org mirrors plenty of
// translations it didn't produce and has no rights over. A source can add its own (lowercased).
export const AGGREGATOR_NAMES = new Set(['ebible.org'])

export function owner_id_for(owners:Owner[], attribution:string):string{
    // "public domain" (or a blank attribution) isn't a rights holder — don't invent a fake owner
    // for it, just leave the license terms owner as 'unknown'. Same for a bare hosting platform.
    const name = strip_copyright_notice(attribution)
    if (!name || /^(?:public domain|anonymous)$/i.test(name)
            || AGGREGATOR_NAMES.has(name.toLowerCase()))
        return 'unknown'
    return get_or_create_owner(owners, name)
}

export const today = ():string => new Date().toISOString().slice(0, 10)


// ---- license detection (ported from fetch.bible's collector/src/parts/license.ts) ----

const STANDARD_LICENSES = new Set([
    'public', 'cc-by', 'cc-by-sa', 'cc-by-nc', 'cc-by-nc-sa', 'cc-by-nd', 'cc-by-nc-nd',
])

function license_from_url(url:string):{license:string, url:string}|null{
    const clean = url.replace(/[^\x20-\x7E]/g, '')
    const normalized = clean.replace(/^http:/, 'https:').replace(/\/?$/, '/')
    const cc_match = /creativecommons\.org\/licenses\/(by[a-z-]*)\//i.exec(normalized)
    if (cc_match){
        const license = `cc-${cc_match[1]!.toLowerCase()}`
        if (STANDARD_LICENSES.has(license))
            return {license, url: normalized}
    }
    if (/creativecommons\.org\/publicdomain\/zero\//i.test(normalized))
        return {license: 'public', url: normalized}
    return null
}

// A Creative Commons license written out as a code or name rather than a URL, e.g.
// "CC BY-NC-SA 4.0", "CC-BY-SA-4.0", or "Creative Commons Attribution-ShareAlike"
function license_from_cc_name(text:string):string|null{
    if (/\bCC0\b|\bCC\s+zero\b/i.test(text))
        return 'public'

    // Collect which of the NC/SA/ND clauses the license names
    let clauses:string[]|null = null
    const code_match = /\bCC[\s-]*BY((?:[\s-]*(?:NC|SA|ND)\b)*)/i.exec(text)
    if (code_match){
        clauses = code_match[1]!.toLowerCase().match(/nc|sa|nd/g) ?? []
    } else {
        const name_re =
            /creative\s+commons\s*(?:license\s*:?\s*)?[-–]?\s*attribution([\w\s-]{0,40})/i
        const name_match = name_re.exec(text)
        if (name_match){
            const rest = name_match[1]!.toLowerCase()
            clauses = []
            if (/non[\s-]?commercial/.test(rest)) clauses.push('nc')
            if (/share[\s-]?alike/.test(rest)) clauses.push('sa')
            if (/no[\s-]?deriv/.test(rest)) clauses.push('nd')
        }
    }
    if (!clauses)
        return null

    // Assemble in the standard clause order, e.g. 'cc-by-nc-sa'
    const found = clauses
    const license = ['cc-by', ...['nc', 'sa', 'nd'].filter(c => found.includes(c))].join('-')
    return STANDARD_LICENSES.has(license) ? license : null
}

export function license_from_text(text:string):{license:string, url:string}|null{
    const url_match =
        /https?:\/\/creativecommons\.org\/(?:licenses|publicdomain)\/[^\s"'<>()]+/i.exec(text)
    if (url_match){
        const detected = license_from_url(url_match[0])
        if (detected) return detected
    }
    const cc_license = license_from_cc_name(text)
    if (cc_license)
        return {license: cc_license, url: ''}
    if (/public domain/i.test(text) && !/not public domain/i.test(text))
        return {license: 'public', url: ''}
    return null
}


// ---- copyright notice holders ----

// Boilerplate that marks the end of a holder's name within a copyright notice
const HOLDER_END_RE = new RegExp([
    'all rights reserved', 'licensed', 'released under', 'made available under',
    'creative commons', 'attribution', 'cc[\\s-]*by', 'cc0', 'for church use only',
    'used (?:by|with) permission', 'must appear', 'is a trademark', 'original publication',
    'current version', 'grabad\\w* por', 'recorded by', 'under\\s+cc',
    'in (?:cooperation|collaboration|partnership) with', 'audio:', 'text:', ';', '\\n',
].join('|'), 'i')

export function clean_holder(segment:string):string{
    // Reduce one ©/℗ notice segment ("2005, Wycliffe Bible Translators, Inc. All rights
    // reserved.") down to just the holder's name ("Wycliffe Bible Translators, Inc.")
    // Some statements run sentences together with no space ("...Davar Partners
    // InternationalBiblica® Open..."), so a trademarked title glued onto a name also ends it
    let name = segment.replace(/&amp;/g, '&')
        .replace(/(\p{Ll})(?=\p{Lu}\S*[®™])/gu, '$1\n')
        .replace(/(?:scripture\s+)?text\s+used\s+by\s+permission\s+of\s+/i, '')
    name = name.split(HOLDER_END_RE)[0]!
    name = name.replace(/\([^)]*\)|[[\]\\"*]/g, '').replace(/\p{Nd}{4}|\b20__\b|\byear\b/giu, '')
    name = name.replace(/^[\s:,.\-–/&]*(?:(?:audio|text|by)\b\s*)*/i, '')
        .replace(/(?:[\s,;:\-–/&]|\band\b)+$/i, '')
    name = name.replace(/\s+/g, ' ').trim()
    // Anything left without a single letter isn't a name
    return /\p{L}/u.test(name) ? name : ''
}

function strip_acronym(name:string):string{
    // Drop a leading acronym that just repeats a longer name ("CET - Communauté des Eglises
    // Travaillistes"), but not one that's part of a short name ("FCBH - Malaysia")
    return name.replace(/^[\p{L}.]{2,8}\s+[-–]\s+(?=\S+\s+\S+\s+\S)/u, '')
}

function resolve_org_name(name:string, entry_orgs:string[]):string{
    // Map a notice's short form of a name onto the org's full name — either a known alias, or
    // one of the entry's own orgs that it abbreviates ("Hosanna" for "Hosanna/Faith Comes By
    // Hearing", "Wycliffe" for "Wycliffe Bible Translators, Inc.")
    const slug = slugify(name)
    if (slug in ORG_ALIASES)
        return ORG_ALIASES[slug]!
    for (const org of entry_orgs){
        const org_slug = slugify(org)
        if (slug && (org_slug === slug || org_slug.startsWith(`${slug}_`)))
            return org
    }
    return name
}

// Org names already known, by slug — `embeddable` is the subset specific enough to be picked out
// from inside a longer name (a source's own orgs, and names of 3+ words), so a short name like
// "Wycliffe" doesn't swallow "Wycliffe India"
export interface OrgIndex {
    known:Map<string, string>
    embeddable:string[]
}

function known_orgs_in(name:string, entry_orgs:string[], orgs:OrgIndex):string[]{
    // The known orgs a holder name refers to — itself if it is one (or abbreviates one of the
    // entry's own orgs), else any known org names embedded in it, e.g. from a notice in another
    // language ("Biblica, Inc. і Davar Partners International")
    const resolved = resolve_org_name(name, entry_orgs)
    if (resolved !== name || orgs.known.has(slugify(name)))
        return [resolved]
    const padded = `_${slugify(name)}_`
    const found = orgs.embeddable.filter(slug => padded.includes(`_${slug}_`))
    // Only the longest match counts where one known name contains another
    return found.filter(slug => !found.some(other => other !== slug && other.includes(slug)))
        .map(slug => orgs.known.get(slug)!)
}

export function split_holders(name:string, entry_orgs:string[], orgs:OrgIndex):string[]{
    // Co-holders are listed with commas before an acronym ("NHGM - New Harvest Global Ministries,
    // TSCo - Seed Co."), or joined by "and"/"&" — but an "and" only separates known orgs from the
    // rest, since otherwise it's more likely part of a single name ("Language Developers and Bible
    // Translators and Hosanna" is two holders, not three)
    const holders:string[] = []
    for (const listed of name.split(/,\s*(?=[\p{L}.]{2,8}\s+[-–]\s)/u)){
        let pending:string[] = []
        const flush = () => {
            if (pending.length)
                holders.push(resolve_org_name(strip_acronym(pending.join(' and ')), entry_orgs))
            pending = []
        }
        const parts = listed.split(/\s+(?:and|&)\s+/i).map(clean_holder).filter(Boolean)
        for (const part of parts.map(strip_acronym)){
            const found = known_orgs_in(part, entry_orgs, orgs)
            if (found.length){
                flush()
                holders.push(...found)
            } else {
                pending.push(part)
            }
        }
        flush()
    }
    return holders
}

export function build_org_index(owners:Owner[], source_orgs:string[]):OrgIndex{
    // Every org name already known, for picking org names out of messy notices — a source's own
    // orgs are always specific enough to be embeddable
    const known = new Map(owners.map(o => [o.id, o.name]))
    for (const [alias, name] of Object.entries(ORG_ALIASES)){
        known.set(alias, name)
        known.set(slugify(name), name)
    }
    const source_slugs = new Set<string>()
    for (const org of source_orgs.filter(Boolean)){
        known.set(slugify(org), org)
        source_slugs.add(slugify(org))
    }
    return {
        known,
        embeddable: [...known.keys()]
            .filter(slug => source_slugs.has(slug) || slug.split('_').length >= 3),
    }
}


// ---- source data shared between steps ----

// Every DBL uid and eBible id that find.bible links each of its translations to — one translation
// often links several DBL entries (e.g. ARBNAV links both its 1997 and 2012 editions), so these
// keep all of them, not just the single uid stored in external_ids.dbl
export interface FindBibleIndex {
    by_dbl:Map<string, Set<string>>  // DBL uid -> find.bible ids
    by_ebible:Map<string, Set<string>>  // lowercased eBible id -> find.bible ids
}

// find.bible's versions (not yet listed — the private steps may supersede some) and their links
export interface FindBible {
    versions:Translation[]
    index:FindBibleIndex
    dbl_uids:Map<string, string[]>  // find.bible id -> every DBL uid it links to
}

export interface FetchBibleEntry {
    name:{english:string, english_abbrev:string}
    year:number
    copyright:{
        // 'license' is a standard license key string, or an inline restrictions object for a
        // translation whose terms don't match any of the standard ones — treat that as 'custom'
        licenses:{license:string|Record<string, unknown>, url:string}[]
        attribution:string
        attribution_url:string
    }
}

// The DBL/eBible ids fetch.bible's collection records for a translation (its source meta.json)
export interface FetchCollectionIds {
    dbl?:string
    ebible?:string
}

// fetch.bible's translations, and the DBL/eBible ids its collection records for each
export interface FetchBible {
    bibles:Record<string, FetchBibleEntry>
    collection_ids:Map<string, FetchCollectionIds>
}

// fetch.bible's language code for a translation — its ids are always '<language>_<name>'
export const fetch_language = (fb_id:string):string => fb_id.split('_')[0]!

// The dataset being built, plus the public sources already loaded
export interface BuildState {
    translations:Translation[]
    owners:Owner[]
    license_terms:LicenseTerms[]
    find_bible:FindBible
    fetch_bible:FetchBible
}

// The private steps, in the order update_watch_data.ts runs them (implemented in .private/)
export interface DblSteps {
    // Refresh the private cache, if asked to — runs first, as it may prompt
    refresh_catalog():Promise<void>
    // List text entries, returning the find.bible ids they supersede
    add_text(state:BuildState):Set<string>
    // Add terms to listed versions, before other sources fill in the rest
    add_terms(state:BuildState):void
    // List audio recordings
    add_audio(state:BuildState):void
    // Resolve whatever can still be resolved, after translations too old to track are dropped
    resolve_remaining(state:BuildState):Promise<void>
}

