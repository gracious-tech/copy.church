
<template lang="pug">

teleport(to='body')
    div.popup(:class='{fade: popup_fade}') {{ popup_msg }}
    div.bg
        div(v-for='signer of public_signers') {{ signer.name }}

div.list(:class='{truncate}')
    //- NOTE Condition is so VitePress outline doesn't show incomplete number in heading
    h2#signers List of signers {{ total ? `(${total})` : "" }}
    p Since initial signing in Sunnyvale, California, USA, on 8 October 2025.
    div.grid
        div(v-for='signer of public_signers')
            div.name
                img(v-if='signer.type === "org"' src='@/_assets/icons/group.svg')
                | {{ signer.name }}
            div.subtitle {{ signer.subtitle }}
    div.unpub + {{ total_unpub }} unpublished names

div.show
    VPButton(@click='truncate = !truncate' :text='truncate ? "Show all" : "Show less"' theme='alt')

</template>


<script lang="ts" setup>

import {reactive, computed, ref, onMounted} from 'vue'

import {countries} from './countries'

import {listen_for_signers, type SigningOutput} from './backend'


const props = defineProps<{petition:string}>()

const signers = reactive<SigningOutput[]>([])
const popup_msg = ref('')
const popup_fade = ref(false)
const popup_enabled = ref(false)
const truncate = ref(true)

const total = computed(() => signers.length)
const total_unpub = computed(() => signers.length - public_signers.value.length)


// Get data needed to display signers that should be public
const public_signers = computed(() => {
    const results = signers
        .filter(signer => signer.type !== 'unpub' && signer.reviewed)
        .map(signer => {
            let subtitle = signer.position
            if (signer.position && signer.country){
                subtitle += ', '
            }
            subtitle += countries[signer.country]?.short
            return {type: signer.type, name: signer.name, subtitle}
        })
    if (truncate.value){
        // Will probably need at least 300 to display in bg on edges of page
        // But still at least improves performance if numbers ever get to thousands+
        // NOTE This slice is purely for performance as div has max height anyway
        return results.slice(0, 500)
    }
    return results
})


onMounted(() => {

    // Don't enable popup until initial signers likely already loaded
    setTimeout(() => {
        popup_enabled.value = true
    }, 4000)

    listen_for_signers(props.petition, data => {

        // Add new item to list
        signers.push(data)

        // Utils for sorting
        const type_to_num = (type:string) => type === 'org' ? 1 : 0
        const empty_to_num = (val:string) => val ? 1 : 0

        // Sort by: date -> has position -> is org -> hardcoded sort
        signers.sort((a, b) => b.date.seconds - a.date.seconds)
        signers.sort((a, b) => empty_to_num(b.position) - empty_to_num(a.position))
        signers.sort((a, b) => type_to_num(b.type) - type_to_num(a.type))
        signers.sort((a, b) => b.sort - a.sort)

        // Add popup msg
        if (popup_enabled.value){
            let msg = "Someone just signed"
            if (data.country){
            msg += ` from ${countries[data.country]?.short}`
            }
            popup_msg.value = msg
            popup_fade.value = true
            setTimeout(() => {
                popup_fade.value = false
            }, 4500)  // animation needs 4 seconds to complete
        }
    })
})


</script>


<style lang="sass" scoped>

@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap')

.popup
    z-index: 1000
    position: fixed
    top: 0
    right: 0
    padding: 4px 8px
    margin: 6px
    border-radius: 8px
    text-align: center
    font-weight: bold
    font-size: 13px
    background-image: -webkit-linear-gradient(300deg, #df09, #ff09, #fd09)
    border: 1px solid #cc03
    color: #000c
    opacity: 0
    white-space: nowrap
    overflow: hidden
    max-width: min(95vw, 400px)
    text-overflow: ellipsis
    pointer-events: none
    user-select: none
    @media (min-width: 1400px)
        right: 48px
        top: 48px
        font-size: 15px
        white-space: normal

.bg
    z-index: -1
    position: absolute
    font-family: "Caveat", cursive
    font-size: 30px
    font-weight: bold
    line-height: 2
    padding: 12px
    display: grid
    grid-template-columns: 300px 300px
    justify-content: space-between
    left: 0
    right: 0
    top: 0
    opacity: 0.2
    color: #660
    white-space: nowrap

    // Don't show bg when no space
    @media (max-width: 1250px)
        display: none

    // Reduce width of names if limited space
    @media (max-width: 1500px)
        grid-template-columns: 200px 200px

    // Clip names if needed
    > div
        overflow: hidden
        text-overflow: ellipsis

    > div:nth-child(even)
        text-align: right

.list
    &.truncate
        max-height: 100vh
        overflow: hidden
        mask-image: linear-gradient(to bottom, black 80%, transparent 100%)

.grid
    margin-top: 24px
    display: grid
    gap: 24px
    grid-template-columns: 1fr 1fr 1fr
    line-height: 1.3
    @media (max-width: 800px)
        grid-template-columns: 1fr 1fr

    .name
        display: flex
        gap: 6px
        font-family: "Caveat", cursive
        font-weight: bold
        font-size: 20px

        img
            opacity: 0.8

    .subtitle
        font-size: 12px


.unpub
    font-weight: bold
    margin: 24px 0

.show
    text-align: center


.fade
    animation: fade_in_out 4s ease

@keyframes fade_in_out
    0%
        opacity: 0
    20%
        opacity: 1
    80%
        opacity: 1
    100%
        opacity: 0


</style>
