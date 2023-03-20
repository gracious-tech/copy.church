
<template lang='pug'>

h1 {{ type === 'dedication' ? "Freely given" : "Copy for the kingdom" }}
p Resources {{ type_past }} and linked here have been shared for the furthering of God's kingdom. This is an easy to understand description of the following {{ type }} that applies to them:

h3 {{ license.creator }} {{ license.name }} {{ type }}

p You can:

ul
    li #[strong(class='good') Copy] &mdash; Share and distribute the resource
    li #[strong(class='good') Modify] &mdash; Improve or adapt the resource to a new context
    li #[strong(class='good') Translate] &mdash; Make the resource available in a new language

p(v-if='code !== "cc-0"') Under the following conditions:

ul
    li(v-if='code.includes("by")') #[strong(class='mixed') Attribution] &mdash; You must credit the author, link to this license, and indicate if changes were made
    li(v-if='code.includes("nc")') #[strong(class='mixed') NonCommercial] &mdash; You cannot use the resource for commercial purposes
    li(v-if='code.includes("sa")') #[strong(class='mixed') ShareAlike] &mdash; You must use this license when sharing any changes

p &nbsp;

VPButton(:href='license.url' :text='`View actual ${type}`' theme='alt')

p &nbsp;

div(class='custom-block disclaimer')
    p We (copy.church) are not a law firm and do not provide legal services or legal advice. Distribution of licenses does not create a lawyer-client or other relationship. We make licenses and related information available on an “as-is” basis. We give no warranties regarding licenses, any material licensed under their terms and conditions, or any related information. We disclaim all liability for damages resulting from their use to the fullest extent possible.



</template>


<script lang='ts' setup>

import {useRoute} from 'vitepress'

import {LICENSES} from './licenses'


const route = useRoute()
const type = route.path.split('/')[1] === 'free' ? "dedication" : "license"
const type_past = type === 'dedication' ? "dedicated" : "licensed"
const code = type === 'dedication' ? 'cc-0' : route.path.split('/')[2]
const license = LICENSES[code]

</script>


<style lang='sass' scoped>

ul, ol
    margin-bottom: 12px !important
    li
        margin: 0 !important

.custom-block
    p, li
        font-size: inherit

    &.disclaimer
        font-size: 0.8em

</style>
