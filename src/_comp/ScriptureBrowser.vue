
<template lang='pug'>

div.config
    div.radio
        input(v-model='order' type='radio' id='order_book' value='book')
        label(for='order_book') Order by book
    div.radio
        input(v-model='order' type='radio' id='order_topic' value='topic')
        label(for='order_topic') Order by topic

div.config
    div.radio(v-for='bible of translation_options')
        input(v-model='primary_bible' type='radio' :id='`primary_${bible}`' :value='bible')
        label(:for='`primary_${bible}`') {{ bible.toUpperCase() }}
    div.credit {{ primary_credit }}

div.config
    div
        small Compare with:
    div.radio(v-for='bible of translation_options')
        input(v-model='secondary_bible' type='radio' :id='`secondary_${bible}`' :value='bible')
        label(:for='`secondary_${bible}`') {{ bible.toUpperCase() }}
    div.radio
        input(v-model='secondary_bible' type='radio' id='secondary_null' :value='null')
        label(for='secondary_null') None
    div.credit(v-if='secondary_bible') {{ secondary_credit }}

div(v-for='[topic, passages] of groups' :key='topic')
    h2 {{ topic }}
    template(v-for='passage of passages' :key='passage' :passage='passage')
        h4
            a(:href='chapter_url(passage)' target='_blank' title="Read chapter") {{ passage }}
        div.row
            div.primary {{ scripture[passage][primary_bible] }}
            div.secondary(v-if='secondary_bible') {{ scripture[passage][secondary_bible] }}

</template>


<script lang='ts' setup>

import {computed, ref} from 'vue'
import {scripture, translation_options, scripture_by_topic} from './scripture'
import {BIBLES} from './bibles'

const order = ref('book' as 'book'|'topic')
const primary_bible = ref(translation_options[0])
const secondary_bible = ref(null as null|string)


const groups = computed(() => {
    // Get groups of passages as a list in form [[topic, [passage, passage]], ...]
    if (order.value === 'topic'){
        return Object.entries(scripture_by_topic)
    }

    // Reorganise passages by book (only including those already in scripture_by_topic)
    const included = Object.values(scripture_by_topic).flat()
    const by_book:[string, string[]][] = []
    for (const passage of Object.keys(scripture)){
        if (!included.includes(passage)){
            continue  // Some passages may not be directly relevant
        }
        const book = /^([\d] )?[\w]+/.exec(passage)[0]
        if (book !== by_book.at(-1)?.[0]){
            by_book.push([book, [passage]])
        } else {
            by_book.at(-1)[1].push(passage)
        }
    }
    return by_book
})

const primary_credit = computed(() => {
    return BIBLES[primary_bible.value].credit
})

const secondary_credit = computed(() => {
    return BIBLES[secondary_bible.value]?.credit
})

const chapter_url = (passage:string) => {
    const chapter = encodeURIComponent(passage.split(':')[0])
    if (primary_bible.value === 'bsb'){
        // BSB is not on Bible Gateway
        return `https://biblemenus.com/searchbsb.php?q=${chapter}`
    }
    const version = primary_bible.value.toUpperCase()
    return `https://www.biblegateway.com/passage/?search=${chapter}&version=${version}`
}

</script>


<style lang='sass' scoped>

.config
    margin: 16px 0

.radio
    display: inline-block

.credit
    opacity: 0.5
    font-size: 0.8em

h2
    opacity: 0.6

.row
    display: flex
    margin-top: 4px
    margin-bottom: 16px

    > *
        flex-basis: 100%

    .secondary
        margin-left: 24px

    @media (max-width: 600px)
        flex-direction: column
        .secondary
            margin-left: 0
            border-top: 1px solid hsl(0, 0%, 50%, 0.2)
            margin-top: 12px
            padding-top: 8px

</style>
