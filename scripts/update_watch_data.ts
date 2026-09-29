
// Rebuilds the static Bible Society Watch dataset in src/_data/watch/*.json entirely from
// scratch each run — translations.json, owners.json, and license_terms.json are NOT loaded and
// merged with, they're fully replaced, so stale/removed fields and abandoned entries can't
// accumulate across runs. (response_log.json is untouched — that one's hand-curated.)
//
// Which versions are listed: every entry from the private steps first, then every find.bible
// version that isn't one of those. The private steps live in .private/ (not in the public repo,
// see its header for its sources and flags) — without it they're skipped. A closed version
// that has since been re-published as an open edition (e.g. "Biblica® Open ...") is dropped in
// favour of the open one.
// Sources, in order:
//   1. Private — text entries
//   2. find.bible — via the public digitalbiblesociety/data dataset, for versions not in 1
//   3. Private — terms for find.bible versions not listed in 1
//   4. fetch.bible — v1.fetch.bible/manifest.json (license/owner for translations it distributes),
//      plus each translation's meta.json in gracious-tech/fetch_collection for its DBL/eBible ids
//      — only for find.bible versions still without terms.
//   5. major_translation_owners.ts — a small hand-curated owner list for well-known
//      translations (NIV, ESV, etc.) that no other source gives ownership for
//   6. Private — audio recordings, each its own version (medium 'audio')
//   7. Private — whatever it can still resolve for what's left
//   8. eBible — ebible.org/Scriptures/translations.csv (owner) plus each translation's details
//      page (license), only for find.bible versions still without terms that aren't linked to
//      any DBL entry at all. Page text is cached in ebible_cache.json, so each is only ever
//      fetched once.
// Deliberately does NOT consult open.bible (tried and dropped — see git history if it needs
// revisiting; this sandbox's network can't reach it at all).
//
// NOTE Because owners.json is rebuilt fresh, any manually-added Owner fields (website,
// ministry_watch_url) will be lost on the next run unless this script is taught to preserve them.
//
// NOTE Staleness — ebible_cache.json never re-fetches a details page (delete the translationId to
// redo one), so it can be rebuilt reproducibly and nothing is fetched twice. eBible's
// translations.csv, find.bible and fetch.bible are all fetched fresh every run.
//
// Usage:
//   node --experimental-strip-types scripts/update_watch_data.ts [--dry-run]
//       (plus the private flags documented in .private/)

import {existsSync} from 'node:fs'

import type {Translation, Owner, LicenseTerms} from '../src/_data/watch/types.ts'
import type {BuildState, DblSteps, FetchBible, FetchBibleEntry, FetchCollectionIds, FindBible,
    FindBibleIndex} from './watch_common.ts'
import {build_org_index, fetch_into, fetch_json, fetch_language, license_from_text, owner_id_for,
    save_json, sort_keys, split_holders, strip_copyright_notice, today} from './watch_common.ts'
import ebible_cache_json from './ebible_cache.json' with {type: 'json'}
import {major_translation_owners} from './major_translation_owners.ts'


const SCRIPTS_DIR = new URL('./', import.meta.url)
const DBL_MODULE = new URL('../.private/dbl/dbl.ts', import.meta.url)
const FIND_BIBLE_BASE = 'https://raw.githubusercontent.com/digitalbiblesociety/data/master'
const FETCH_BIBLE_MANIFEST = 'https://v1.fetch.bible/manifest.json'
const FETCH_COLLECTION_BASE =
    'https://raw.githubusercontent.com/gracious-tech/fetch_collection/main/bibles'

// Corporate/organizational copyright generally runs 95 years from publication — well past that,
// there's no live rights holder left to hold accountable, so these aren't worth tracking here.
// Modern intentional public-domain releases (e.g. the Berean Standard Bible) are unaffected, since
// they're recent and this filter only looks at age.
const PUBLIC_DOMAIN_AGE_YEARS = 95

// Exceptions to the age filter — translations old enough to trip it but with a known, real
// copyright holder anyway. The King James Version text is still under perpetual English Crown
// copyright (administered via Cambridge University Press) despite being from 1611.
const KEEP_DESPITE_AGE = new Set(['ENGKJV'])

// Translations no source gives a year for, but known to be old enough to trip the age filter (or
// ancient source texts rather than translations) — judged by hand from what each one is
const KNOWN_OLD = new Set([
    'CMNBSW',  // Basset–Su Wenli New Testament, early 1700s
    'CYMZZZP',  // Richard Davies' Welsh Pastoral Epistles, 1567
    'COSZZZP',  // Corsican Gospel of Matthew, from Prince Bonaparte's 1860s dialect series
    'BREZZZP',  // Vannes Breton Matthew, from the same 1850s–60s series
    'ELLZZZP',  // Smyrna Greek Frangochiotika Luke and Acts, 19th century
    'ATYPSA',  // Aneityum Psalms, 19th-century Vanuatu mission translation
    'ERGZZZP',  // Erromanga Genesis and Ruth, 19th-century Vanuatu mission translation
    'TUKZZZP',  // Turkmen Arabic-script Matthew, 1880
    'ITAZZZP',  // Italian Riveduta (Luzzi), 1927
    'HEBZZZP',  // Westminster Leningrad Codex — ancient Hebrew text
    'HBOMASP',  // Masoretic text parallel to the Samaritan Pentateuch — ancient Hebrew text
])

function too_old_for_copyright(translation:Translation):boolean{
    if (KEEP_DESPITE_AGE.has(translation.id)) return false
    if (KNOWN_OLD.has(translation.id)) return true
    if (!translation.latest_year) return false  // unknown year — don't assume
    return new Date().getFullYear() - translation.latest_year > PUBLIC_DOMAIN_AGE_YEARS
}

// The private steps from .private/, or null (with a warning) where that's not present
async function load_dbl():Promise<DblSteps|null>{
    if (!existsSync(DBL_MODULE)){
        console.warn('DBL: .private/dbl/dbl.ts not found — skipping every DBL step, so no DBL '
            + 'entries will be listed')
        return null
    }
    return (await import(DBL_MODULE.href) as {default:DblSteps}).default
}


// ---- 2. find.bible (digitalbiblesociety/data) ----

interface FindBibleEntry {
    id:string
    tt:string  // title (name)
    iso:string  // ISO 639-3 language code
    dt:string  // date/year, e.g. "1964"
}

interface FindBibleLink {
    bible_abbr:string  // matches FindBibleEntry.id
    url:string
    provider:string|null
}

function add_to_index(index:Map<string, Set<string>>, key:string, id:string):void{
    // Record that `key` links to find.bible translation `id`
    const ids = index.get(key) ?? new Set()
    ids.add(id)
    index.set(key, ids)
}

function lookup_index(index:Map<string, Set<string>>, key:string):string|undefined{
    // Resolve `key` to a find.bible id, but only when exactly one translation links to it
    const ids = index.get(key)
    return ids?.size === 1 ? [...ids][0] : undefined
}

async function pull_find_bible():Promise<FindBible>{
    console.info('Fetching find.bible dataset (digitalbiblesociety/data)...')
    const [bibles, links] = await Promise.all([
        fetch_json<FindBibleEntry[]>(`${FIND_BIBLE_BASE}/bibles.json`),
        fetch_json<FindBibleLink[]>(`${FIND_BIBLE_BASE}/bible_links.json`),
    ])

    // Index DBL uids (from Digital Bible Library links) and eBible ids (from ebible.org links)
    const index:FindBibleIndex = {by_dbl: new Map(), by_ebible: new Map()}
    const dbl_uids = new Map<string, string[]>()
    const dbl_uid_by_abbr = new Map<string, string>()
    for (const link of links){
        const ebible_id = /ebible\.org\/(?:find|Scriptures)\/details\.php\?id=([\w-]+)/i
            .exec(link.url)?.[1]
        if (ebible_id)
            add_to_index(index.by_ebible, ebible_id.toLowerCase(), link.bible_abbr)
        if (!/digital bible library/i.test(link.provider ?? ''))
            continue
        const uid_match = /([0-9a-f]{16})/.exec(link.url)
        if (!uid_match)
            continue
        dbl_uid_by_abbr.set(link.bible_abbr, uid_match[1]!)
        add_to_index(index.by_dbl, uid_match[1]!, link.bible_abbr)
        dbl_uids.set(link.bible_abbr, [...dbl_uids.get(link.bible_abbr) ?? [], uid_match[1]!])
    }

    const versions:Translation[] = []
    for (const entry of bibles){
        // Skip junk entries — blank name, or ISO's "no linguistic content" placeholder
        const name = entry.tt.trim()
        if (!name || entry.iso === 'zxx') continue

        const year = parseInt(entry.dt) || 0
        const dbl_uid = dbl_uid_by_abbr.get(entry.id)

        versions.push({
            id: entry.id,
            medium: 'text',
            name,
            abbrev: entry.id,
            language: entry.iso,
            latest_year: year,
            external_ids: {
                find_bible: entry.id,
                ...(dbl_uid ? {dbl: dbl_uid} : {}),
            },
            info_url: `https://find.bible/bibles/${entry.id}/`,
        })
    }
    return {versions, index, dbl_uids}
}

function add_find_bible(translations:Translation[], find_bible:FindBible,
        superseded:Set<string>):void{
    // List every find.bible version that isn't already listed by the private steps
    const versions = find_bible.versions.filter(t => !superseded.has(t.id))
    translations.push(...versions)
    console.info(`find.bible: added ${versions.length} versions not in the DBL catalog `
        + `(${superseded.size} more are DBL entries, listed from DBL instead)`)
}


// ---- 4. fetch.bible (v1.fetch.bible/manifest.json) ----

async function load_fetch_bible():Promise<FetchBible>{
    // Pull the manifest plus each translation's collection ids, used by several steps below
    console.info('Fetching fetch.bible manifest...')
    const manifest =
        await fetch_json<{bibles:Record<string, FetchBibleEntry>}>(FETCH_BIBLE_MANIFEST)
    const collection_ids = await fetch_collection_ids(Object.keys(manifest.bibles))
    return {bibles: manifest.bibles, collection_ids}
}

async function fetch_collection_ids(fb_ids:string[]):Promise<Map<string, FetchCollectionIds>>{
    // Pull each translation's meta.json from gracious-tech/fetch_collection, a few at a time — the
    // manifest itself doesn't carry these ids. A failed fetch just leaves that translation to be
    // matched on its manifest data alone.
    console.info(`Fetching ${fb_ids.length} fetch_collection meta.json files...`)
    const ids = new Map<string, FetchCollectionIds>()
    const queue = [...fb_ids]
    let failed = 0
    const worker = async ():Promise<void> => {
        for (let fb_id = queue.shift(); fb_id; fb_id = queue.shift()){
            try {
                const meta = await fetch_json<{ids?:FetchCollectionIds}>(
                    `${FETCH_COLLECTION_BASE}/${fb_id}/meta.json`)
                ids.set(fb_id, meta.ids ?? {})
            } catch {
                failed += 1
            }
        }
    }
    await Promise.all(Array.from({length: 20}, worker))
    if (failed)
        console.warn(`fetch_collection: ${failed} meta.json files failed to load`)
    return ids
}

// Pairs each fetch.bible translation with the find.bible translation it duplicates, if any. Each
// shared DBL uid or eBible id is one piece of evidence; the uid find.bible itself stores as
// external_ids.dbl counts double. Candidates must share a language (which weeds out find.bible's
// occasional mislinked DBL entry), and pairs are claimed strongest first so neither side is ever
// matched twice — a second fetch.bible edition of the same text stays its own translation.
function match_fetch_to_find(
        manifest:Record<string, FetchBibleEntry>, collection_ids:Map<string, FetchCollectionIds>,
        translations:Translation[], index:FindBibleIndex):Map<string, string>{
    const by_id = new Map(translations.map(t => [t.id, t]))
    const candidates:{fb_id:string, translation_id:string, score:number}[] = []

    for (const [fb_id, entry] of Object.entries(manifest)){
        // Gather this translation's ids from both the manifest and its collection meta.json
        const attribution_url = entry.copyright.attribution_url
        const meta_ids = collection_ids.get(fb_id) ?? {}
        const dbl_uids = new Set([/([0-9a-f]{16})/.exec(attribution_url)?.[1], meta_ids.dbl])
        const ebible_ids = new Set([
            /ebible\.org\/Scriptures\/details\.php\?id=([\w-]+)/.exec(attribution_url)?.[1],
            meta_ids.ebible,
        ].map(id => id?.toLowerCase()))

        // Tally the evidence for each find.bible translation those ids point to
        const scores = new Map<string, number>()
        for (const uid of dbl_uids){
            const id = uid && lookup_index(index.by_dbl, uid)
            if (!id)
                continue
            const weight = by_id.get(id)?.external_ids.dbl === uid ? 2 : 1
            scores.set(id, (scores.get(id) ?? 0) + weight)
        }
        for (const ebible_id of ebible_ids){
            const id = ebible_id && lookup_index(index.by_ebible, ebible_id)
            if (id)
                scores.set(id, (scores.get(id) ?? 0) + 1)
        }

        // Keep only candidates that exist and share fetch.bible's language code
        const language = fetch_language(fb_id)
        for (const [translation_id, score] of scores){
            if (by_id.get(translation_id)?.language === language)
                candidates.push({fb_id, translation_id, score})
        }
    }

    // Claim pairs strongest first, never reusing either side
    const matches = new Map<string, string>()
    const claimed = new Set<string>()
    candidates.sort((a, b) => b.score - a.score)
    for (const {fb_id, translation_id} of candidates){
        if (matches.has(fb_id) || claimed.has(translation_id))
            continue
        matches.set(fb_id, translation_id)
        claimed.add(translation_id)
    }
    return matches
}

// Only adds terms to versions with none yet, after the private steps have given theirs.
// fetch.bible translations that don't match one of those are ignored.
function pull_fetch_bible(translations:Translation[], owners:Owner[],
        license_terms:LicenseTerms[], index:FindBibleIndex, fetch_bible:FetchBible):void{
    const {bibles, collection_ids} = fetch_bible
    const matches = match_fetch_to_find(bibles, collection_ids, translations, index)
    const has_terms = new Set(license_terms.map(lt => lt.translation_id))

    let enriched = 0
    for (const [fb_id, entry] of Object.entries(bibles)){
        const license = entry.copyright.licenses[0]
        const translation_id = matches.get(fb_id)
        if (!license || !translation_id || has_terms.has(translation_id))
            continue

        license_terms.push({
            translation_id,
            owner_id: owner_id_for(owners, entry.copyright.attribution),
            roles: ['text'],
            license: typeof license.license === 'string' ? license.license : 'custom',
            url: license.url,
            last_verified: today(),
        })
        enriched += 1
    }
    console.info(`fetch.bible: added license terms to ${enriched} find.bible versions not in DBL`)
}


// ---- 5. major_translation_owners.ts (hand-curated, for well-known translations no other source
// gives ownership for — see that file for how each entry was sourced) ----

function apply_major_translation_owners(
        translations:Translation[], owners:Owner[], license_terms:LicenseTerms[]):void{
    const overrides = major_translation_owners
    const by_id = new Set(translations.map(t => t.id))

    let matched = 0
    for (const [translation_id, owner_name] of Object.entries(overrides)){
        if (!by_id.has(translation_id)) continue
        if (license_terms.some(lt => lt.translation_id === translation_id))
            continue
        license_terms.push({
            translation_id,
            owner_id: owner_id_for(owners, owner_name),
            roles: ['text'],
            license: 'unknown',
            url: '',
            last_verified: today(),
        })
        matched += 1
    }
    console.info(`major_translation_owners: matched ${matched} translations`)
}


// ---- 8. eBible — only for find.bible versions not linked to any DBL entry ----

const EBIBLE_CSV = 'https://ebible.org/Scriptures/translations.csv'
const ebible_page_url = (id:string):string => `https://ebible.org/Scriptures/details.php?id=${id}`

// The text of each eBible translation's details page (where its license is stated), keyed by
// eBible translationId, as kept in ebible_cache.json
const ebible_cache = ebible_cache_json as Record<string, string>

function parse_csv(text:string):Record<string, string>[]{
    // Parse a CSV file with a header row into one object per row (quoted fields may hold commas,
    // newlines, and doubled quotes)
    const rows:string[][] = []
    let row:string[] = []
    let field = ''
    let quoted = false
    for (let i = 0; i < text.length; i++){
        const char = text[i]!
        if (quoted){
            if (char === '"' && text[i + 1] === '"'){
                field += '"'
                i += 1
            } else if (char === '"'){
                quoted = false
            } else {
                field += char
            }
        } else if (char === '"'){
            quoted = true
        } else if (char === ','){
            row.push(field)
            field = ''
        } else if (char === '\n'){
            rows.push([...row, field])
            row = []
            field = ''
        } else if (char !== '\r'){
            field += char
        }
    }
    if (field || row.length)
        rows.push([...row, field])
    const [header = [], ...body] = rows
    return body.map(cells => Object.fromEntries(header.map((name, i) => [name, cells[i] ?? ''])))
}

async function fetch_ebible_page(id:string):Promise<string>{
    // A details page reduced to its text (links kept inline, as licenses are often only linked)
    const res = await fetch(ebible_page_url(id))
    if (!res.ok)
        throw new Error(`Failed to fetch ${ebible_page_url(id)}: ${res.status}`)
    const html = await res.text()
    return html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
        .replace(/<a\s[^>]*href="([^"]*)"[^>]*>/gi, ' $1 ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/\s+/g, ' ')
        .trim()
}

// A find.bible version still without terms, not linked to any DBL entry, takes its owner from
// eBible's copyright notice and its license from eBible's details page, if eBible has it (in the
// same language)
async function pull_ebible(translations:Translation[], owners:Owner[],
        license_terms:LicenseTerms[], find_bible:FindBible):Promise<void>{
    // eBible's translations, by both the translationId and the FCBHID find.bible links use
    console.info('Fetching eBible translations list...')
    const res = await fetch(EBIBLE_CSV)
    if (!res.ok)
        throw new Error(`Failed to fetch ${EBIBLE_CSV}: ${res.status}`)
    const rows = parse_csv((await res.text()).replace(/^﻿/, ''))
    const fcbh_counts = new Map<string, number>()
    for (const row of rows){
        const fcbh = row['FCBHID']!.toLowerCase()
        fcbh_counts.set(fcbh, (fcbh_counts.get(fcbh) ?? 0) + 1)
    }
    const by_ebible_id = new Map<string, Record<string, string>>()
    for (const row of rows){
        by_ebible_id.set(row['translationId']!.toLowerCase(), row)
        const fcbh = row['FCBHID']!.toLowerCase()
        if (fcbh_counts.get(fcbh) === 1)
            by_ebible_id.set(fcbh, row)
    }

    // The eBible ids each find.bible version links to (only where no other version does)
    const ebible_ids = new Map<string, string[]>()
    for (const ebible_id of find_bible.index.by_ebible.keys()){
        const fb_id = lookup_index(find_bible.index.by_ebible, ebible_id)
        if (fb_id)
            ebible_ids.set(fb_id, [...ebible_ids.get(fb_id) ?? [], ebible_id])
    }

    // Pair each eligible version with its eBible translation
    const has_terms = new Set(license_terms.map(lt => lt.translation_id))
    const pairs:{translation_id:string, row:Record<string, string>}[] = []
    for (const translation of translations){
        const fb_id = translation.external_ids.find_bible
        if (!fb_id || has_terms.has(translation.id) || translation.external_ids.dbl
                || find_bible.dbl_uids.get(fb_id)?.length)
            continue
        const row = (ebible_ids.get(fb_id) ?? []).map(id => by_ebible_id.get(id))
            .find(r => r?.['languageCode'] === translation.language)
        if (row)
            pairs.push({translation_id: translation.id, row})
    }

    // Fetch the details pages not yet cached
    const missing = [...new Set(pairs.map(p => p.row['translationId']!))]
        .filter(id => !(id in ebible_cache))
    if (missing.length){
        console.info(`Fetching ${missing.length} eBible details pages...`)
        await fetch_into(ebible_cache, missing, fetch_ebible_page)
        save_json('ebible_cache.json', sort_keys(ebible_cache), SCRIPTS_DIR)
    }

    // A notice can name co-holders ("X and Y"), split apart where they're known orgs
    const orgs = build_org_index(owners, [])
    let matched = 0
    for (const {translation_id, row} of pairs){
        const ebible_id = row['translationId']!
        const page = ebible_cache[ebible_id]
        if (page === undefined)
            continue
        // Some pages link a license with a malformed URL
        const detected = license_from_text(page.replaceAll('/by4.0/', '/by/4.0/'))
        const holders = split_holders(strip_copyright_notice(row['Copyright'] ?? ''), [], orgs)
        const owner_ids = [...new Set(holders.map(name => owner_id_for(owners, name)))]
            .filter(owner_id => owner_id !== 'unknown')
        if (!owner_ids.length && !detected)
            continue
        for (const owner_id of owner_ids.length ? owner_ids : ['unknown']){
            license_terms.push({
                translation_id,
                owner_id,
                roles: ['text'],
                license: detected?.license ?? 'unknown',
                url: detected?.url || ebible_page_url(ebible_id),
                last_verified: today(),
            })
        }
        matched += 1
    }
    console.info(`eBible: added license terms to ${matched} find.bible versions not in DBL`)
}


// ---- superseded closed editions ----

// Licenses that make a version an open edition — open access counts even before its license is
// found
const OPEN_EDITION_LICENSES = new Set(['public', 'cc-by', 'cc-by-sa', 'unknown_open'])

// Licenses that leave a version closed (no terms at all counts too)
const CLOSED_LICENSES = new Set(['unknown', 'custom'])

function edition_key(name:string):string{
    // A version's name reduced to what an open re-release keeps of the original's — without
    // trademark marks, "Biblica"/"Open", years, and wording like "Version"/"Bible" that the two
    // often swap (e.g. "Thai New Contemporary Bible" and "Biblica® Open Thai New Contemporary
    // Version 2007" both become "thai new contemporary")
    return name.toLowerCase()
        .replace(/[®™©]/g, '')
        .replace(/\b(?:biblica|open|version|bible|translation|the|holy|edition|\d{4})\b/g, ' ')
        .replace(/[^\p{L}\p{N}\s]/gu, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

// Some owners re-publish a closed translation as an open edition (Biblica's "Biblica® Open ..."
// series especially), leaving the old closed listing alongside it. Drop the closed one when an
// open edition of it exists in the same language and medium — only where the open one's name says
// "Open", or the two share an owner, so a same-named but unrelated version is never dropped. The
// open edition's parenthesised qualifier ("(Simplified)") is ignored, but the closed one's isn't,
// so e.g. "Open English Bible (British Spelling)" isn't taken for "Open English Bible".
function drop_superseded_closed(translations:Translation[], license_terms:LicenseTerms[]):void{
    // Each version's licenses and known owners
    const licenses = new Map<string, Set<string>>()
    const owner_ids = new Map<string, Set<string>>()
    for (const terms of license_terms){
        licenses.set(terms.translation_id,
            (licenses.get(terms.translation_id) ?? new Set()).add(terms.license))
        if (terms.owner_id !== 'unknown')
            owner_ids.set(terms.translation_id,
                (owner_ids.get(terms.translation_id) ?? new Set()).add(terms.owner_id))
    }
    const all_in = (id:string, allowed:Set<string>):boolean =>
        [...licenses.get(id) ?? []].every(license => allowed.has(license))

    // Index the open editions by medium, language, and name key
    const open_editions = new Map<string, Translation[]>()
    for (const translation of translations){
        const key = edition_key(translation.name.replace(/\([^)]*\)/g, ''))
        if (!key || !licenses.has(translation.id)
                || !all_in(translation.id, OPEN_EDITION_LICENSES))
            continue
        const full_key = `${translation.medium}|${translation.language}|${key}`
        open_editions.set(full_key, [...open_editions.get(full_key) ?? [], translation])
    }

    // Find each closed version with an open edition that supersedes it
    const superseded = new Map<string, Translation>()
    for (const translation of translations){
        const key = edition_key(translation.name)
        if (!key || !all_in(translation.id, CLOSED_LICENSES))
            continue
        const owners = owner_ids.get(translation.id) ?? new Set()
        const open = open_editions.get(`${translation.medium}|${translation.language}|${key}`)
            ?.find(o => /\bopen\b/i.test(o.name)
                || [...owner_ids.get(o.id) ?? []].some(owner => owners.has(owner)))
        if (open)
            superseded.set(translation.id, open)
    }

    // Drop them along with their terms
    for (let i = translations.length - 1; i >= 0; i--){
        if (superseded.has(translations[i]!.id))
            translations.splice(i, 1)
    }
    for (let i = license_terms.length - 1; i >= 0; i--){
        if (superseded.has(license_terms[i]!.translation_id))
            license_terms.splice(i, 1)
    }
    console.info(`Dropped ${superseded.size} closed versions superseded by an open edition`)
}


// ---- main ----

async function main():Promise<void>{
    // Load the private steps and refresh their cache before anything else, as it may prompt
    const dbl = await load_dbl()
    await dbl?.refresh_catalog()

    // Built fresh each run — see the NOTE at the top of this file
    const state:BuildState = {
        translations: [],
        owners: [],
        license_terms: [],
        find_bible: await pull_find_bible(),
        fetch_bible: await load_fetch_bible(),
    }
    const {translations, owners, license_terms, find_bible, fetch_bible} = state

    // Versions: the private steps' first, then find.bible's not already listed. Licenses: the
    // private steps' first, then fetch.bible and major owners for whatever is still left.
    const superseded = dbl?.add_text(state) ?? new Set<string>()
    add_find_bible(translations, find_bible, superseded)
    dbl?.add_terms(state)
    pull_fetch_bible(translations, owners, license_terms, find_bible.index, fetch_bible)
    apply_major_translation_owners(translations, owners, license_terms)
    dbl?.add_audio(state)

    // Drop translations too old to have a live rights holder (see PUBLIC_DOMAIN_AGE_YEARS above)
    const excluded_ids = new Set(
        translations.filter(too_old_for_copyright).map(t => t.id))
    for (let i = translations.length - 1; i >= 0; i--){
        if (excluded_ids.has(translations[i]!.id)) translations.splice(i, 1)
    }
    for (let i = license_terms.length - 1; i >= 0; i--){
        if (excluded_ids.has(license_terms[i]!.translation_id)) license_terms.splice(i, 1)
    }
    console.info(`Excluded ${excluded_ids.size} translations too old for copyright `
        + `(published more than ${PUBLIC_DOMAIN_AGE_YEARS} years ago)`)

    // What the private steps can still resolve (after the age filter, so no lookups are wasted on
    // excluded translations), and only then eBible, for find.bible versions not linked to DBL
    await dbl?.resolve_remaining(state)
    await pull_ebible(translations, owners, license_terms, find_bible)

    // Only once every source has had its say on licenses, so open editions are all known
    drop_superseded_closed(translations, license_terms)

    // Drop owners left with no license terms (e.g. all their translations were too old)
    const used_owners = new Set(license_terms.map(lt => lt.owner_id))
    for (let i = owners.length - 1; i >= 0; i--){
        if (!used_owners.has(owners[i]!.id))
            owners.splice(i, 1)
    }

    translations.sort((a, b) => a.id.localeCompare(b.id))
    owners.sort((a, b) => a.id.localeCompare(b.id))
    license_terms.sort((a, b) => a.translation_id.localeCompare(b.translation_id))

    save_json('translations.json', translations)
    save_json('owners.json', owners)
    save_json('license_terms.json', license_terms)

    console.info(`Done: ${translations.length} translations, ${owners.length} owners, `
        + `${license_terms.length} license terms`)
}

main().catch(err => {
    console.error(err)
    process.exit(1)
})

