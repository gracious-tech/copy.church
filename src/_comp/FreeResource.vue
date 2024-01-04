
<template lang='pug'>

div.tabs
    div(:class='{active: category === "free"}' @click='category = "free"') Completely free
    div(:class='{active: category === "conditions"}' @click='category = "conditions"') Share with conditions
    div(:class='{active: category === "software"}' @click='category = "software"') Software

div.container

    template(v-if='category === "free"')
        p To truly "give freely" you must give up all rights to your resource by dedicating it to the public domain.

    template(v-if='category === "conditions"')
        p #[strong(class='mixed') We highly recommend not applying any legal conditions] to the use of your resource as it would no longer #[a(href='/objections/public-domain/') truly be "freely given"]. The following are however available:
        h3 1. Choose your conditions
        p ShareAlike ensures improvements are also copyable and cannot be restricted.
        p
            input(type='checkbox' id='condition_by' checked disabled)
            label(for='condition_by') Attribution
            input(v-model='condition_nc' type='checkbox' id='condition_nc')
            label(for='condition_nc') NonCommercial
            input(v-model='condition_sa' type='checkbox' id='condition_sa')
            label(for='condition_sa') ShareAlike

    template(v-if='category === "software"')
        p It is best to use a software license for software, due to #[a(href='https://en.wikipedia.org/wiki/Unlicense#Reception' target='_blank') issues with legal compatibility]. We recommend using the #[a(href='https://choosealicense.com/licenses/mit-0/' target='_blank') MIT No Attribution] or #[a(href='https://choosealicense.com/licenses/0bsd/' target='_blank') BSD Zero Clause], which essentially operate the same as a public domain dedication without the legal issues.
        p Choose and apply your own license, as we don't host them ourselves. As long as it is an open source license you can use a badge below in your About page or README.
        h3 1. Is your software license free of conditions?
        p
            input(v-model='condition_pde' type='checkbox' id='condition_pde')
            label(for='condition_pde') License has no conditions (not even attribution)


    h3 {{ start + 1 }}. Choose your preferred badge

    div.badges
        div
            img(:src='`/badges/brand/lcc/${license_code}.svg`' width='300' height='60'
                :class='{active: !badge_subtle && badge_lcc}' @click='choose_brand_lcc')
            img(:src='`/badges/brand/alt/${license_code}.svg`' width='300' height='60'
                :class='{active: !badge_subtle && !badge_lcc}' @click='choose_brand_alt')
        div
            img(:src='`/badges/subtle/lcc/${license_code}.svg`' width='300' height='60'
                :class='{active: badge_subtle && badge_lcc}' @click='choose_subtle_lcc')
            img(:src='`/badges/subtle/alt/${license_code}.svg`' width='300' height='60'
                :class='{active: badge_subtle && !badge_lcc}' @click='choose_subtle_alt')


    h3 {{ start + 2 }}. Add the badge to your resource
    p The badge could go inside your resource (for books etc) or next to your resource (for music/images/etc), or if it can't be added you can just write "{{ license_desc }}".

    p.links
        VPButton(:text='copy_badge_text' @click='copy_badge')
        a(:href='badge_chosen + "png"' target='_blank') URL for PNG
        a(:href='badge_chosen + "svg"' target='_blank') URL for SVG


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
        return "Dedicated to the public domain"
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
