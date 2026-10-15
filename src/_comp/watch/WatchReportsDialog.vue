
<template lang='pug'>

WatchDialog(v-model='open' :title='title')
    WatchCases(:entries='entries')
    template(v-if='link' #footer)
        a(:href='link') View org page →

</template>


<script lang='ts' setup>

import WatchDialog from './WatchDialog.vue'
import WatchCases from './WatchCases.vue'
import type {ResponseLogEntry} from '@/_data/watch/types'


// A modal showing a list of reports, opened/closed via v-model
defineProps<{title:string, entries:ResponseLogEntry[], link?:string}>()
const open = defineModel<boolean>({default: false})

</script>
