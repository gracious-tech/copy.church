
<template lang='pug'>

h1 {{ bible.abbrev }} Restrictions
p
    | Here's what you can/can't do with the #[em {{ bible.name }}].
    br
    | <a :href='bible.info' target='_blank'>{{ bible.abbrev}} website</a> | <a :href='bible.read' target='_blank'>read online</a> | <a :href='bible.license' target='_blank'>view license</a>

p(v-if='bible.id === "kjv"' class='mixed') Copyright of the KJV should have expired a long time ago, however the British Crown is the owner and is exempt from common copyright law in the UK, so it is only in the public domain outside of the UK.

table

    tr
        td(colspan='2')
            h3 Personal use

    tr
        th
            | Read for free
            div(v-html='b(bible.can.read_for_free)')
            img(src='@/_assets/ill_read.svg')
        td
            p Almost every translation can be read for free somewhere on the Internet, whether it is on the translation owner's website or in a popular Bible app.
            p(v-html='can(bible.can.read_for_free)')
            ul
                li Read this translation for free in at least one app/website
    tr
        th
            | Read anonymously
            div(v-html='b(bible.can.read_anonymously)')
            img(src='@/_assets/ill_privacy.svg')
        td
            p Some translation owners require you to #[a(href='./privacy/') hand over your personal information] to them in exchange for being allowed to read it offline.
            p(v-html='can(bible.can.read_anonymously)')
            ul
                li Anonymously read this translation offline in popular Bible apps

    tr
        td(colspan='2')
            h3 Sharing

    tr
        th
            | Share unlimited verses
            div(v-html='b(bible.can.quote)')
            img(src='@/_assets/ill_quote.svg')
        td
            p The ability to use verses and passages from the translation without limitation in any other kind of work, such as an article, a book, or an app.
            p(v-html='can(bible.can.quote)')
            ul
                li(v-if='bible.can.quote === true') Share as much as you like
                li(v-else) Share more than {{ bible.can.quote }} verses
                li Print and distribute this translation yourself
                li Include this translation in a new Bible app
    tr
        th
            | Share by itself
            div(v-html='b(bible.can.quote_ratio)')
            img(src='@/_assets/ill_ratio.svg')
        td
            p The ability to share plain quotations of Scripture, instead of only being able to quote Scripture as a smaller part of a resource filled with other commentary.
            p(v-html='can(bible.can.quote_ratio)')
            ul
                li(v-if='bible.can.quote_ratio === true') Create a resource that is plain Scripture
                li(v-else) Create a resource that is {{ bible.can.quote_ratio }}% or more plain Scripture
                li Create a study guide that asks a few questions in response to a passage
                li Share some parables Jesus told
    tr
        th
            | Share an entire book
            div(v-html='b(bible.can.quote_book)')
            img(src='@/_assets/ill_book.svg')
        td
            p The ability to share a whole book of the Bible (regardless if within quotation limits).
            p(v-html='can(bible.can.quote_book)')
            ul
                li Print out 3 John (single page) and share it with a Bible study for highlighting and discussing
                li Print Mark (15 pages) and give it to someone wanting to know more about Jesus

    tr
        td(colspan='2')
            h3 Usage

    tr
        th
            | Quote in open resources
            div(v-html='b(bible.can.use_quote_openly)')
            img(src='@/_assets/ill_open.svg')
        td
            p Some translations #[a(href='./open/') forbid even being quoted at all] in resources that are openly licensed (free to share with others), such as resources that use a Creative Commons license.
            p(v-html='can(bible.can.use_quote_openly)')
            ul
                li Quote a verse in a Bible study that's free to copy and use (CC BY)
                li Quote a verse in a book that's free to share non-commercially (CC BY-NC)

    tr
        th
            | Use commercially
            div(v-html='b(bible.can.use_commercially)')
            img(src='@/_assets/ill_commercial.svg')
        td
            p Whether this translation can be used commercially in full, such as by charging to use it or including it in a paid product.
            p(v-html='can(bible.can.use_commercially)')
            ul
                li Use this translation in a paid Bible commentary
                li Use this translation in paid Bible study software

    tr
        th
            | Use without attribution
            div(v-html='b(bible.can.not_attribute)')
            img(src='@/_assets/ill_attribution.svg')
        td
            p The ability to use a translation without always adding some form of attribution to acknowledge its ownership.
            p(v-html='can(bible.can.not_attribute)')
            ul
                li Exclude the attribution for the sake of making a graphic design cleaner
                li Exclude the attribution to avoid distracting readers who haven't read the Bible before

    tr
        td(colspan='2')
            h3 Adaptations

    tr
        th
            | Audio / Video
            div(v-html='b(bible.can.audio)')
            img(src='@/_assets/ill_audio.svg')
        td
            p Whether this translation can be recorded as audio and used in audiobooks or videos to be more accessible to audio-visual learners, in addition to any recordings already available.
            p(v-html='can(bible.can.audio)')
            ul
                li Create an audio recording in a more familiar accent
                li Create a video of Jonah acted out

    tr
        th
            | Translate
            div(v-html='b(bible.can.translate)')
            img(src='@/_assets/ill_translate.svg')
        td
            p When translating the Bible for a people group that doesn't have it yet, it is sometimes better to translate from a language they already know (such as English) than from the Bible's original languages, until someone can be taught them.
            p(v-html='can(bible.can.translate)')
            ul
                li Translate this Bible translation into a language that doesn't have the Bible yet
    tr
        th
            | Modify
            div(v-html='b(bible.can.modify)')
            img(src='@/_assets/ill_derivatives.svg')
        td
            p Most translations forbid anyone from changing them, even if they were to publish such changes under a different name and not associate them with the source translations' brand.
            p(v-html='can(bible.can.modify)')
            ul
                li Rephrase anything into simpler English for second language learners
                li Correct or improve any parts of the translation

    tr
        td(colspan='2')
            h3 The owner

    tr
        th
            | Owner supportive
            div(v-html='b(bible.can.owner_supportive)')
            img(src='@/_assets/ill_other.svg')
        td
            p Whether the owner of this translation supports allowing Bible translations to be freely shared without much restriction.
            p Some translation owners use profits of restricted translations to fund more openly licensed translations in other languages.
            p(v-html='can(bible.can.owner_supportive)')
            ul
                li Use some of their translations freely

h3 You #[em may] be able to do more than this
p These restrictions are based on what the translation owner has declared is allowed, however they do not nullify #[a(href='/explain/copyright/#fair-use') existing rights to fair use] which may be slightly more permissive in some cases.
p You also may be able to ask the copyright owner for additional permissions. Though, <a href='/explain/objections/#just-ask-for-permission'>there is no guarantee</a> your request will be accepted.
p
    small Some licenses have different conditions depending on the intended use (such as commercial and non-commercial), and above represents whichever is most permissive (see actual licenses for more details).

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
