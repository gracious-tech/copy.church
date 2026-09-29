
<template lang='pug'>

div.watch_cases
    div.response_entry(v-for='entry of entries' :key='entry.id')
        div.response_top
            span.response_date {{ entry.date || 'Undated' }}
            a(v-if='entry.evidence_url' :href='entry.evidence_url' target='_blank' rel='noreferrer')
                | Source ↗
        p.response_summary {{ entry.summary }}

</template>


<script lang='ts' setup>

import type {ResponseLogEntry} from '@/_data/watch/types'


// A list of response log cases, each with its date, source, and summary
defineProps<{entries:ResponseLogEntry[]}>()

</script>


<style lang='sass' scoped>

.response_entry
    padding: 8px 0
    border-bottom: 1px solid var(--vp-c-divider)

    &:last-child
        border-bottom: none

    .response_top
        display: flex
        justify-content: space-between
        align-items: baseline
        font-size: 0.85em
        margin-bottom: 4px

    .response_date
        color: var(--vp-c-text-2)
        font-weight: 600

    .response_summary
        margin: 0
        line-height: 1.5

</style>
