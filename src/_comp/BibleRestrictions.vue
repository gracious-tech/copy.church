
<template lang='pug'>

table.translations(ref='table' :class='{advanced}')
    tr
        th ID
        th(v-if='!advanced') Name
        th.year(v-if='!advanced') First
        th Score
        template(v-if='advanced')
            th Wording
            th NT source
            th Read
            th Anonymous
            th Unlimited
            th By itself
            th Book
            th Quote
            th Commercial
            th Attribute
            th Audio
            th Translate
            th Modify
            th Supportive
    tr(v-for='item of bibles' :class='{selected: bible_id === item.id}'
            @click='() => change_translation(item.id)')
        td {{ item.abbrev }}
        td(v-if='!advanced' class='condensed trim') {{ item.name }}
        td.year(v-if='!advanced') {{ item.year }}
        td.rating
            span.score(:class='item.rating_class') {{ item.rating }}
            span.total &nbsp;/ 12
        template(v-if='advanced')
            td(class='condensed') {{ item.type }}
            td(class='condensed') {{ item.source }}
            td(v-html='b(item.can.read_for_free)')
            td(v-html='b(item.can.read_anonymously)')
            td(v-html='num(item.can.quote)')
            td(v-html='per(item.can.quote_ratio)')
            td(v-html='b(item.can.quote_book)')
            td(v-html='b(item.can.use_quote_openly)')
            td(v-html='b(item.can.use_commercially)')
            td(v-html='b(item.can.not_attribute)')
            td(v-html='b(item.can.audio)')
            td(v-html='b(item.can.translate)')
            td(v-html='b(item.can.modify)')
            td(v-html='b(item.can.owner_supportive)')

p.advanced-toggle
    input(v-model='advanced' type='checkbox' id='advanced')
    label(for='advanced') Show advanced info

p &nbsp;

BibleRestrictionsItem(v-if='bible' :bible='bible')
p(v-else)
    strong(class='mixed') Click on a translation to view its restrictions.

</template>


<script lang='ts' setup>

import {computed, ref, nextTick} from 'vue'

import BibleRestrictionsItem from './BibleRestrictionsItem.vue'
import {BIBLES} from './bibles'


const bibles = Object.values(BIBLES)
bibles.sort((a, b) => a.rating - b.rating)

const table = ref()
const bible_id = ref()
const bible = computed(() => BIBLES[bible_id.value])

const b = bool => bool === true ? '<span class=good>✓</span>' : `<span class=bad>✕</span>`
const num = val => val === true ? '<span class=good>✓</span>' : `<span class=bad>${val}</span>`
const per = val => val === true ? '<span class=good>✓</span>' : `<span class=bad>${val}%</span>`

const change_translation = id => {
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

.translations
    cursor: pointer
    display: table  // Vitepress defaults to block for tables for some reason
    width: 100%

    tr
        background-color: transparent !important

        th, td
            white-space: nowrap
            text-align: center

        td.trim
            // Trim name if needed to prevent horizontal scroll
            max-width: 45vw
            overflow: hidden
            white-space: nowrap
            text-overflow: ellipsis

        td.condensed
            font-size: 0.8em

        &:hover
            background-color: rgba(#dbc600, 0.1) !important

        &.selected
            background-color: rgba(#dbc600, 0.2) !important

    .rating
        text-align: right

        .score
            font-family: monospace
            font-size: 1.5em
            font-weight: bold

        .total
            font-size: 0.8em


// Condense table for narrow screens
@media (max-width: 600px)
    .translations

        .total
            display: none

        td, th
            font-size: 14px
            padding: 6px 8px

        // Hide year column in narrow screens to prevent horizontal scroll
        .year
            display: none

    // Hide ability to show advanced columns since won't have room
    .advanced-toggle
        display: none !important


.advanced-toggle
    font-size: 0.8rem
    opacity: 0.8
    display: flex
    padding-left: 24px

    input
        margin: 0  // Prevents click
        cursor: pointer

    label
        padding-left: 12px
        cursor: pointer

</style>
