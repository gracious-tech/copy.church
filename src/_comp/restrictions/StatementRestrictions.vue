
<template lang='pug'>

//- WARN keep "translations" class so can share styles
table.translations(ref='table' :class='{advanced}'): tbody
    tr
        th.name Name
        th.year(v-if='!advanced') Year
        th Score
        template(v-if='advanced')
            th License
            th Read
            th Distribute
            th Translate
            th Modify
            th Attribute
            th Commercial
    tr(v-for='item of statements' :key='item.id' :class='{selected: statement_id === item.id}'
            @click='() => change_statement(item.id)')
        td(class='condensed trim name') {{ item.name }}
        td.year(v-if='!advanced') {{ item.year }}
        td.rating
            span.score(:class='item.rating_class') {{ item.rating }}
            span.total &nbsp;/ 6
        template(v-if='advanced')
            td(class='condensed') {{ item.license }}
            td(v-html='b(item.can.read)')
            td(v-html='b(item.can.distribute)')
            td(v-html='b(item.can.translate)')
            td(v-html='b(item.can.modify)')
            td(v-html='b(item.can.not_attribute)')
            td(v-html='b(item.can.use_commercially)')

p.advanced-toggle
    input(v-model='advanced' type='checkbox' id='advanced')
    label(for='advanced') Show advanced info

p &nbsp;

StatementRestrictionsItem(v-if='statement' :statement='statement')
p(v-else)
    strong(class='mixed') Click on a statement to view its restrictions.

</template>


<script lang='ts' setup>

import {computed, ref, nextTick} from 'vue'

import StatementRestrictionsItem from './StatementRestrictionsItem.vue'
import {STATEMENTS} from './statements'


const statements = Object.values(STATEMENTS)
statements.sort((a, b) => b.year - a.year)
statements.sort((a, b) => b.rating - a.rating)

const table = ref()
const statement_id = ref()
const statement = computed(() => STATEMENTS[statement_id.value])

const b = bool => bool === true ? '<span class=good>✓</span>' : `<span class=bad>✕</span>`

const change_statement = id => {
    statement_id.value = id
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

.translations
    th.name, td.name
        text-align: left

</style>
