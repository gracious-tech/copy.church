
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
    div.short
        h4 Let's copy, church
        img(:src='`/badges/lcc_standard_${pd_code}.svg`'
            :class='{active: badge === "lcc_standard"}' @click='badge = "lcc_standard"')
        img(:src='`/badges/lcc_alt_${pd_code}.svg`'
            :class='{active: badge === "lcc_alt"}' @click='badge = "lcc_alt"')
        div
        h4
            a(href='https://sellingjesus.org' target='sj') Selling Jesus
        img(:src='`/badges/sj_standard_${pd_code}.svg`'
            :class='{active: badge === "sj_standard"}' @click='badge = "sj_standard"')
        img(:src='`/badges/sj_alt_${pd_code}.svg`'
            :class='{active: badge === "sj_alt"}' @click='badge = "sj_alt"')
    div.none
        h4 Text only
        img(src='/_assets/images/no_badge.svg'
            :class='{active: badge === ""}' @click='badge = ""')


h3 3. Add {{ badge ? "the badge" : `"${license_desc}"` }} to your resource

p.links(v-if='badge')
        VPButton(:text='copy_badge_text' @click='copy_badge')
    a(:href='badge_url_base + "png"' target='_blank') URL for PNG
    a(:href='badge_url_base + "svg"' target='_blank') URL for SVG

p(v-if='category === "book"') Paste it into the first page of the book, where a copyright notice would usually go.
p(v-else-if='category === "music"') Paste it next to your songs, wherever they are able to be downloaded or listened to.
p(v-else-if='category === "image"') Paste it next to your image, wherever it is able to be viewed or downloaded. It is not necessary to include it in the image itself.
p(v-else-if='category === "video"') Paste it next to your video, wherever it is able to be watched or downloaded. You may also like to put it at the end of your video if appropriate.
p(v-else-if='category === "software"') Paste it in the README for your software and link it to <strong>{{ license_url }}</strong> to encourage others to give without conditions too.
p(v-else) Paste it either inside your resource or next to any links to download it.


    h3 {{ start + 3 }}. Add the link to the badge
    p If the resource will ever be printed, also place the link address below the badge.

    p.links
        VPButton(:text='copy_link_text' @click='copy_link')
        a(:href='license_url' target='_blank') Link URL

</template>


<script lang='ts' setup>

import {ref, computed} from 'vue'

const category = ref('free' as 'free'|'conditions'|'software')
const condition_nc = ref(false)
const condition_sa = ref(false)
const condition_pde = ref(true)
const badge_lcc = ref(true)
const badge_subtle = ref(false)
const copy_badge_text = ref("Copy badge")
const copy_link_text = ref("Copy link")


const license_code = computed(() => {
    // Get the license code based on category and conditions options
    if (category.value === 'free'){
        return 'free'
    } else if (category.value === 'conditions'){
        let code = 'cc-by'
        if (condition_nc.value){
            code += '-nc'
        }
        if (condition_sa.value){
            code += '-sa'
        }
        return code
    } else {
        return condition_pde.value ? 'free-equiv' : 'open-source'
    }
})

const license_url = computed(() => {
    // Get the license URL for chosen options
    // WARN Public domain dedication is not prefixed with /licenses/
    const base = 'https://copy.church/'
    if (license_code.value === 'free'){
        return base + 'free/'
    }
    return base + `licenses/${license_code.value}/`
})

const license_desc = computed(() => {
    if (license_code.value === 'free'){
        return "Copyright waived"
    } else if (license_code.value.startsWith('cc-')){
        return `Licensed under CC ${license_code.value.slice(3).toUpperCase()}`
    }
    return license_code.value === 'open-source' ? "Open source" : "Public domain equivalent"
})

const start = computed(() => category.value === 'free' ? 0 : 1)

const badge_chosen = computed(() => {
    // The URL for the chosen badge, excluding the file extension
    const colors = badge_subtle.value ? 'subtle' : 'brand'
    const lcc = badge_lcc.value ? 'lcc' : 'alt'
    return `/badges/${colors}/${lcc}/${license_code.value}.`
})

const choose_brand_lcc = () => {
    badge_subtle.value = false
    badge_lcc.value = true
}

const choose_brand_alt = () => {
    badge_subtle.value = false
    badge_lcc.value = false
}

const choose_subtle_lcc = () => {
    badge_subtle.value = true
    badge_lcc.value = true
}

const choose_subtle_alt = () => {
    badge_subtle.value = true
    badge_lcc.value = false
}

const copy_badge = async () => {
    try {
        const blob = await (await fetch(`${badge_chosen.value}png`)).blob()
        await self.navigator.clipboard.write([new ClipboardItem({[blob.type]: blob})])
        copy_badge_text.value = "Copied, now paste it"
    } catch {
        copy_badge_text.value = "Unable to copy (use the URL)"
    }
    setTimeout(() => {
        copy_badge_text.value = "Copy badge"
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
        copy_link_text.value = "Copy link"
    }, 1000 * 3)
}

</script>


<style lang='sass' scoped>

p
    color: var(--vp-c-text-2)

.tabs
    display: flex
    color: hsla(0, 0%, 0%, 80%)
    font-weight: bold
    background-color: hsl(120, 50%, 75%)
    border-radius: 8px 8px 0 0
    @media (max-width: 600px)
        font-size: 0.8em

    div
        flex-grow: 1
        flex-basis: 0
        padding: 12px
        text-align: center
        cursor: pointer

        &:not(.active)
            background-color: hsla(0, 0%, 0%, 50%)

            &:hover
                background-color: hsla(0, 0%, 0%, 25%)

.container
    background-color: hsla(120, 25%, 50%, 10%)
    border-radius: 0 0 8px 8px
    padding: 20px
    @media (max-width: 600px)
        padding: 0
        background-color: transparent

.badges
    display: flex
    margin-top: 24px

    img
        max-width: 600px
        width: 100%
        margin-bottom: 24px
        border: 1px solid transparent
        border-radius: 14px
        padding: 4px
        cursor: pointer

        &.active
            border-color: var(--brand)

    > div:nth-child(1)
        margin-right: 12px
        @media (max-width: 600px)
            margin-right: 2px

    > div:nth-child(2)
        margin-left: 12px
        @media (max-width: 600px)
            margin-left: 2px

.links
    & > *
        margin-right: 24px
        margin-bottom: 12px
        display: inline-block


</style>
