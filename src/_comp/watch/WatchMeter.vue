
<template lang='pug'>

div.meter
    div.meter_segment(v-for='tier of tiers' :key='tier' :class='tier' :style='{flex: counts[tier]}')

</template>


<script lang='ts' setup>

import type {LicenseTier} from './watch_utils'


// A bar split into open/semi-restricted/restricted segments, each grown in proportion to its raw
// count so they always fill the bar exactly (rounded percentages can add up to 99 or 101)
defineProps<{counts:Record<LicenseTier, number>}>()

// Segment order, left to right
const tiers:LicenseTier[] = ['open', 'semi_restricted', 'restricted']

</script>


<style lang='sass' scoped>

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

    // The theme's light yellow-2 is a dark brown next to green/red, so use a brighter amber there
    // (dark theme's yellow-2 is already a proper amber)
    &.semi_restricted
        background: #f5a623

        html.dark &
            background: var(--vp-c-yellow-2)

    &.restricted
        background: var(--vp-c-red-2)

</style>
