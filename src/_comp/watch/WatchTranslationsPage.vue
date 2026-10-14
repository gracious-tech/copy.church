
<template lang='pug'>

//- Owner mode without a recognised owner renders nothing while it redirects to the main Watch page
div.watch_translations_page(v-if='!owner_mode || owner_known')
    //- Owner mode gets its own heading and links in place of an owner filter
    template(v-if='owner_mode')
        VPButton(class='back_link' text="← All Bible Orgs" href='/watch/' theme='alt')
        h1 Versions licensed by {{ owner_name }}
        template(v-if='base_rows.length')
            WatchStats(:stats='owner_stat_tiles')
            WatchMeter(class='owner_meter' :counts='owner_tier_counts')
        div.owner_links(v-if='owner?.website || owner?.ministry_watch_url')
            VPButton(v-if='owner?.website' text="Website" :href='owner.website' theme='alt')
            VPButton(
                v-if='owner?.ministry_watch_url' text="View Financials" :href='owner.ministry_watch_url'
                theme='alt'
            )
        template(v-if='owner_cases.length')
            h2 Reports
            WatchCases(:entries='owner_cases')
        h2 Versions
        p(v-if='!base_rows.length') No tracked versions.
    //- The list itself, skipped for an owner with no tracked translations
    template(v-if='base_rows.length')
        div.filters
            select(v-if='!owner_mode' v-model='selected_owner')
                option(value='') All orgs
                option(v-for='o of owner_options' :key='o.id' :value='o.id') {{ o.name }} ({{ format_num(o.tracked) }})
            select(v-model='selected_language')
                option(value='') All languages
                option(v-for='l of language_options' :key='l' :value='l') {{ l }}
            input.search(v-model='query' type='text' placeholder="Search by name or abbreviation…")
            button.clear(v-if='has_filters' @click='clear_filters') Clear filters
        p.count {{ format_num(filtered.length) }} of {{ format_num(base_rows.length) }} versions
        table.watch_translations: tbody
            tr.header_row
                th.name Version
                th.language Language
                th.license License
                th.owner(v-if='!owner_mode') Licensed by
            tr(v-for='item of filtered' :key='item.id')
                td.name.condensed: a(:href='item.info_url' target='_blank' rel='noreferrer')
                    | {{ item.display_name }}
                td.language {{ item.language_name }}
                td.license: span.license_pill(:class='license_tier(item.license, item.id)') {{ format_license(item.license) }}
                td.owner.condensed(v-if='!owner_mode') {{ item.owner_names }}

</template>


<script lang='ts' setup>

import {ref, computed, onBeforeMount, watch} from 'vue'

// Static Bible Org Watch data — checked into the repo, no backend
import translations from '@/_data/watch/translations.json'
import owners_json from '@/_data/watch/owners.json'
import license_terms from '@/_data/watch/license_terms.json'
import languages_json from '@/_data/watch/languages.json'
import type {Owner} from '@/_data/watch/types'

import WatchStats from './WatchStats.vue'
import WatchCases from './WatchCases.vue'
import WatchMeter from './WatchMeter.vue'
import {license_tier, response_log_by_owner, format_num} from './watch_utils'
import type {LicenseTier} from './watch_utils'


// Owner mode shows a single owner's translations (owner id taken from the URL hash)
const props = defineProps<{owner_mode?:boolean}>()

// Typed so optional fields (website, ministry_watch_url) are known even when no entry has them yet
const owners:Owner[] = owners_json

// English name for each ISO 639-3 code — codes without one (mostly retired) show as the code
const language_names:Record<string, string> = languages_json


// A raw license value ('unknown', 'public', 'cc-by-nc-nd', ...) isn't fit for display as-is —
// show "Restricted" for the unknown case, "Open" for open access without a known license,
// and drop a Creative Commons code's redundant "cc" prefix while keeping its hyphens
// ("cc-by-nc-nd" -> "BY-NC-ND")
function format_license(license:string):string{
    if (license === 'unknown') return "Restricted"
    if (license === 'unknown_open') return 'Open'
    if (license === 'public') return 'Public domain'
    if (license === 'custom') return 'Custom'
    return license.split('-').filter(part => part !== 'cc').map(part => part.toUpperCase()).join('-')
}

// Many abbreviations redundantly lead with the language code, its language being shown in its own
// column ("AAHWBT" for aah) — drop that prefix, but only when something is left after it
function format_abbrev(abbrev:string, language:string):string{
    if (abbrev.length > 3 && abbrev.slice(0, 3).toLowerCase() === language.toLowerCase())
        return abbrev.slice(3)
    return abbrev
}

// Build an id -> name lookup so each row can show its owner's name
const owner_names:Record<string, string> = {}
for (const owner of owners){
    owner_names[owner.id] = owner.name
}

// Gather each translation's license and all its rights holders — a translation with several
// holders has one license_terms entry per holder, all with the same license
const terms_by_translation:Record<string, {license:string, owner_ids:string[]}> = {}
for (const term of license_terms){
    const terms = terms_by_translation[term.translation_id]
        ??= {license: term.license, owner_ids: []}
    if (term.owner_id !== 'unknown')
        terms.owner_ids.push(term.owner_id)
}

// Name shown for a translation — its abbreviation, then "[audio]" for an audio recording
function format_name(item:{name:string, abbrev:string, language:string, medium:string}):string{
    const abbrev = item.abbrev ? ` (${format_abbrev(item.abbrev, item.language)})` : ''
    return `${item.name}${abbrev}${item.medium === 'audio' ? " [audio]" : ''}`
}

// Attach display name, language name, license, owner ids, and owner names to each row, ordered by
// display name
const rows = translations.map(item => {
    const terms = terms_by_translation[item.id]
    const owner_ids = terms?.owner_ids ?? []
    return {
        ...item,
        display_name: format_name(item),
        language_name: language_names[item.language] ?? item.language,
        license: terms?.license ?? 'unknown',
        owner_ids,
        owner_names: owner_ids.map(id => owner_names[id] ?? "Unknown").join(", "),
    }
}).sort((a, b) => a.display_name.localeCompare(b.display_name))

// Owners worth offering as a filter — only those with at least one tracked translation here
const owner_tracked_counts:Record<string, number> = {}
for (const row of rows){
    for (const owner_id of row.owner_ids)
        owner_tracked_counts[owner_id] = (owner_tracked_counts[owner_id] ?? 0) + 1
}
const owner_options = Object.entries(owner_tracked_counts)
    .map(([id, tracked]) => ({id, name: owner_names[id] ?? id, tracked}))
    .sort((a, b) => a.name.localeCompare(b.name))

// Filter state — kept in the URL hash so links (e.g. from the owner dashboard) can deep-link here
const selected_owner = ref("")
const selected_language = ref("")
const query = ref("")

onBeforeMount(() => {
    const params = new URLSearchParams(self.location.hash.slice(1))
    if (params.has('o')) selected_owner.value = params.get('o')!
    if (params.has('l')) selected_language.value = params.get('l')!
    if (params.has('q')) query.value = params.get('q')!

    // An owner page without a recognised owner has nothing to show, so go to the main Watch page
    if (props.owner_mode && !owner_known.value){
        self.location.replace('/watch/')
        return
    }
    if (props.owner_mode)
        document.title = `Versions owned by ${owner_name.value} | ${document.title}`
})

// The owner being shown in owner mode, and its response log cases (if any)
const owner = computed(() => owners.find(o => o.id === selected_owner.value))
const owner_cases = computed(() => response_log_by_owner[selected_owner.value] ?? [])

// The owner's display name, falling back to the id from the URL
const owner_name = computed(() => owner.value?.name ?? selected_owner.value)

// Whether the owner id from the URL matches an org in owners.json or the data
const owner_known = computed(() => !!(owner.value || owner_tracked_counts[selected_owner.value]))

// Rows in scope before any filtering — just the owner's in owner mode, else every translation
const base_rows = computed(() =>
    props.owner_mode ? rows.filter(r => r.owner_ids.includes(selected_owner.value)) : rows)

// How the owner's translations split across license tiers, for the owner mode tiles and bar
const owner_tier_counts = computed(() => {
    const counts:Record<LicenseTier, number> = {open: 0, semi_restricted: 0, restricted: 0}
    for (const row of base_rows.value)
        counts[license_tier(row.license, row.id)] += 1
    return counts
})

// Owner mode headline tiles — each tier's count and share of the owner's translations
const owner_stat_tiles = computed(() => {
    const total = base_rows.value.length
    const tile = (tier:LicenseTier, label:string) => {
        const n = owner_tier_counts.value[tier]
        return {value: n, label: `${label} (${total ? Math.round((n / total) * 100) : 0}%)`, tier}
    }
    return [
        tile('open', "Open"),
        tile('semi_restricted', "Semi-restricted"),
        tile('restricted', "Restricted"),
    ]
})

// Languages offered as a filter, by name — a name shared by several codes (e.g. a macrolanguage and
// its main member, both "Arabic") is one option covering them all
const language_options = computed(() =>
    [...new Set(base_rows.value.map(r => r.language_name))].sort((a, b) => a.localeCompare(b)))

watch([selected_owner, selected_language, query], () => {
    const params = new URLSearchParams()
    if (selected_owner.value) params.set('o', selected_owner.value)
    if (selected_language.value) params.set('l', selected_language.value)
    if (query.value) params.set('q', query.value)
    self.location.hash = params.toString()
})

// The owner isn't a clearable filter in owner mode, since it defines the page
const has_filters = computed(() =>
    !!((!props.owner_mode && selected_owner.value) || selected_language.value || query.value))

// Reset every filter the user can change
function clear_filters(){
    if (!props.owner_mode)
        selected_owner.value = ""
    selected_language.value = ""
    query.value = ""
}

// Apply the owner/language/search filters
const filtered = computed(() => {
    const q = query.value.trim().toLowerCase()
    return base_rows.value.filter(item =>
        (!selected_owner.value || item.owner_ids.includes(selected_owner.value))
        && (!selected_language.value || item.language_name === selected_language.value)
        && (!q || item.display_name.toLowerCase().includes(q)
            || item.abbrev.toLowerCase().includes(q)))
})

</script>


<style lang='sass' scoped>

.watch_translations_page
    .back_link
        margin-bottom: 28px

    h1
        margin-bottom: 16px

    .owner_links
        display: flex
        flex-wrap: wrap
        gap: 8px
        margin: 12px 0

    .owner_meter
        height: 12px
        border-radius: 6px
        margin-top: -4px
        margin-bottom: 28px

    .filters
        display: flex
        flex-wrap: wrap
        gap: 8px
        margin-bottom: 8px

        select, .search
            padding: 8px 10px
            border: 1px solid var(--vp-c-divider)
            border-radius: 6px
            font-size: 0.9em
            background: var(--vp-c-bg)
            color: var(--vp-c-text-1)

        select
            max-width: 260px

        .search
            flex: 1
            min-width: 200px

        .clear
            padding: 8px 12px
            border: 1px solid var(--vp-c-divider)
            border-radius: 6px
            font-size: 0.85em
            background: var(--vp-c-bg)
            color: var(--vp-c-text-2)
            cursor: pointer

            &:hover
                border-color: var(--vp-c-brand-1)
                color: var(--vp-c-brand-1)

    .count
        font-size: 0.8em
        opacity: 0.7
        margin: 0 0 8px

.watch_translations
    width: 100%
    border-collapse: collapse
    font-size: 0.85em

    th
        text-align: left
        padding: 6px 10px
        border-bottom: 2px solid var(--vp-c-divider)

        // language/license get the classic shrink-to-content trick (width: 1% is not literal —
        // combined with nowrap cells it tells the table to give this column only what its
        // content needs, rather than a guessed percentage), leaving name/owner to share
        // whatever's left between them
        &.language, &.license
            width: 1%

    td
        padding: 6px 10px
        border-bottom: 1px solid var(--vp-c-divider)

    .condensed
        max-width: 260px
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap

    td.language, td.license .license_pill
        white-space: nowrap

// Below 640px a real <table> can't reflow without either an overflow scrollbar or losing
// columns, so each row becomes a flex row instead — still one line per translation, with the
// language and license taking only what they need and the name and owner sharing the rest,
// wrapping their own text rather than pushing each other down. The header (column names) is hidden rather than repeated per cell, relying on
// the pill's color and each field's own styling (muted language/owner) to stay legible without
// labels.
@media (max-width: 640px)
    .watch_translations
        .header_row
            display: none

        tr:not(.header_row)
            display: flex
            align-items: baseline
            gap: 8px
            padding: 8px 0
            border-top: none
            border-bottom: 1px solid var(--vp-c-divider)

        // Drop VitePress's per-cell borders so only the row's own divider shows
        td
            flex: 1 1 0
            min-width: 0
            padding: 0
            border: none

        .name
            order: 1
            font-weight: 600
            max-width: none
            overflow: visible
            white-space: normal
            text-overflow: clip
            overflow-wrap: break-word

        .language
            order: 2
            flex: 0 1 auto
            font-size: 0.85em
            color: var(--vp-c-text-2)
            overflow: hidden
            text-overflow: ellipsis
            white-space: nowrap

        // The pill only needs its own width, leaving the rest of the row to the name and owner
        .license
            order: 3
            flex: 0 0 auto

        .owner
            order: 4
            font-size: 0.85em
            color: var(--vp-c-text-2)
            max-width: none
            overflow: visible
            white-space: normal
            text-overflow: clip
            overflow-wrap: break-word

.license_pill
    display: inline-block
    padding: 1px 7px
    border-radius: 5px
    font-size: 0.9em

    &.open
        color: var(--vp-c-green-1)
        background: var(--vp-c-green-soft)

    &.semi_restricted
        color: var(--vp-c-yellow-1)
        background: var(--vp-c-yellow-soft)

    &.restricted
        color: var(--vp-c-red-1)
        background: var(--vp-c-red-soft)

</style>
