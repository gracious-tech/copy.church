
<template lang='pug'>

h3 1. Select the type of resource

div.categories
    input(v-model='category' type='radio' id='category_book' value='book')
    label(for='category_book') Book
    input(v-model='category' type='radio' id='category_music' value='music')
    label(for='category_music') Music
    input(v-model='category' type='radio' id='category_image' value='image')
    label(for='category_image') Image
    input(v-model='category' type='radio' id='category_video' value='video')
    label(for='category_video') Video
    input(v-model='category' type='radio' id='category_software' value='software')
    label(for='category_software') Software
    input(v-model='category' type='radio' id='category_other' value='')
    label(for='category_other') Other


h3 2. Choose your preferred badge

div.badges
    div
        h4 Let's copy, church
        img(:src='`/badges/lcc_standard_${pd_code}.svg`'
            :class='{active: badge === "lcc_standard"}' @click='badge = "lcc_standard"')
    //- div
    //-     h4
    //-         a(href='https://freely.giving' target='freely') Freely Giving
    //-     img(:src='`/badges/fg_standard_${pd_code}.svg`'
    //-         :class='{active: badge === "fg_standard"}' @click='badge = "fg_standard"')
    div
        h4
            a(href='https://sellingjesus.org' target='sj') Selling Jesus
        img(:src='`/badges/sj_standard_${pd_code}.svg`'
            :class='{active: badge === "sj_standard"}' @click='badge = "sj_standard"')
        img(:src='`/badges/sj_alt_${pd_code}.svg`'
            :class='{active: badge === "sj_alt"}' @click='badge = "sj_alt"')
    div
        h4 Text only
        img(src='/_assets/images/no_badge.svg'
            :class='{active: badge === ""}' @click='badge = ""')


h3 3. Add {{ badge ? "the badge" : `"${license_desc}"` }} to your resource

p.links(v-if='badge')
    VPButton(:text='copy_badge_text' @click='copy_badge')
    a(:href='badge_url_base + "png"' target='_blank') URL for PNG
    a(v-if='category !== "book"' :href='badge_url_base + "svg"' target='_blank') URL for SVG

p
    span(v-if='category === "book"') Paste it into the first page of the book, where a copyright notice would usually go.
    span(v-else-if='category === "music"') Paste it next to your songs, wherever they are able to be downloaded or listened to.
    span(v-else-if='category === "image"') Paste it next to your image, wherever it is able to be viewed or downloaded. It is not necessary to include it in the image itself.
    span(v-else-if='category === "video"') Paste it next to your video, wherever it is able to be watched or downloaded. You may also like to put it at the end of your video if appropriate.
    span(v-else-if='category === "software"') Paste it in the README for your software and link it to <strong>{{ license_url }}</strong> to encourage others to give without conditions too.
    span(v-else) Paste it either inside your resource or next to any links to download it.
    |
    span(v-if='badge')  Resize as desired (standard width is 360px).

details
    summary Optional additions
    p You may wish to elaborate on what people can do with your resource and why you have made it free. For example:
    blockquote
        p You can copy, translate, modify, and distribute this resource, without restriction, and without needing to ask permission.
    blockquote
        p This resource is freely given (Matt 10:8) for the sake of the gospel.

h3 4. Add {{ category === "software" ? "a no-conditions license" : "the public domain link" }} (⚠️ <em>important</em>)

template(v-if='category === "software"')
    p It is best to use a software license for software, due to #[a(href='https://en.wikipedia.org/wiki/Public-domain-equivalent_license' target='_blank') legal issues with patents]. We recommend using the #[a(href='https://choosealicense.com/licenses/mit-0/' target='_blank') MIT No Attribution] license, which essentially operates the same as a public domain dedication without the legal issues. Copy the license text into a LICENSE file in your source code and fill in the year and your name.
    p
        em Open source licenses that require attribution, or any other condition, are not endorsed by us.

template(v-else)
    p.links
        strong {{ license_url }}
        VPButton(:text='copy_link_text' @click='copy_link')
        a(:href='license_url' target='_blank') Open
    p This link points to legal text that permanently relinquishes your ownership of the resource. Please ensure you have read and understand it. Make the {{ badge ? "badge" : "dedication" }} go to it when clicked or paste it below it.


</template>


<script lang='ts' setup>

import {ref, computed} from 'vue'

const category = ref(null as null|'book'|'music'|'image'|'video'|'software'|'')
const badge = ref(null as null|'lcc_standard'|'lcc_alt'|'sj_standard'|'sj_alt'|'fg_standard'|'')
const copy_badge_text = ref("Copy badge image")
const copy_link_text = ref("Copy")


const pd_code = computed(() => {
    return category.value === 'software' ? 'pde' : 'pd'
})

const license_url = computed(() => {
    const base = badge.value?.startsWith('sj_') ? 'https://sellingjesus.org' :
        (badge.value?.startsWith('fg_') ? 'https://freely.giving' : 'https://copy.church')
    return pd_code.value === 'pd' ? base + '/free' : base
})

const license_desc = computed(() => {
    return pd_code.value === 'pd' ? "Dedicated to the public domain via CC0" : "Freely given"
})

const badge_url_base = computed(() => {
    // The URL for the chosen badge, excluding the file extension
    const flat = category.value === 'book' ? '_flat' : ''
    return `/badges/${badge.value}_${pd_code.value}${flat}.`
})


const copy_badge = async () => {
    try {
        const blob = await (await fetch(`${badge_url_base.value}png`)).blob()
        await self.navigator.clipboard.write([new ClipboardItem({[blob.type]: blob})])
        copy_badge_text.value = "Copied, now paste it"
    } catch {
        copy_badge_text.value = "Unable to copy (use the URL)"
    }
    setTimeout(() => {
        copy_badge_text.value = "Copy badge image"
    }, 1000 * 3)
}

const copy_link = async () => {
    try {
        await self.navigator.clipboard.writeText(license_url.value)
        copy_link_text.value = "Copied, now paste it"
    } catch {
        copy_link_text.value = "Unable to copy (use the URL)"
    }
    setTimeout(() => {
        copy_link_text.value = "Copy"
    }, 1000 * 3)
}

</script>


<style lang='sass' scoped>

p, li
    color: var(--vp-c-text-2)

summary
    cursor: pointer

h3
    margin-top: 64px
    margin-bottom: 24px

.badges
    margin-top: 24px

    img
        width: 360px
        display: inline-flex
        box-sizing: content-box
        border: 2px solid transparent
        border-radius: 24px
        padding: 4px
        cursor: pointer

        &.active
            border-color: #f0f9

        @media (max-width: 600px)
            img
                width: 100%
                max-width: 360px

    > div
        display: flex
        align-items: center
        gap: 12px
        margin-bottom: 18px

        @media (max-width: 1200px)
            flex-direction: column

    h4
        width: 140px
        text-align: center
        margin-top: 0
        margin-bottom: 0
        font-size: 16px
        font-weight: bold
        font-style: italic
        opacity: 0.8
        a
            color: inherit
            font-weight: inherit

.links
    & > *
        margin-right: 24px
        margin-bottom: 12px
        display: inline-block


</style>
