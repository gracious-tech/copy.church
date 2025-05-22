
<template lang='pug'>

Layout(:class='page_id')
    template(#nav-bar-content-after)
        TranslateButton.translate-nav
    template(#nav-screen-content-after)
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

import TranslateButton from '../../src/_comp/TranslateButton.vue'


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

.translate-menu
    margin: 12px auto

</style>
