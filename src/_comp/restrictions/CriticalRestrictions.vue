
<template lang='pug'>

table.translations(ref='table' :class='{advanced}'): tbody
    tr
        th ID
        th(v-if='!advanced') Name
        th(v-if='!advanced') T.
        th.year(v-if='!advanced') Latest
        th Score
        template(v-if='advanced')
            th Read
            th Distribute
            th Translate
            th Modify
            th Attribute
            th Commercial
            th Transparent
        th(v-if='has_reports')
    tr(v-for='item of bibles' :key='item.id' :class='{selected: bible_id === item.id}'
            @click='() => change_text(item.id)')
        td {{ item.abbrev }}
        td(v-if='!advanced' class='condensed trim') {{ item.name }}
        td(v-if='!advanced') {{ item.testament }}
        td.year(v-if='!advanced') {{ item.year }}
        td.rating
            span.score(:class='item.rating_class') {{ item.rating }}
            span.total &nbsp;/ 7
        template(v-if='advanced')
            td(v-html='b(item.can.read)')
            td(v-html='b(item.can.distribute)')
            td(v-html='b(item.can.translate)')
            td(v-html='b(item.can.modify)')
            td(v-html='b(item.can.not_attribute)')
            td(v-html='b(item.can.use_commercially)')
            td(v-html='b(item.can.transparent)')
        td.reports(v-if='has_reports')
            WatchReportsButton(
                v-if='response_log_by_rating_id[item.id]' @click.stop='show_reports(item)'
                :count='response_log_by_rating_id[item.id].length'
                :active='reports_open && reports_item?.id === item.id' compact
            )

//- The clicked item's reports, shown in a modal
WatchReportsDialog(
    v-model='reports_open' :title='`Reports for ${reports_item?.abbrev ?? ""}`'
    :entries='reports_item ? response_log_by_rating_id[reports_item.id] ?? [] : []'
)

p.advanced-toggle
    input(v-model='advanced' type='checkbox' id='advanced')
    label(for='advanced') Show advanced info

p &nbsp;

CriticalRestrictionsItem(v-if='bible' :bible='bible')
p(v-else)
    strong(class='mixed') Click on a critical text to view its restrictions.

</template>


<script lang='ts' setup>

import {computed, ref, nextTick} from 'vue'

import CriticalRestrictionsItem from './CriticalRestrictionsItem.vue'
import {CRITICALS} from './critical_texts'
import WatchReportsButton from '../watch/WatchReportsButton.vue'
import WatchReportsDialog from '../watch/WatchReportsDialog.vue'
import {response_log_by_rating_id, use_reports_dialog} from '../watch/watch_utils'


const bibles = Object.values(CRITICALS)
bibles.sort((a, b) => b.year - a.year)
bibles.sort((a, b) => b.rating - a.rating)

const table = ref()
const bible_id = ref()
const bible = computed(() => CRITICALS[bible_id.value])

const b = bool => bool === true ? '<span class=good>✓</span>' : `<span class=bad>✕</span>`

const change_text = id => {
    bible_id.value = id
    // Scroll down to the restrictions (especially helpful on mobile)
    nextTick(() => {
        const rect = table.value.getBoundingClientRect()
        const table_bottom = self.scrollY + rect.y + rect.height
        const toolbar_height = 48
        self.scrollTo({
            top: table_bottom - toolbar_height,
            behavior: 'smooth',
        })
    })
}

// Advanced info columns available when screen wide enough
const advanced = ref(false)

// The reports column only shows when at least one item has reports
const has_reports = bibles.some(item => response_log_by_rating_id[item.id])

// The critical text whose reports are shown in the dialog
const {target: reports_item, open: reports_open, show: show_reports} =
    use_reports_dialog<typeof bibles[0]>()

</script>


<style lang='sass' scoped>

@use 'restrictions'

</style>
