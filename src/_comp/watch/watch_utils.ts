
// Shared Bible Org Watch logic for the owner dashboard and translations pages

import response_log from '../../_data/watch/response_log.json'
import type {ResponseLogEntry} from '../../_data/watch/types'


export type LicenseTier = 'open' | 'semi_restricted' | 'restricted'


// Display a count with a comma thousand separator (e.g. 1,234)
export function format_num(n:number):string{
    return n.toLocaleString('en-US')
}


// A handful of 'custom' licenses have been read manually (see each entry's `url` in
// license_terms.json) and turn out to carry no cap on how much can be quoted, only a
// noncommercial and/or no-modification clause (like cc-by-nc/-nd) — those are downgraded from the
// 'custom' default of restricted to semi_restricted. nld_nbg uses the GNU FDL, which — unlike the
// others — permits commercial use and modification, so it's upgraded all the way to open.
const custom_tier_overrides:Record<string, 'open' | 'semi_restricted'> = {
    amh_amh: 'semi_restricted',  // UBS Amharic — nc only, no quotation cap
    cop_shc: 'semi_restricted',  // Sahidica Coptic NT — free for non-commercial electronic use only
    eng_net: 'semi_restricted',  // NET Bible — free non-commercial quoting, no verse cap
    spa_rvg: 'semi_restricted',  // RVG — nc + no wording changes, no quotation cap
    ukr_bju: 'semi_restricted',  // BJU Ukrainian — nc + no modification, no quotation cap
    nld_nbg: 'open',  // GNU FDL — permits commercial use and modification
}


// A license's tier: 'open' places no restriction on sharing ('public', 'cc-by', 'cc-by-sa');
// 'semi_restricted' carries a noncommercial and/or no-derivatives clause (including 'cc-by-nc-nd'),
// or is listed as open access without a license we've found yet ('unknown_open');
// 'restricted' is non-standard terms ('custom') or no license at all ('unknown') — not proven
// open, so not assumed open, unless overridden above. For ranking/filtering purposes, only
// 'restricted' counts against an owner — 'semi_restricted' does not count as restricted, even
// though the bar still shows it separately.
export function license_tier(license:string, translation_id?:string):LicenseTier{
    if (license === 'unknown_open')
        return 'semi_restricted'
    if (license === 'custom' && translation_id && translation_id in custom_tier_overrides)
        return custom_tier_overrides[translation_id]!
    if (license === 'custom' || license === 'unknown')
        return 'restricted'
    if (license.includes('nc') || license.includes('nd'))
        return 'semi_restricted'
    return 'open'
}


// Turn an owner's display name into the id form used by owners.json
function slugify(name:string):string{
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
}


// Response log entries grouped by owner_id when matched, else by a slugified owner_name — most of
// these owners (Crossway, Zondervan, Lockman, ...) have no tracked/open-licensed translations, so
// they're not otherwise in owners.json at all. Most recent first (undated sort last).
export const response_log_by_owner:Record<string, ResponseLogEntry[]> = {}

// "Pre-1996" sorts as bare "1996", which falls after any full 1996 date and before 1995
const date_sort_key = (date:string) => date.replace(/^Pre-/, '')
const sorted_log = [...response_log as ResponseLogEntry[]]
    .sort((a, b) => date_sort_key(b.date).localeCompare(date_sort_key(a.date)))
for (const entry of sorted_log){
    const key = entry.owner_id ?? slugify(entry.owner_name)
    ;(response_log_by_owner[key] ??= []).push(entry)
}
