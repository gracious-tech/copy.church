
<template lang='pug'>

WatchDialog(v-model='open' :title='`What does "${info.label}" mean?`')
    div.tier(:class='tier')
        p.summary {{ info.summary }}
        template(v-for='section of info.sections' :key='section.heading')
            p.heading {{ section.heading }}
            ul
                li(v-for='example of section.examples' :key='example') {{ example }}
        p.licenses Licenses: {{ info.licenses }}

</template>


<script lang='ts' setup>

import {computed} from 'vue'

import WatchDialog from './WatchDialog.vue'
import type {LicenseTier} from './watch_utils'


// A plain-language summary of what one license tier means in practice, opened/closed via v-model
const props = defineProps<{tier:LicenseTier}>()
const open = defineModel<boolean>({default: false})

// Each tier's one-line summary, with real-life examples of what it blocks
type TierInfo = {
    label:string,
    summary:string,
    sections:{heading:string, examples:string[]}[],
    licenses:string,
}
const tiers:Record<LicenseTier, TierInfo> = {
    open: {
        label: "Open",
        summary: "Free for anyone to use however they like, such as printing, selling, recording,"
            + " translating or improving it. At most you may need to credit the publisher, or share your"
            + " changes freely too.",
        sections: [],
        licenses: "Public domain, CC BY, CC BY-SA",
    },
    semi_restricted: {
        label: "Semi-restricted",
        summary: "Free to share, but with a catch. Depending on the version, one or both of these"
            + " apply:",
        sections: [
            {
                heading: "Non-commercial - you can't:",
                examples: [
                    "Sell printed Bibles, even if just enough to cover the printing and shipping",
                    "Sell discipleship books that include substantial portions of the translation",
                ],
            },
            {
                heading: "No derivatives - you can't:",
                examples: [
                    "Make an easy-to-read or children's edition",
                    "Update the spelling when the language's writing system changes",
                    "Translate it into a nearby language that doesn't have the Bible yet",
                    "Let local believers fix mistakes and improve the wording themselves, rather"
                        + " than relying on a foreign mission org",
                ],
            },
        ],
        licenses: "CC BY-NC, CC BY-ND, CC BY-NC-SA, CC BY-NC-ND, and some custom licenses that"
            + " don't limit quoting",
    },
    restricted: {
        label: "Restricted",
        summary: "You can only quote it in a way similar to any other commercial book (such as"
            + " Harry Potter). Most do allow quoting a set number of verses, but this doesn't go"
            + " far beyond what fair use already allows for any commercial book.",
        sections: [
            {
                heading: "You can't:",
                examples: [
                    "Print the Gospel of Mark to hand out at an evangelistic outreach",
                    "Load the whole Bible onto phones or memory cards to pass around villages",
                    "Include it in a new Bible app for the language community",
                    "Record an audio version for people who can't read",
                    "Let local believers improve the translation themselves",
                    "Translate it into a nearby language that doesn't have the Bible yet",
                ],
            },
        ],
        licenses: "All rights reserved, or standard Bible licenses allowing limited quotation",
    },
}
const info = computed(() => tiers[props.tier])

</script>


<style lang='sass' scoped>

.tier
    margin: 12px 0
    font-size: 0.9em
    line-height: 1.5

    p, ul
        margin: 0

    ul
        padding-left: 36px

    .heading
        margin-top: 12px
        font-weight: 600
        color: var(--vp-c-red-1)

    // The licenses in this tier, for those who know them
    .licenses
        margin-top: 24px
        font-size: 0.9em
        opacity: 0.6

</style>
