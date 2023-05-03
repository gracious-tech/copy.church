
<template lang='pug'>

blockquote
    p.text {{ text }}
    div.info
        a.passage(:href='read_url' target='_blank') {{ passage }}
        div.options
            div.option(v-if='custom' :class='{selected: active === "custom"}' @click='change_trans("custom")')
                | Own
            div.option(v-for='option of options' :key='option' :class='{selected: option === active}'
                    @click='change_trans(option)')
                | {{ BIBLES[option].abbrev }}
        a.credit(v-if='active !== "custom"' :href='bible.license' target='_blank') {{ bible.credit }}

</template>


<script lang='ts' setup>

import {computed, ref} from 'vue'
import {TRANS} from './state'
import {BIBLES} from './bibles'
import {scripture} from './scripture'


const props = defineProps({passage: String, custom: String})

const options = ['bsb', 'net', 'esv', 'niv', 'csb']

// Always start showing custom if available
const active = ref(props.custom ? 'custom' : TRANS.value)

// Use TRANS instead of active so read_url is always valid
const bible = computed(() => BIBLES[TRANS.value])

// Always change active, but only change TRANS if not custom
const change_trans = trans => {
    active.value = trans
    if (trans !== 'custom'){
        TRANS.value = trans
    }
}

const text = computed(() => {
    if (active.value === 'custom'){
        return props.custom.trim()  // Using pre-line so avoid any whitespace at start/end
    }
    return scripture[props.passage][TRANS.value]
})

const read_url = computed(() => {
    if (bible.value.id === 'bsb'){
        // BSB is not on Bible Gateway, and Bible Hub doesn't support verse ranges...
        const chapter = props.passage.split(':')[0]
        return `https://biblemenus.com/searchbsb.php?q=${encodeURIComponent(chapter)}`
    }
    const p = encodeURIComponent(props.passage)
    return `https://www.biblegateway.com/passage/?search=${p}&version=${bible.value.abbrev}`
})

</script>


<style lang='sass' scoped>

.text
    white-space: pre-line

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
        user-select: none

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
