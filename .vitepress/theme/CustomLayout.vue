
<template lang='pug'>

Layout(:class='page_id')
    template(#nav-bar-content-before)
        SearchPalette
    template(#nav-bar-content-after)
        ClientOnly
            TranslateButton.translate-nav(title="Language (AI)")
            CountDown
    template(#nav-screen-content-after)
        ClientOnly
            TranslateButton.translate-menu
    template(#doc-bottom)
        div.pd
            | All original content is freely given and <a href='/free/'>dedicated to the public domain</a>.
            br
            | <a href='/ianal/'>We do not give legal advice.</a>

</template>


<script lang='ts' setup>

import DefaultTheme from 'vitepress/theme'
import {computed} from 'vue'
import {useRoute} from 'vitepress'

import SearchPalette from './SearchPalette.vue'
import TranslateButton from '../../src/_comp/TranslateButton.vue'
import CountDown from '../../src/_comp/CountDown.vue'


const {Layout} = DefaultTheme
const route = useRoute()

const page_id = computed(() => {
    // Place a custom page id on layout element so can customise whole page per route
    let id = 'route' + route.path.replace(/\//g, '_')
    if (id.endsWith('_index')){
        // For some reason the path includes 'index' in production (e.g. '/index')
        id = id.slice(0, 'index'.length*-1)  // WARN Don't remove the '_'
    }
    return id
})

</script>


<style lang='sass' scoped>

.pd
    text-align: center
    font-size: 12px
    opacity: 0.5
    padding-top: 200px
    padding-bottom: 100px

    a
        text-decoration: underline

.translate-nav
    margin-left: 16px
    @media (max-width: 767px)
        display: none
    // Just the icon until there's room for the label beside the nav links
    // NOTE Only before translation is activated, as the widget it's replaced by is Elfsight's
    @media (max-width: 1099px)
        &.inactive
            margin-left: 8px
            min-width: 0
            padding: 8px
            font-size: 0  // Hides the label (a text node) but not the icon, which has its own size

.translate-menu
    margin: 12px auto

</style>
