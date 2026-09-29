
<template lang='pug'>

div.watch_dashboard_wrap
    WatchStats(:stats='stat_tiles')

    div.controls
        input.search(v-model='query' type='text' placeholder="Search by org name…")
        label.cases_only
            input(v-model='cases_only' type='checkbox')
            | Orgs with cases only
        div.sort_toggle
            span.sort_label Sort by
            button(:class='{active: sort_mode === "total"}' @click='sort_mode = "total"')
                | Total owned
            button(:class='{active: sort_mode === "count"}' @click='sort_mode = "count"')
                | Restricted (#)
            button(:class='{active: sort_mode === "pct"}' @click='sort_mode = "pct"')
                | Restricted (%)

    div.owner_table
        template(v-for='(owner, i) of ranked' :key='owner.id')
            div.owner_row.clickable(
                @click='handle_row_click(owner, $event)' :title='`See ${owner.name}\'s versions`'
            )
                div.cell.rank {{ format_num(i + 1) }}
                div.cell.name
                    span.owner_name {{ owner.name }}
                    a.website(
                        v-if='owner.website' :href='owner.website' target='_blank' rel='noreferrer'
                        title='Visit website'
                    ) ↗
                    a.ministry_watch(
                        v-if='owner.ministry_watch_url' :href='owner.ministry_watch_url'
                        target='_blank' rel='noreferrer' title='View on Ministry Watch'
                    ) MW
                div.cell.total.num {{ format_num(owner.tracked) }}
                div.cell.bar
                    div.meter
                        div.meter_segment(
                            v-for='tier of meter_tiers' :key='tier' :class='tier'
                            :style='{flex: owner[tier]}'
                        )
                div.pcts
                    div.cell.num(
                        v-for='tier of pct_tiers' :key='tier.key' :class='tier.area'
                        :title='tier_count_text(owner, tier.key)'
                    )
                        span.cell_label {{ tier.label }}
                        span.pct_value(:class='tier.key') {{ tier_pct_text(owner, tier.key) }}
                div.cell.responses
                    button.responses_btn(
                        v-if='response_log_by_owner[owner.id]' @click='toggle_responses(owner.id)'
                        :class='{active: expanded.has(owner.id)}'
                    )
                        | Cases ({{ format_num(response_log_by_owner[owner.id].length) }})
            div.responses_panel(v-if='expanded.has(owner.id)')
                WatchCases(:entries='response_log_by_owner[owner.id] ?? []')

</template>


<script lang='ts' setup>

import {ref, computed} from 'vue'

// Static Bible Org Watch data — checked into the repo, no backend
import owners from '@/_data/watch/owners.json'
import translations from '@/_data/watch/translations.json'
import license_terms from '@/_data/watch/license_terms.json'

import WatchStats from './WatchStats.vue'
import WatchCases from './WatchCases.vue'
import {license_tier, response_log_by_owner, format_num} from './watch_utils'


// Tally each owner's tracked translations and how many carry a restricted license
const owner_names:Record<string, string> = {}
const owner_meta:Record<string, {website?:string, ministry_watch_url?:string}> = {}
for (const owner of owners){
    owner_names[owner.id] = owner.name
    owner_meta[owner.id] = {website: owner.website, ministry_watch_url: owner.ministry_watch_url}
}

// A translation with several rights holders (e.g. an audio recording's text and recording owners)
// has one license_terms entry per holder, so it counts toward each of them
const tallies:Record<string, {tracked:number, semi_restricted:number, restricted_only:number}> = {}
for (const term of license_terms){
    const tally = tallies[term.owner_id] ??= {tracked: 0, semi_restricted: 0, restricted_only: 0}
    tally.tracked += 1
    const tier = license_tier(term.license, term.translation_id)
    if (tier === 'semi_restricted') tally.semi_restricted += 1
    else if (tier === 'restricted') tally.restricted_only += 1
}

const owner_rows = Object.entries(tallies)
    .filter(([id]) => id !== 'unknown')
    .map(([id, tally]) => {
        // 'restricted' (used for ranking/sorting) is the strict tier only — semi_restricted is
        // shown as its own column but doesn't count as restricted.
        return {
            id,
            name: owner_names[id] ?? id,
            website: owner_meta[id]?.website,
            ministry_watch_url: owner_meta[id]?.ministry_watch_url,
            tracked: tally.tracked,
            open: tally.tracked - tally.semi_restricted - tally.restricted_only,
            restricted: tally.restricted_only,
            semi_restricted: tally.semi_restricted,
            restricted_pct: Math.round((tally.restricted_only / tally.tracked) * 100),
            semi_restricted_pct: Math.round((tally.semi_restricted / tally.tracked) * 100),
            open_pct: Math.round(((tally.tracked - tally.semi_restricted - tally.restricted_only) / tally.tracked) * 100),
        }
    })

// Overall stats shown as headline tiles. known_translations is every translation in the whole
// dataset, text and audio alike (translations.json — already excludes anything too old to still
// be under copyright, see too_old_for_copyright() in update_watch_data.ts). The other two are
// percentages of that
// same total, not just the subset with a resolved license — a translation with no license_terms
// entry at all has an unknown license, and unknown is assumed restricted rather than open.
// Every holder's entry for a translation shares the same license, so any one of them will do
const license_by_translation:Record<string, string> = {}
for (const term of license_terms){
    license_by_translation[term.translation_id] = term.license
}

const stat_tiles = computed(() => {
    let restricted = 0
    let semi_restricted_or_worse = 0
    for (const translation of translations){
        const license = license_by_translation[translation.id]
        const tier = license ? license_tier(license, translation.id) : 'restricted'
        if (tier === 'restricted') restricted += 1
        if (tier !== 'open') semi_restricted_or_worse += 1
    }
    const total = translations.length
    const pct = (n:number) => total ? Math.round((n / total) * 100) : 0
    return [
        {value: total, label: "Modern Bible versions"},
        {value: `${pct(restricted)}%`, label: "Restricted", tier: 'restricted' as const},
        {value: `${pct(semi_restricted_or_worse)}%`, label: "Semi-restricted / Restricted",
            tier: 'semi_restricted' as const},
    ]
})

// Most response log owners (Crossway, Zondervan, Lockman, ...) have no tracked/open-licensed
// translations, so they're not otherwise in owner_rows at all. Add a zero-tracked row for those so
// their Cases button still has somewhere to appear. display_rows is what the table ranks/shows —
// owner_rows itself stays untouched so the stat tiles above keep counting only owners with tracked
// translations.
const display_rows = [...owner_rows]
for (const [key, entries] of Object.entries(response_log_by_owner)){
    if (!display_rows.some(o => o.id === key)){
        display_rows.push({
            id: key,
            name: owner_names[key] ?? entries[0]!.owner_name,
            website: owner_meta[key]?.website,
            ministry_watch_url: owner_meta[key]?.ministry_watch_url,
            tracked: 0,
            open: 0,
            restricted: 0,
            semi_restricted: 0,
            restricted_pct: 0,
            semi_restricted_pct: 0,
            open_pct: 0,
        })
    }
}

// The per-tier percentage cells shown to the right of each owner's bar
type TierKey = 'open' | 'restricted' | 'semi_restricted'
const pct_tiers:{key:TierKey, label:string, area:string}[] = [
    {key: 'open', label: "Open", area: 'open_pct'},
    {key: 'semi_restricted', label: "Semi-restricted", area: 'semi_pct'},
    {key: 'restricted', label: "Restricted", area: 'restricted_pct'},
]

// Bar segments, grown in proportion to their raw counts so they always fill the bar exactly
// (rounded percentages can add up to 99 or 101)
const meter_tiers:TierKey[] = ['open', 'semi_restricted', 'restricted']

// A tier's share of an owner's versions, or a dash when they have none tracked
function tier_pct_text(owner:typeof display_rows[0], key:TierKey){
    return owner.tracked ? `${owner[`${key}_pct`]}%` : "–"
}

// Raw count behind a tier's percentage, shown on hover
function tier_count_text(owner:typeof display_rows[0], key:TierKey){
    return owner.tracked ? `${format_num(owner[key])} of ${format_num(owner.tracked)}` : undefined
}

// Ranking control — by total tracked, by raw restricted count, or by restricted share
const sort_mode = ref<'total' | 'count' | 'pct'>('total')

const sorters = {
    total: (a:typeof display_rows[0], b:typeof display_rows[0]) =>
        (b.tracked - a.tracked) || (b.restricted - a.restricted),
    count: (a:typeof display_rows[0], b:typeof display_rows[0]) =>
        (b.restricted - a.restricted) || (b.restricted_pct - a.restricted_pct),
    pct: (a:typeof display_rows[0], b:typeof display_rows[0]) =>
        (b.restricted_pct - a.restricted_pct) || (b.restricted - a.restricted),
}

// Search box and cases checkbox — filter by org name and/or having cases before sorting/ranking
const query = ref('')
const cases_only = ref(false)

const ranked = computed(() => {
    const q = query.value.trim().toLowerCase()
    const rows = display_rows.filter(o => {
        if (q && !o.name.toLowerCase().includes(q)){
            return false
        }
        return !cases_only.value || !!response_log_by_owner[o.id]
    })
    return rows.sort(sorters[sort_mode.value])
})

// Which owners' response log is currently expanded in the table
const expanded = ref(new Set<string>())
function toggle_responses(owner_id:string){
    if (expanded.value.has(owner_id)) expanded.value.delete(owner_id)
    else expanded.value.add(owner_id)
    expanded.value = new Set(expanded.value)
}

// Make the whole row open the owner's page, except for its own interactive children (website/MW
// badges, the Cases button) — those already do their own thing, so let their clicks through
function handle_row_click(owner:typeof display_rows[0], event:MouseEvent){
    if ((event.target as HTMLElement).closest('a, button')) return
    location.href = `/watch/owner/#o=${owner.id}`
}

</script>


<style lang='sass' scoped>

.watch_dashboard_wrap
    .controls
        display: flex
        align-items: center
        justify-content: space-between
        flex-wrap: wrap
        gap: 10px
        margin-bottom: 10px

    .search
        padding: 8px 10px
        border: 1px solid var(--vp-c-divider)
        border-radius: 6px
        font-size: 0.9em
        background: var(--vp-c-bg)
        color: var(--vp-c-text-1)
        flex: 1
        min-width: 200px
        max-width: 320px

    .cases_only
        display: flex
        align-items: center
        gap: 6px
        font-size: 0.85em
        color: var(--vp-c-text-2)
        cursor: pointer
        margin-right: auto

    .sort_toggle
        display: flex
        flex-wrap: wrap
        align-items: center
        gap: 6px

        .sort_label
            font-size: 0.85em
            color: var(--vp-c-text-2)
            margin-right: 2px

        button
            padding: 6px 12px
            border: 1px solid var(--vp-c-divider)
            border-radius: 6px
            background: var(--vp-c-bg)
            color: var(--vp-c-text-2)
            font-size: 0.85em
            cursor: pointer

            &.active
                border-color: var(--vp-c-brand-1)
                color: var(--vp-c-brand-1)
                font-weight: 600

// A CSS-grid "table" rather than a real <table>, styled the same way at every width: a
// number's label sits right there next to it (there's no header row to look up instead), so
// there's nothing to repeat per row that isn't already there. Below 820px that's three lines
// per owner (name, then total + bar + responses, then percentages) since there isn't room for
// everything on one line; from 820px up it's all one line of total, bar, then percentages —
// no horizontal scrollbar at typical widths.
.owner_table
    width: 100%
    font-size: 0.85em

    .owner_row
        display: grid
        grid-template-columns: auto minmax(0, 1fr) auto
        grid-template-areas: "name name name" "total bar responses" "pcts pcts pcts"
        align-items: center
        column-gap: 10px
        row-gap: 6px
        padding: 6px 10px
        border-bottom: 1px solid var(--vp-c-divider)

        &.clickable
            cursor: pointer

            &:hover
                background: var(--vp-c-bg-alt)

    .cell
        min-width: 0

    .cell_label
        margin-right: 4px
        font-weight: 400
        font-size: 0.72em
        opacity: 0.6

    // Row numbers only fit on wide screens
    .rank
        display: none
        grid-area: rank
        opacity: 0.5
        text-align: right

    .name
        grid-area: name

        .website, .ministry_watch
            margin-left: 6px
            font-size: 0.75em
            padding: 1px 5px
            border: 1px solid var(--vp-c-divider)
            border-radius: 4px
            color: var(--vp-c-text-2)

    .total
        grid-area: total

    // Percentages share their own line, spread evenly across it
    .pcts
        grid-area: pcts
        display: flex
        justify-content: space-between
        gap: 10px

    .open_pct
        grid-area: open_pct

    .restricted_pct
        grid-area: restricted_pct

    .semi_pct
        grid-area: semi_pct

    .bar
        grid-area: bar
        align-self: center

    .responses
        grid-area: responses
        align-self: center

    .num
        white-space: nowrap
        font-variant-numeric: tabular-nums
        text-align: left

    // Percentages take their tier's color, matching the headline stat tiles
    .pct_value
        &.open
            color: var(--vp-c-green-1)

        &.semi_restricted
            color: var(--vp-c-yellow-1)

        &.restricted
            color: var(--vp-c-red-1)

    .responses_btn
        padding: 3px 10px
        font-size: 0.75em
        font-family: inherit
        font-variant-numeric: tabular-nums
        border: 1px solid var(--vp-c-yellow-2)
        border-radius: 5px
        background: var(--vp-c-yellow-soft)
        color: var(--vp-c-yellow-1)
        cursor: pointer

        &:hover, &.active
            border-color: var(--vp-c-yellow-1)
            font-weight: 600

    // Rows share the table's columns via subgrid, so the number and Cases columns fit their widest
    // content across all rows (never wrapping), the bar has a set width, and the name takes the rest
    @media (min-width: 820px)
        display: grid
        grid-template-columns: auto minmax(90px, 1fr) auto 160px auto auto auto auto
        column-gap: 10px

        .owner_row, .responses_panel
            grid-column: 1 / -1

        .owner_row
            grid-template-columns: subgrid
            grid-template-areas: "rank name total bar open_pct semi_pct restricted_pct responses"

        .rank
            display: block

        // Let each percentage be its own grid cell so they line up in columns across rows
        .pcts
            display: contents

    .responses_panel
        background: var(--vp-c-bg-alt)
        padding: 10px 14px
        border-bottom: 1px solid var(--vp-c-divider)

    .meter
        display: flex
        width: 100%
        height: 8px
        border-radius: 4px
        overflow: hidden
        background: var(--vp-c-bg-alt)

        .meter_segment
            height: 100%

            &.open
                background: var(--vp-c-green-2)

            // The theme's light yellow-2 is a dark brown next to green/red, so use a brighter
            // amber there (dark theme's yellow-2 is already a proper amber)
            &.semi_restricted
                background: #f5a623

                html.dark &
                    background: var(--vp-c-yellow-2)

            &.restricted
                background: var(--vp-c-red-2)

</style>
