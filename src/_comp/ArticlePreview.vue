
<template lang='pug'>

a(:href='`/articles/${id}/`')
    img(:src='`/_assets/articles/${id}.jpg`')
    div
        h3 {{ title }}
        p {{ desc }}

</template>


<script lang='ts' setup>

import {computed} from 'vue'


// NOTE While these might duplicate article meta data, they can also be different if desired
const articles = {
    'command-many-overlook': {
        title: "The freely giving ethic",
        desc: "How Jesus' command to freely give works with Paul's teaching on financial support.",
    },
    'biblical-funding': {
        title: "Biblical funding of ministry",
        desc: "The spiritual dimension to funding ministry and how it differs to commercial models.",
    },
    'commerce-condemned': {
        title: "Condemnation of commercial ministry",
        desc: "There are many passages that directly condemn commercializing ministry.",
    },
}


const props = defineProps({id: String})

const title = computed(() => articles[props.id].title)
const desc = computed(() => articles[props.id].desc)

</script>


<style lang='sass' scoped>

a
    display: flex
    flex-direction: column
    background-color: hsla(0deg, 0%, 50%, 0.15)
    border-radius: 12px
    margin: 24px 0
    overflow: hidden
    color: inherit !important

    img
        width: 100%

    div
        padding: 16px

    h3
        margin: 0
        margin-bottom: 0.5em

    p
        font-size: 0.9em
        margin: 0

    @media (min-width: 600px)
        // Wide formatting that displays image to left of text
        flex-direction: row

        img
            width: 250px

</style>
