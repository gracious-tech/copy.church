
<template lang='pug'>

div.watch_stats(:class='{has_desc: stats.some(stat => stat.desc)}')
    //- Tier tiles are buttons that open their tier's explainer when it's enabled
    component.stat(
        v-for='stat of stats' :key='stat.label' :is='explain && stat.tier ? "button" : "div"'
        :class='[stat.tier, {explain: explain && stat.tier}]'
        :title='explain && stat.tier ? "What does this mean?" : undefined'
        @click='show_tier(stat.tier)'
    )
        //- Spans rather than divs, as only inline elements are valid inside a button
        span.stat_body
            span.stat_head
                span.stat_value
                    | {{ typeof stat.value === 'number' ? format_num(stat.value) : stat.value }}
                span.stat_label {{ stat.label }}
            span.stat_desc(v-if='stat.desc') {{ stat.desc }}
        //- A hint that the tile opens an explainer (the whole tile is the button)
        span.more(v-if='explain && stat.tier') Explain

    WatchTierDialog(v-if='explain' v-model='explain_open' :tier='explain_tier')

</template>


<script lang='ts' setup>

import {ref} from 'vue'

import WatchTierDialog from './WatchTierDialog.vue'
import {format_num} from './watch_utils'
import type {LicenseTier} from './watch_utils'


// A row of headline stat tiles, each optionally colored by license tier and explained underneath,
// and optionally clickable to explain what its tier means in practice
const props = defineProps<{
    stats:{value:string | number, label:string, tier?:LicenseTier, desc?:string}[],
    explain?:boolean,
}>()

// Which tier's explainer is showing, if any
const explain_tier = ref<LicenseTier>('restricted')
const explain_open = ref(false)

// Open the explainer for a clicked tile's tier
function show_tier(tier?:LicenseTier){
    if (!props.explain || !tier)
        return
    explain_tier.value = tier
    explain_open.value = true
}

</script>


<style lang='sass' scoped>

// Equal-width tiles that wrap onto more rows when there isn't room, with explained tiles needing
// more width each
.watch_stats
    display: grid
    grid-template-columns: repeat(auto-fit, minmax(90px, 1fr))
    gap: 12px
    margin-bottom: 16px

    &.has_desc
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))

.stat
    padding: 12px 14px
    border: 1px solid var(--vp-c-divider)
    border-radius: 8px
    background: var(--vp-c-bg-alt)

    // The tile's parts are spans (valid inside a button), so lay them out as blocks
    .stat_body, .stat_desc
        display: block

    // The label sits on the number's line, dropping below it only when the tile is too narrow
    .stat_head
        display: flex
        flex-wrap: wrap
        align-items: baseline
        column-gap: 8px

    .stat_value
        font-size: 1.6em
        font-weight: 600
        line-height: 1.2

    .stat_label
        font-size: 0.9em
        font-weight: 600

    // Clickable tiles keep the look of plain ones, with a small text hint in the bottom right
    &.explain
        display: flex
        flex-direction: column
        width: 100%
        font: inherit
        color: inherit
        text-align: left
        cursor: pointer

        &:hover
            border-color: var(--vp-c-brand-1)

            .more
                color: var(--vp-c-brand-1)

        // The content fills any extra height, keeping the hint at the bottom
        .stat_body
            flex: 1

    .more
        align-self: flex-end
        line-height: 1
        color: var(--vp-c-text-2)
        font-size: 0.65em
        font-weight: 600
        text-transform: uppercase

    .stat_desc
        margin-top: 4px
        font-size: 0.8em
        line-height: 1.4
        opacity: 0.7

    &.open
        .stat_value, .stat_label
            color: var(--vp-c-green-1)

    &.semi_restricted
        .stat_value, .stat_label
            color: var(--vp-c-yellow-1)

    &.restricted
        .stat_value, .stat_label
            color: var(--vp-c-red-1)

</style>
