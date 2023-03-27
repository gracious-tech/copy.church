
<template lang='pug'>

table.translations(ref='table' :class='{advanced}')
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


const bibles = Object.values(CRITICALS)
bibles.sort((a, b) => a.rating - b.rating)

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

</script>


<style lang='sass' scoped>

@use 'restrictions'

</style>
