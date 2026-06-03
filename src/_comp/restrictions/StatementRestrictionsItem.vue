
<template lang='pug'>

h1 Restrictions
p Here's what you can/can't do with the #[em {{ statement.name }}].

p <a :href='statement.website' target='_blank'>Official Website</a> | #[strong {{ statement.license }}]

table: tbody

    tr
        th
            | Read online
            div(v-html='b(statement.can.read)')
            img(src='@/_assets/restrictions/ill_read.svg')
        td
            p Most statements are published online so anyone can read them freely.
            p(v-html='can(statement.can.read)')
            ul
                li Read this statement online without payment

    tr
        th
            | Distribute
            div(v-html='b(statement.can.distribute)')
            img(src='@/_assets/restrictions/ill_quote.svg')
        td
            p The ability to copy and share the full statement without first asking permission — in articles, books, study guides, apps, or printed handouts.
            p(v-html='can(statement.can.distribute)')
            ul
                li Reprint the full statement in a book or article
                li Include the statement in a study guide or app
                li Hand out copies at a church or conference

    tr
        th
            | Translate
            div(v-html='b(statement.can.translate)')
            img(src='@/_assets/restrictions/ill_translate.svg')
        td
            p A statement only reaches the global Church if it can be translated. Many copyrighted statements require explicit permission from the publisher to translate, which can take months or never come.
            p(v-html='can(statement.can.translate)')
            ul
                li Translate this statement into other languages

    tr
        th
            | Adapt
            div(v-html='b(statement.can.modify)')
            img(src='@/_assets/restrictions/ill_derivatives.svg')
        td
            p Most copyrighted statements forbid anyone from changing the text, even when the modified version would be published under a different name and not associated with the original publisher's brand.
            p(v-html='can(statement.can.modify)')
            ul
                li Produce an abridged version for teaching
                li Integrate parts into a church's own belief statement

    tr
        th
            | Use without attribution
            div(v-html='b(statement.can.not_attribute)')
            img(src='@/_assets/restrictions/ill_attribution.svg')
        td
            p The ability to use a statement without always adding some form of attribution to acknowledge its ownership.
            p(v-html='can(statement.can.not_attribute)')
            ul
                li Exclude the attribution for the sake of making a graphic design cleaner
                li Quote portions in sermons or teaching without a citation
                li Reproduce it on a flyer without crediting the publisher

    tr
        th
            | Use commercially
            div(v-html='b(statement.can.use_commercially)')
            img(src='@/_assets/restrictions/ill_commercial.svg')
        td
            p Whether the statement may be included in a paid product — for example, a book sold at cost, a commercial study course, or a paid app.
            p(v-html='can(statement.can.use_commercially)')
            ul
                li Include the statement in a paid book or course
                li Include the statement in a paid app

p
    small Statements with no license are assumed to be under full copyright, which is the default in most countries.

</template>


<script lang='ts' setup>

import {computed} from 'vue'

const props = defineProps({statement: Object})
const statement = computed(() => props.statement)


const b = bool => bool === true ? '<span class=good>✓</span>' : `<span class=bad>✕</span>`

const can = val => val === true ? `You <strong class=good>can</strong>:` : `You <strong class=bad>can&apos;t</strong>:`

</script>


<style lang='sass' scoped>

@use 'restrictions_item'

</style>
