
<template lang='pug'>

h3 1. Do you expect payment/donation?

select(v-model='choice_payment')
    option(value='')
    option(value='free') No
    option(value='paywall-profit') Yes
    option(value='paywall') Yes, but all profits go back into ministry

h3 2. Are you using a public license?

//- WARN Always have different ids (even if same conditions) so URL remembers choice correctly
select(v-model='choice_license')
    option(value='')
    option(value='by-nc-nd-private') No
    option(value='public') Public Domain
    option(value='by') Attribution
    option(value='by-sa') Attribution-ShareAlike
    option(value='by-nd') Attribution-NoDerivatives
    option(value='by-nc') Attribution-NonCommercial
    option(value='by-nc-sa') Attribution-NonCommercial-ShareAlike
    option(value='by-nc-nd') Attribution-NonCommercial-NoDerivatives
    option(value='by-nc-nd-private-translate') Free Translate
    option(value='by-os') Open source software
    option(value='by-nc-nd-private-custom') Custom conditions and limits

p.note A public license gives everyone permission to use your resource (often with conditions)



h3(v-if='choice_payment && choice_license' :class='score_class') You scored {{ score }} out of 8


table(v-if='choice_payment && choice_license')

    tr
        th
            | Free of cost
            div(v-html='b(checks.free)')
            img(src='@/_assets/restrictions/ill_free.svg')
        td
            p This resource #[span(v-html='can(checks.free)')] be obtained for free.
            ul
                li Jesus explicitly commanded his disciples to "freely give" in the context of ministry (Matt 10:8)
                li Selling ministry treats people as customers rather than partners in ministry
                li Scripture permits receiving financial support for ministry, but not selling it
                li Selling ministry communicates that you are self-employed rather than serving God, who would expect his servants to freely share resources amongst each other

    tr
        th
            | Non-profit
            div(v-html='b(checks.non_profit)')
            img(src='@/_assets/restrictions/ill_commercial.svg')
        td
            p Profits #[span(v-html='do_(checks.non_profit)')] get invested back into ministry (whether payment or donations).
            ul
                li Using ministry for profit is condemned in scripture (2 Cor 2:17, Luke 16:13)
                li Even if not much money is made, having no limit on what can be earned is opening oneself up to profit from ministry

    tr
        th
            | Distributable
            div(v-html='b(checks.distribute)')
            img(src='@/_assets/restrictions/ill_distribute.svg')
        td
            p This resource #[span(v-html='can(checks.distribute)')] can be copied and shared.
            ul
                li Freely sharing a resource allows it to reach far more people than it would if it were limited to paying customers only
                li Forcing people to download a resource from a specific site severly limits how the resource can be used, such as embedding it within another resource or app

    tr
        th
            | Modifiable
            div(v-html='b(checks.modify)')
            img(src='@/_assets/restrictions/ill_derivatives.svg')
        td
            p This resource #[span(v-html='can(checks.modify)')] be improved and adapted to different ministry contexts.
            ul
                li God's people should have the humility to assume someone may improve their resource in ways they hadn't thought of
                li It is helpful to be able to adapt resources to different ministry contexts, such as different demographics, levels of education, etc
                li Being able to adapt existing resources is far more effecient than requiring everyone to make their own

    tr
        th
            | Translatable
            div(v-html='b(checks.translate)')
            img(src='@/_assets/restrictions/ill_translate.svg')
        td
            p This resource #[span(v-html='can(checks.translate)')] be translated by anyone.
            ul
                li There are plentiful ministry resources in English but barely anything in most other languages
                li Most people will look for resources that can be freely translated than bother asking permission from resources that don't specify the permission
                li There are around 7000 languages in the world and managing the translations of even 100 of them would be too much for most organisations to oversee

    tr
        th
            | Useable without attribution
            div(v-html='b(checks.not_attribute)')
            img(src='@/_assets/restrictions/ill_attribution.svg')
        td
            p This resource #[span(v-html='can(checks.not_attribute)')] be used without attributing the owner.
            ul
                li Attribution is not appropriate in some circumstances, such as in graphic designs or brief quotes
                li The attribution required by many public licenses is overly verbose
                li Attribution of people can in some circumstances distract from giving glory to God (such as in Bible translations and worship music)

    tr
        th
            | Free of copyright
            div(v-html='b(checks.no_copyright)')
            img(src='@/_assets/restrictions/ill_open.svg')
        td
            p This resource #[span(v-html='has(checks.no_copyright)')] been freed from copyright.
            ul
                li Copyright is not necessarily a biblical concept and only went into law in 1710
                li Copyright can only be enforced in secular courts, and resolving disputes in secular courts is condemned by Paul (1 Cor 6)
                li Copyright unnecessarily makes many well-intentioned believers lawbreakers for sharing ministry resources

    tr
        th
            | Permission not needed
            div(v-html='b(checks.no_asking)')
            img(src='@/_assets/restrictions/ill_permission.svg')
        td
            p This resource #[span(v-html='can(checks.no_asking)')] be freely used without asking permission.
            ul
                li Requiring permission puts up a barrier to ministry
                li Most organisations do not end up promptly replying to permission requests
                li Most users of resources do not know how to ask permission
                li Requiring permission raises uncertainty as to what uses will be allowed


</template>


<script lang='ts' setup>

import {computed, ref, onBeforeMount, watch} from 'vue'


// Choices
const choice_payment = ref('')
const choice_license = ref('')


// Utils for rendering good/bad text
const b = bool => bool === true ? '<span class=good>✓</span>' : `<span class=bad>✕</span>`
const can = v => v === true ? `<strong class=good>can</strong>` : `<strong class=bad>can&apos;t</strong>`
const has = v => v === true ? `<strong class=good>has</strong>` : `<strong class=bad>hasn&apos;t</strong>`
const do_ = v => v === true ? `<strong class=good>do</strong>` : `<strong class=bad>don&apos;t</strong>`


// Calculate points
const checks = computed(() => {

    // Get an array for all conditions
    const conditions = [...choice_payment.value.split('-'), ...choice_license.value.split('-')]

    // Work out what points are affected by the conditions
    return {
        free: !conditions.includes('paywall'),
        non_profit: !conditions.includes('profit'),
        distribute: !conditions.includes('private'),
        modify: !conditions.includes('nd'),
        translate: !conditions.includes('nd') || conditions.includes('translate'),
        not_attribute: !conditions.includes('by'),
        no_copyright: !conditions.includes('by'),
        no_asking: !conditions.includes('nc') && !conditions.includes('nd'),
    }
})


// Calculate score as a number
const score = computed(() => {
    return Object.values(checks.value).filter(c => c).length
})


// Work out appropriate color for the score
const score_class = computed(() => {
    return score.value >= 6 ? 'good' : (score.value >= 3 ? 'mixed' : 'bad')
})


// Init choices based on URL hash params
onBeforeMount(() => {
    const params = new URLSearchParams(self.location.hash.slice(1))
    if (params.has('p')){
        choice_payment.value = params.get('p')
    }
    if (params.has('l')){
        choice_license.value = params.get('l')
    }
})


// Update URL hash when choices change
watch([choice_payment, choice_license], () => {
    const params = new URLSearchParams()
    params.set('p', choice_payment.value)
    params.set('l', choice_license.value)
    self.location.hash = params.toString()
})


</script>


<style lang='sass' scoped>

@use 'restrictions_item'

select
    padding: 12px
    margin: 12px
    border-radius: 12px
    font-size: 16px

.note
    opacity: 0.6
    line-height: 1.2
    margin-top: 0
    font-size: 13px
    margin-left: 12px

</style>
