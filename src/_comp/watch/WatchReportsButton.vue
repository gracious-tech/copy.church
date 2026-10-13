
<template lang='pug'>

button.reports_btn(:class='{active, compact}')
    span.label Reports (
    | {{ format_num(count) }}
    span.label )

</template>


<script lang='ts' setup>

import {format_num} from './watch_utils'


// A toggle showing how many reports there are, highlighted while its reports are expanded
// When compact, only the count is shown on narrow screens
defineProps<{count:number, active:boolean, compact?:boolean}>()

</script>


<style lang='sass' scoped>

.reports_btn
    padding: 3px 10px
    font-size: 0.75em
    font-family: inherit
    font-variant-numeric: tabular-nums
    white-space: nowrap
    border: 1px solid var(--vp-c-yellow-2)
    border-radius: 5px
    background: var(--vp-c-yellow-soft)
    color: var(--vp-c-yellow-1)
    cursor: pointer

    &:hover, &.active
        border-color: var(--vp-c-yellow-1)
        font-weight: 600

// Show just the count on narrow screens when compact
@media (max-width: 600px)
    .reports_btn.compact .label
        display: none

</style>
