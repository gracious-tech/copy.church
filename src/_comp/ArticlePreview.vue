
<template lang='pug'>

ResourcePreview(:url='url' :img='img' :title='title' :desc='desc')

</template>


<script lang='ts' setup>

import {computed} from 'vue'

import ResourcePreview from './ResourcePreview.vue'
import {articles} from './articles'


const props = defineProps({id: String})

const img = computed(() => `/_assets/articles/${props.id}.jpg`)
const url = computed(() => `/articles/${props.id}/`)
const title = computed(() => articles[props.id].title)
const desc = computed(() => articles[props.id].desc)

</script>


<style lang='sass' scoped>

</style>
