
<template lang='pug'>

h1 Copy for the kingdom
p Resources {{ type_past }} and linked here have been generously shared for the furthering of God's kingdom. This is an easy to understand description of the following {{ type }} that applies to them:

h3 {{ license.creator }} {{ license.name }} {{ type }}

template(v-if='code === "uw-ft"')
    p
        strong(class='mixed') You can only translate this resource, the original cannot be shared
template(v-else-if='code.startsWith("cc-")')
    p
        strong(class='good') You can use and share the resource,&nbsp;
        span(v-if='code === "cc-0"') without restriction
        span(v-else) however:

    ul
        li(v-if='code.includes("by")') #[strong(class='mixed') Attribution] &mdash; You must credit the author, link to this license, and indicate if changes were made
        li(v-if='code.includes("nc")') #[strong(class='mixed') NonCommercial] &mdash; You cannot use the resource for commercial purposes
        li(v-if='code.includes("sa")') #[strong(class='mixed') ShareAlike] &mdash; You must use this license when sharing any changes

VPButton(:href='license.url' :text='`View actual ${type}`' theme='alt')

p &nbsp;

div(class='warning custom-block')
    h3(style='margin-top: 0') How to use this {{ type }} for a new resource
    ol
        li(v-if='code === "cc-0"')
            strong Add text declaring the resource as being public domain
            br
            | Dedicated to the public domain
            br
            | &nbsp;
        li(v-else)
            strong Add text identifying the author and {{ type }}
            br
            | &copy; {{ current_year }} <em>author's name</em>, licensed under {{ license.abbrev }}
            br
            | &nbsp;
        li
            strong Add a link to the {{ type }}
            br
            | {{ current_url }}
    p If your resource will be printed, put the URL below the text instead of linking to it.<br>If your resource is audio/visual, the text can be next to it on a webpage or somewhere else easy to find.


div(class='custom-block')
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
const current_url = `https://copy.church${route.path}`
const current_year = new Date().getFullYear()

</script>


<style lang='sass' scoped>

ul, ol
    margin-bottom: 12px !important
    li
        margin: 0 !important

</style>
