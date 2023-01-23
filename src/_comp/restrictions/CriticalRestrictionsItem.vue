
<template lang='pug'>

h1 {{ bible.abbrev }} Restrictions
p
    | Here's what you can/can't do with the #[em {{ bible.name }}].
    br
    | <a :href='bible.info' target='_blank'>{{ bible.abbrev}} website</a> | <a :href='bible.read' target='_blank'>read online</a> | <a :href='bible.license' target='_blank'>view license</a>

table

    tr
        th
            | Read for free
            div(v-html='b(bible.can.read)')
            img(src='@/_assets/restrictions/ill_read.svg')
        td
            p Almost every critical text can be read for free somewhere on the Internet, whether it is on the owner's website or in a popular Bible app.
            p(v-html='can(bible.can.read)')
            ul
                li Read this critical text for free in at least one app/website

    tr
        th
            | Distribute
            div(v-html='b(bible.can.distribute)')
            img(src='@/_assets/restrictions/ill_quote.svg')
        td
            p The ability to use verses and passages from the critical text without limitation in any other kind of work, such as an article, a book, or an app.
            p(v-html='can(bible.can.distribute)')
            ul
                li Share as much as you like
                li Print and distribute this critical text yourself
                li Include this critical text in a new Bible app

    tr
        th
            | Translate
            div(v-html='b(bible.can.translate)')
            img(src='@/_assets/restrictions/ill_translate.svg')
        td
            p The purpose of critical texts is to be the basis of translations of Scripture, and yet many do not actually allow it without royalty agreements.
            p(v-html='can(bible.can.translate)')
            ul
                li Use this critical text for a new Bible translation

    tr
        th
            | Modify
            div(v-html='b(bible.can.modify)')
            img(src='@/_assets/restrictions/ill_derivatives.svg')
        td
            p Most critical texts forbid anyone from changing them, even if they were to publish such changes under a different name and not associate them with the source critical texts' brand.
            p(v-html='can(bible.can.modify)')
            ul
                li Correct or improve any parts of the critical text
                li Account for new manuscript discoveries

    tr
        th
            | Use without attribution
            div(v-html='b(bible.can.not_attribute)')
            img(src='@/_assets/restrictions/ill_attribution.svg')
        td
            p The ability to use a critical text without always adding some form of attribution to acknowledge its ownership.
            p(v-html='can(bible.can.not_attribute)')
            ul
                li Exclude the attribution for the sake of making a graphic design cleaner
                li Share a Bible translation without attributing the critical text

    tr
        th
            | Use commercially
            div(v-html='b(bible.can.use_commercially)')
            img(src='@/_assets/restrictions/ill_commercial.svg')
        td
            p Whether this critical text can be used commercially in full, such as by charging to use it or including it in a paid product.
            p(v-html='can(bible.can.use_commercially)')
            ul
                li Use this critical text in a paid Bible commentary
                li Use this critical text in paid Bible study software

    tr
        th
            | Transparent
            div(v-html='b(bible.can.transparent)')
            img(src='@/_assets/restrictions/ill_other.svg')
        td
            p Most critical texts will list differences between manuscripts and explain the general principles behind why they choose certain variants over others. But when it comes to knowing why any one particular decision was made, only the Statistical Restoration provides such transparency.
            p(v-html='can(bible.can.transparent)')
            ul
                li See exactly why variants were chosen over others

p
    small You may be able to ask the copyright owner for additional permissions. Though, <a href='/explain/objections/#just-ask-for-permission'>there is no guarantee</a> your request will be accepted.

</template>


<script lang='ts' setup>

import {computed} from 'vue'

const props = defineProps({bible: Object})
const bible = computed(() => props.bible)

const b = bool => bool === true ? '<span class=good>✓</span>' : `<span class=bad>✕</span>`

const can = val => val === true ? `You <strong class=good>can</strong>:` : `You <strong class=bad>can&apos;t</strong>:`

</script>


<style lang='sass' scoped>

@use 'restrictions_item'

</style>
