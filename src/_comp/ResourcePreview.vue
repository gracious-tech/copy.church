
<template lang='pug'>

a(:href='url' :target='target')
    img(:src='img')
    div
        h3 {{ title }}
        p {{ desc }}

</template>


<script lang='ts' setup>

import {computed} from 'vue'


const props = defineProps({
    title: String,
    desc: String,
    url: String,
    img: String,
})

const target = computed(() => {
    return props.url.startsWith('http') ? '_blank' : ''
})


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
