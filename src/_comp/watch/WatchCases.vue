
<template lang='pug'>

div.watch_cases
    p: em How the org has responded to requests and use of their Bible version.
    div.response_entry(v-for='entry of entries' :key='entry.id')
        div.response_top
            span.response_date {{ entry.date ? format_date(entry.date) : "Undated" }}
            //- Only the first (most relevant) source is linked, the rest are kept as a record
            a(v-if='entry.sources.length' :href='entry.sources[0]' target='_blank' rel='noreferrer')
                | Source ↗
        //- Summaries are trusted HTML, which may contain links and block quotes
        div.response_summary(v-html='entry.summary')
    //- Reported cases understate how often requests are refused
    p.response_disclaimer(v-if='entries.length')
        | There are likely many more cases than those listed here, as most are never shared publicly.

</template>


<script lang='ts' setup>

import {format_date} from './watch_utils'
import type {ResponseLogEntry} from '@/_data/watch/types'


// A list of response log cases, each with its date, source, and summary
defineProps<{entries:ResponseLogEntry[]}>()

</script>


<style lang='sass' scoped>

.response_entry
    padding: 24px 0
    border-bottom: 1px solid var(--vp-c-border)

    // The disclaimer follows the entries, so the last entry isn't the last child
    &:last-of-type
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
        line-height: 1.5

        // Summary HTML is injected, so scoped styles must reach into it
        :deep(blockquote)
            margin: 8px 0 8px 8px
            padding-left: 12px
            border-left: 3px solid var(--vp-c-divider)
            color: var(--vp-c-text-2)

.response_disclaimer
    font-size: 0.85em
    font-style: italic
    color: var(--vp-c-text-2)

</style>
