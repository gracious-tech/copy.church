
<template lang="pug">

div.container
    h2#sign Sign declaration

    div
        strong Type
        .radio
            label
                input(type="radio" value="person" v-model="input.type")
                span Person
            label
                input(type="radio" value="org" v-model="input.type")
                span Organization
            label
                input(type="radio" value="unpub" v-model="input.type")
                span Unpublished

    template(v-if='input.type')

        p(v-if='input.type === "unpub"') You will be added to the total number of signers, without publishing your name.

        template(v-if='input.type !== "unpub"')
            label
                span {{ input.type === 'org' ? "Church / Organization" : "Full name" }}
                input(type="text" v-model="input.name" required)
            div(class='explain') This will appear publicly a day or so after submission.

        label
            span Email
            input(type="email" v-model="input.email" required)
        div(class='explain') Your email address will not be made public or used for marketing purposes. It is only collected to ensure signings are genuine and unique.

        label(v-if='input.type !== "unpub"')
            span Country (optional)
            select(v-model="input.country")
                option(value='') -
                option(v-for='country of countries_list' :value='country.code') {{ country.long }}

        label(v-if="input.type === 'person'")
            span Position (optional)
            input(type="text" v-model="input.position" placeholder="Pastor of..., Director of..., etc.")

        div.sign
            VPButton(@click='submit' :text='progress ? "Signing..." : "Sign"' size='big' :class='{progress}')

    div.error(v-if='error_msg') {{ error_msg }}
    div.success(v-if="success && !error_msg") Thanks for signing

</template>


<script lang="ts" setup>

import {ref} from 'vue'

import {countries_list} from './countries'

import {save_signing, type SigningInput} from './backend'


const props = defineProps<{petition:string}>()


const input = ref<SigningInput>(get_empty_input())
const error_msg = ref('')
const success = ref(false)
const progress = ref(false)


function get_empty_input(){
    return {
        type: '' as 'person',  // Empty initially so user can choose
        email: '',
        name: '',
        country: '',
        position: '',
    }
}


const submit = async () => {
    progress.value = true
    await submit_inner()
    progress.value = false
}


const submit_inner = async () => {

    // Reset state
    error_msg.value = ''
    success.value = false

    // Validate data
    if (! /^[^\s@]+@[^\s@]+$/.test(input.value.email)){
        error_msg.value = "Invalid email address"
        return
    }
    if (input.value.type !== 'unpub' && !input.value.name.trim()){
        error_msg.value = "Name is required"
        return
    }

    // Submit
    try {
        // Submit
        const error = await save_signing(props.petition, input.value)
        if (error){
            error_msg.value = error
            return
        }
    } catch (error){
        error_msg.value = "Something went wrong. Please try again or send us a message at gracious.tech/contact"
        return
    }

    // Reset form and show success
    input.value = get_empty_input()
    success.value = true
}

</script>


<style lang="sass" scoped>

@media (max-width: 500px)
    .container
        padding: 24px 12px !important
    .radio
        flex-direction: column !important
        gap: 8px !important

.container
    background-color: var(--vp-c-bg-alt)
    max-width: 500px
    margin: 48px auto
    padding: 36px
    border-radius: 18px
    box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.2)

    > label
        margin-top: 24px

h2
    text-align: center
    margin-top: 0
    border-style: none
    padding-top: 0
    margin-bottom: 24px

label
    display: block
    > span
        display: block
        font-weight: bold

input[type="text"], input[type="email"], select
    width: 100%
    padding: 6px
    margin: 4px 0
    font-size: 16px
    background-color: #ddb
    color: black
    border-radius: 8px

    &:focus
        background-color: #dd9

    &::placeholder
        color: #0006

.radio
    display: flex
    gap: 24px
    margin-top: 12px

    label
        display: flex
        align-items: center
        gap: 0.5rem

.explain
    font-size: 14px

.sign
    text-align: center
    margin-top: 36px

.error, .success
    padding: 12px 24px
    border-radius: 12px
    margin-top: 24px

.error
    background-color: #f003

.success
    background-color: #0f03

.progress
    background-color: black !important
    animation: progress 2s linear
    animation-iteration-count: infinite
    pointer-events: none
    user-select: none

@keyframes progress
    0%
        opacity: 0.1
    50%
        opacity: 0.6
    100%
        opacity: 0.1

</style>
