
// Links owners to their entry in the Ministry Watch database (db.ministrywatch.com), which rates
// US ministries on financial transparency. Its compare page lists every ministry it covers, by
// name and EIN, on one page — fetched fresh each time, so a ministry it drops loses its link.
// An owner is linked where its name matches a ministry's name (or a name the ministry is also
// known by, e.g. "Crossway/ Good News Publishers"), or where OTHER_NAMES links it by hand.
//
// Used by update_watch_data.ts as part of a full rebuild, but can also be run on its own to only
// refresh the links in the current owners.json:
//   node --experimental-strip-types scripts/ministry_watch.ts [--dry-run]

import {readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'

import type {Owner} from '../src/_data/watch/types.ts'
import {DATA_DIR, save_json, slugify} from './watch_common.ts'


const COMPARE_URL = 'https://db.ministrywatch.com/compare.php'
const ministry_url = (ein:string):string => `https://db.ministrywatch.com/ministry.php?ein=${ein}`

// Owners whose name differs from their Ministry Watch entry's (other names for the same org, its
// former names, typos, or notices a parse couldn't reduce to just the org's name) — kept to the
// same legal entity, so e.g. national Wycliffe or SIL orgs and joint holders are left out.
// Ministry Watch EIN -> owner ids
const OTHER_NAMES:Record<string, string[]> = {
    // Africa Inland Mission International
    '111873101': ['africa_inland_mission'],
    // Bible League International (World Bible Translation Center merged into it)
    '362037761': ['world_bible_translation_center'],
    // Biblica
    '841194554': ['በbiblica'],
    // Cru (the Jesus Film Project is one of its ministries)
    '956006173': ['jesus_film_project'],
    // Davar Audio Bibles (formerly Davar Partners International)
    '270642468': [
        'davar_partners',
        'davar_partners_international',
        'davar_partners_international_for_following_ot_books_gen_deu_rut',
        'mongolian_ab_audio_bible_davar_partners_international',
    ],
    // Ethnos360 (formerly New Tribes Mission)
    '396024926': ['ethnos_360', 'new_tribes_mission', 'new_tribes_missionsanford_fl_1_usa'],
    // Faith Comes By Hearing / Hosanna Ministries
    '850223225': [
        '202_hosanna',
        'hosanna_201',
        'hosanna_hosanna',
        'hosanna_i_produsem_rikoding_ya_long',
        'hosanna_le_texte_biblique_est_tir_eacute',
        'hosanna_nt',
        'hosanna_nt_audio',
        'hosanna_rekoding_blong_bislama_revised_version',
        'produccion_de_hosanna_en_nahuatl_de_la_huasteca',
    ],
    // Operation Mobilization
    '222513811': ['operation_mobilization_international'],
    // SIL Global (formerly SIL International)
    '751840827': ['sil_international', 'sil_international_publisher', 'sil_usa'],
    // SIM USA
    '221512241': ['sim_international'],
    // The Navigators (NavPress is its publishing ministry)
    '846007896': ['navpress'],
    // UnfoldingWord (the Door43 World Missions Community is the community around its platform)
    '141888977': ['door43_world_missions_community'],
    // United Bible Societies
    '980428633': [
        'sociedades_biblicas_unidas',
        'united_bible_societies_china_partnership',
        'united_bible_society',
    ],
    // Word for the World USA
    '841426685': ['word_for_the_world_international'],
    // Wycliffe Bible Translators
    '951831097': ['wycliffe_bible_tarnslators', 'wycliffe_usa'],
}


// Every ministry on Ministry Watch's compare page, as [EIN, name] (entities decoded)
async function fetch_ministries():Promise<[string, string][]>{
    console.info('Fetching Ministry Watch ministries...')
    const res = await fetch(COMPARE_URL)
    if (!res.ok)
        throw new Error(`Failed to fetch ${COMPARE_URL}: ${res.status}`)
    const html = await res.text()
    const row_re = /<tr><td><a href="ministry\.php\?ein=(\d+)">([^<]+)<\/a>/g
    return [...html.matchAll(row_re)].map(([, ein, name]) => [ein!, name!
        .replace(/&reg;/g, '®').replace(/&#0?39;/g, '\'').replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&').trim()])
}

// The names a ministry is listed under — e.g. "Faith Comes By Hearing / Hosanna Ministries",
// "TWR (aka Trans World Radio)" and "Everknown, formerly Orphan Outreach" each give both names
function names_of(listed:string):string[]{
    const parts = listed.split(/\s*(?:[\/()]|,?\s+formerly\s+)\s*/i)
        .map(part => part.replace(/^(?:aka|formerly)\s+/i, '').trim())
    return [listed, ...parts].filter(part => part.length > 2)
}

// Set each owner's Ministry Watch link (removing any it no longer has)
export async function add_ministry_watch_urls(owners:Owner[]):Promise<void>{
    const ministries = await fetch_ministries()
    const listed_eins = new Set(ministries.map(([ein]) => ein))

    // Each name slug's EINs — a name shared by several ministries is too ambiguous to link
    const eins_by_slug = new Map<string, Set<string>>()
    for (const [ein, name] of ministries){
        for (const slug of names_of(name).map(slugify))
            eins_by_slug.set(slug, (eins_by_slug.get(slug) ?? new Set()).add(ein))
    }

    // Hand-linked owners, as long as their ministry is still listed
    const ein_by_owner = new Map<string, string>()
    const owner_ids = new Set(owners.map(o => o.id))
    for (const [ein, ids] of Object.entries(OTHER_NAMES)){
        if (!listed_eins.has(ein)){
            console.warn(`ministry_watch.ts: EIN ${ein} is no longer listed on Ministry Watch`)
            continue
        }
        for (const id of ids){
            if (!owner_ids.has(id))
                console.warn(`ministry_watch.ts: owner ${id} (EIN ${ein}) isn't listed`)
            ein_by_owner.set(id, ein)
        }
    }

    // Link each owner by hand, else by name
    let linked = 0
    for (const owner of owners){
        const matches = eins_by_slug.get(owner.id) ?? eins_by_slug.get(slugify(owner.name))
        const ein = ein_by_owner.get(owner.id) ?? (matches?.size === 1 ? [...matches][0] : undefined)
        if (!ein){
            delete owner.ministry_watch_url
            continue
        }
        owner.ministry_watch_url = ministry_url(ein)
        linked++
    }
    console.info(`Ministry Watch: linked ${linked} owners (of ${ministries.length} ministries)`)
}


// Run on its own: only refresh the links in the current owners.json
if (process.argv[1] === fileURLToPath(import.meta.url)){
    const owners = JSON.parse(
        readFileSync(new URL('owners.json', DATA_DIR), 'utf8')) as Owner[]
    await add_ministry_watch_urls(owners)
    save_json('owners.json', owners)
}

