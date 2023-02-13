
<template lang='pug'>

blockquote
    p {{ text }}
    div.info
        a.passage(:href='read_url' target='_blank') {{ passage }}
        div.options
            div.option(v-for='option of Object.keys(options)' :class='{selected: option === TRANS}' @click='change_trans(option)')
                | {{ BIBLES[option].abbrev }}
        a.credit(:href='bible.license' target='_blank') {{ bible.credit }}

</template>


<script lang='ts' setup>

import {computed} from 'vue'
import {TRANS} from './state'
import {BIBLES} from './bibles'

const props = defineProps({passage: String, options: Object})

const bible = computed(() => BIBLES[TRANS.value])

const change_trans = trans => {
    TRANS.value = trans
}

const text = computed(() => props.options[TRANS.value])

const read_url = computed(() => {
    const p = encodeURIComponent(props.passage)
    return `https://www.biblegateway.com/passage/?search=${p}&version=${bible.value.abbrev}`
})

</script>


<style lang='sass' scoped>

.info
    display: flex
    flex-wrap: wrap
    align-items: center
    margin-top: 12px

    .passage
        font-weight: bold
        font-size: 0.8rem
        opacity: 0.6
        margin-right: 24px
        color: inherit
        line-height: 3

    .options
        display: flex
        align-items: center
        margin-right: 12px

        .option
            opacity: 0.6
            cursor: pointer
            line-height: 1
            padding: 8px
            background-color: hsla(0, 0%, 50%, 0.3)
            font-size: 0.8rem
            border-right: 1px solid hsla(0, 0%, 50%, 0.3)
            &.selected
                background-color: rgba(#f0df0f, 0.5)
            &:last-child
                border-right-style: none

    .credit
        font-size: 0.7rem
        color: inherit
        opacity: 0.6

</style>
