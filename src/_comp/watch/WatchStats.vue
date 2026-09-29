
<template lang='pug'>

div.watch_stats
    div.stat(v-for='stat of stats' :key='stat.label' :class='stat.tier')
        div.stat_value {{ typeof stat.value === 'number' ? format_num(stat.value) : stat.value }}
        div.stat_label {{ stat.label }}

</template>


<script lang='ts' setup>

import {format_num} from './watch_utils'
import type {LicenseTier} from './watch_utils'


// A row of headline stat tiles, each optionally colored by license tier
defineProps<{stats:{value:string | number, label:string, tier?:LicenseTier}[]}>()

</script>


<style lang='sass' scoped>

.watch_stats
    display: flex
    gap: 12px
    margin-bottom: 16px

.stat
    flex: 1
    padding: 12px 14px
    border: 1px solid var(--vp-c-divider)
    border-radius: 8px
    background: var(--vp-c-bg-alt)

    .stat_value
        font-size: 1.6em
        font-weight: 600
        line-height: 1.2

    .stat_label
        font-size: 0.8em
        opacity: 0.7

    &.open .stat_value
        color: var(--vp-c-green-1)

    &.semi_restricted .stat_value
        color: var(--vp-c-yellow-1)

    &.restricted .stat_value
        color: var(--vp-c-red-1)

</style>
