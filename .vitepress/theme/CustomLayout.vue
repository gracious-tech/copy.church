
<template lang='pug'>

Layout(:class='page_id')

</template>


<script lang='ts' setup>

import DefaultTheme from 'vitepress/theme'
import {computed} from 'vue'
import {useRoute} from 'vitepress'


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
</style>
