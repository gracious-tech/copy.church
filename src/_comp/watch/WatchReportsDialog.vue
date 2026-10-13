
<template lang='pug'>

dialog.reports_dialog(ref='dialog' @close='open = false' @click='close_on_backdrop')
    div.dialog_header
        h3 {{ title }}
        button.close(@click='open = false' title="Close") ✕
    div.dialog_body
        WatchCases(:entries='entries')
    div.dialog_footer(v-if='link')
        a(:href='link') View org page →

</template>


<script lang='ts' setup>

import {ref, watch, onMounted} from 'vue'

import WatchCases from './WatchCases.vue'
import type {ResponseLogEntry} from '@/_data/watch/types'


// A modal showing a list of reports, opened/closed via v-model
defineProps<{title:string, entries:ResponseLogEntry[], link?:string}>()
const open = defineModel<boolean>({default: false})

const dialog = ref<HTMLDialogElement>()

// Sync the native dialog with the model (it closes itself on Escape, which fires @close)
function sync(){
    if (!dialog.value)
        return
    if (open.value && !dialog.value.open)
        dialog.value.showModal()
    else if (!open.value && dialog.value.open)
        dialog.value.close()
}
watch(open, sync)
onMounted(sync)

// A click landing on the dialog element itself (not its contents) is on the backdrop
function close_on_backdrop(event:MouseEvent){
    if (event.target === dialog.value)
        open.value = false
}

</script>


<style lang='sass' scoped>

.reports_dialog
    width: min(640px, calc(100vw - 32px))
    max-height: calc(100vh - 64px)
    padding: 0
    border: 1px solid var(--vp-c-divider)
    border-radius: 10px
    background: var(--vp-c-bg)
    color: var(--vp-c-text-1)
    box-shadow: var(--vp-shadow-4)

    &[open]
        display: flex
        flex-direction: column

    &::backdrop
        background: rgba(0, 0, 0, 0.5)

    .dialog_header
        display: flex
        align-items: center
        justify-content: space-between
        gap: 10px
        padding: 12px 16px
        border-bottom: 1px solid var(--vp-c-divider)

        h3
            margin: 0
            font-size: 1.1em

        .close
            padding: 2px 8px
            border-radius: 5px
            color: var(--vp-c-text-2)
            cursor: pointer

            &:hover
                background: var(--vp-c-bg-alt)
                color: var(--vp-c-text-1)

    .dialog_body
        overflow-y: auto
        padding: 4px 16px

    .dialog_footer
        padding: 10px 16px
        border-top: 1px solid var(--vp-c-divider)
        font-size: 0.9em
        text-align: right

</style>
