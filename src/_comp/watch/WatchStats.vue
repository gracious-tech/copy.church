
<template lang='pug'>

div.watch_stats(:class='{has_desc: stats.some(stat => stat.desc)}')
    div.stat(v-for='stat of stats' :key='stat.label' :class='stat.tier')
        div.stat_head
            div.stat_value {{ typeof stat.value === 'number' ? format_num(stat.value) : stat.value }}
            div.stat_label {{ stat.label }}
        div.stat_desc(v-if='stat.desc') {{ stat.desc }}

</template>


<script lang='ts' setup>

import {format_num} from './watch_utils'
import type {LicenseTier} from './watch_utils'


// A row of headline stat tiles, each optionally colored by license tier and explained underneath
defineProps<{stats:{value:string | number, label:string, tier?:LicenseTier, desc?:string}[]}>()

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
