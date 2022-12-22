
<template lang='pug'>

transition

    //- Intro

    div.first(v-if='slide === 0')
        h1 Is it legal for you to share the Bible?
        p Only 41% of the world has a shareable translation
        img(src='@/_assets/quiz/question.svg')
        h3 Take the quiz!

    div(v-else-if='slide === 1')
        h3 How it works
        p Simply answer whether a use of Scripture is permitted or not.
        h3 The rules (most bibles have these)
        ol
            li {{ rule_verses }}
            li {{ rule_book }}
            li {{ rule_ratio }}
        h3 For example...
        p Question: "Can you photocopy the whole Bible?"
        p Answer: No
        p &nbsp;
        p
            small (for the purpose of this quiz we'll just be considering the license of Bible translations, and not fair use law which varies by country)

    //- Questions

    div(v-else-if='slide === 2')
        h3 Can you create a Bible study that is a page with a passage and a few discussion questions?
        img(src='@/_assets/quiz/bible_study.svg')
        div.breaks(v-if='guesses[slide] !== null')
            p You can't do this, as it breaks rule:
            ul
                li {{ rule_ratio }}
            p (in most cases the passage would exceed 1/4 of the content)

    div(v-else-if='slide === 3')
        h3 Can you livestream a church service when the sermon is on Philemon?
        img(src='@/_assets/quiz/sermon.svg')
        div.breaks(v-if='guesses[slide] !== null')
            p You can't do this, as it breaks rule:
            ul
                li {{ rule_book }}
            p (assuming all 25 verses were read during the service)

    div(v-else-if='slide === 4')
        h3 Can you write a commentary on the first half of Matthew?
        img(src='@/_assets/quiz/commentary.svg')
        div.breaks(v-if='guesses[slide] !== null')
            p You can't do this, as it breaks rule:
            ul
                li {{ rule_verses }}
            p (half of Matthew is 535 verses)

    div(v-else-if='slide === 5')
        h3 Can you print out 3 John (one page) for a small group to highlight and study together?
        img(src='@/_assets/quiz/highlight.svg')
        div.breaks(v-if='guesses[slide] !== null')
            p You can't do this, as it breaks rules:
            ul
                li {{ rule_book }}
                li {{ rule_ratio }}

    div(v-else-if='slide === 6')
        h3 Can you print out John 3 for a small group to highlight and study together?
        img(src='@/_assets/quiz/highlight.svg')
        div.breaks(v-if='guesses[slide] !== null')
            p You can't do this, as it breaks rule:
            ul
                li {{ rule_ratio }}

    div(v-else-if='slide === 7')
        h3 Can you record some passages for a blind person to listen to?
        img(src='@/_assets/quiz/audio.svg')
        div.breaks(v-if='guesses[slide] !== null')
            p You can't do this, as it breaks rule:
            ul
                li {{ rule_ratio }}

    div(v-else-if='slide === 8')
        h3 Can you film your Sunday school acting out Jonah with Scripture narration?
        img(src='@/_assets/quiz/sunday_school.svg')
        div.breaks(v-if='guesses[slide] !== null')
            p You can't do this, as it breaks rule:
            ul
                li {{ rule_ratio }}
            p (scripture would take up 100% of the narration)

    div(v-else-if='slide === 9')
        h3 Can you share a Bible verse on social media?
        img(src='@/_assets/quiz/twitter.svg')
        div.breaks(v-if='guesses[slide] !== null')
            p You can't do this, as it breaks rule:
            ul
                li {{ rule_ratio }}
            p (though most countries allow such minor uses even if it breaks the license)

    div(v-else-if='slide === 10')
        h3 Can you write an article that includes a passage from Ephesians?
        img(src='@/_assets/quiz/article.svg')
        p(v-if='guesses[slide] !== null') Yes, you can likely do this.

    div(v-else-if='slide === 11')
        h3 Can you print and share Mark with someone who's intimidated by the size of the Bible?
        img(src='@/_assets/quiz/share.svg')
        div.breaks(v-if='guesses[slide] !== null')
            p You can't do this, as it breaks rules:
            ul
                li {{ rule_verses }}
                li {{ rule_book }}
                li {{ rule_ratio }}
            p (Mark is 678 verses)

    //- Finish

    div.last(v-else-if='slide === 12')
        h3 You scored... {{ total }} / 10
        p These rules are the same as what is currently used in #[a(href='/resources/bibles/') most Bible translations today], worldwide. The rules were made before the Internet existed and yet have remained largely unchanged.

div.guess(v-if='guesses[slide] === null')
    VPButton(text="Yes" @click='yes')
    VPButton(text="No" @click='no')

div.guess_result(v-if='typeof guesses[slide] === "boolean"' :class='{right: guesses[slide] === answers[slide]}')
    | {{ guesses[slide] === answers[slide] ? "You got this one right" : "You got this one wrong" }}

div.nav
    VPButton(text="Previous" :disabled='slide === 0' @click='prev')
    | {{ status }}
    VPButton(text="Next" :disabled='slide === 12' @click='next')

div.leave
    VPButton(href='/licenses/' text="Exit Quiz" theme='alt')

</template>


<script lang='ts' setup>

import {ref, reactive, computed} from 'vue'

const rule_verses = "You can't quote more than 500 verses"
const rule_book = "You can't quote a complete book"
const rule_ratio = "Scripture can't be more than 1/4 of the total content you share"


const answers = {
    '2': false,
    '3': false,
    '4': false,
    '5': false,
    '6': false,
    '7': false,
    '8': false,
    '9': false,
    '10': true,
    '11': false,
}


const slide = ref(0)
const guesses = reactive({
    '2': null,
    '3': null,
    '4': null,
    '5': null,
    '6': null,
    '7': null,
    '8': null,
    '9': null,
    '10': null,
    '11': null,
})


const yes = () => {
    guesses[slide.value] = true
}

const no = () => {
    guesses[slide.value] = false
}


const prev = () => {
    slide.value -= 1
}

const next = () => {
    slide.value += 1
}

const total = computed(() => {
    let score = 0
    for (const key in answers){
        if (answers[key] === guesses[key]){
            score += 1
        }
    }
    return score
})

const status = computed(() => {
    if (answers[slide.value] === undefined){
        return ''
    }
    return `${slide.value - 1} / 10`
})

</script>


<style lang='sass' scoped>

img
    max-height: 200px
    margin: 36px auto

.first
    text-align: center

    h3
        color: var(--vp-c-brand)

button[disabled]
    visibility: hidden

.breaks
    color: hsla(20, 50%, 50%, 0.8)

    p:first-child
        font-weight: bold

.guess
    text-align: center

    *:nth-child(1), *:nth-child(1):hover
        margin-right: 24px
        background-color: hsla(120, 50%, 50%, 0.8)
        border-style: none
    *:nth-child(2), *:nth-child(2):hover
        margin-left: 24px
        background-color: hsla(0, 50%, 50%, 0.8)
        border-style: none

.guess_result
    text-align: center
    font-weight: bold
    color: hsla(0, 100%, 50%, 0.7)
    &.right
        color: hsla(120, 50%, 50%, 0.8)


.nav
    display: flex
    justify-content: space-between
    margin-top: 48px

.last
    text-align: center

    h3
        font-size: 2em
        margin-bottom: 48px

.v-enter-active
    transition-property: opacity
    transition-duration: 0.5s
    transition-timing-function: ease

.v-enter-from
    opacity: 0

.leave
    text-align: center
    margin-top: 100px

</style>
