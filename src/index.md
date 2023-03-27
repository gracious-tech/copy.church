---
aside: false
titleTemplate: false
---

<script lang='ts' setup>

import {onMounted} from 'vue'

import {people, people_ids_randomized, randomize_people} from '@/_comp/people'


onMounted(() => {
    randomize_people()
})

</script>


<style lang='sass' scoped>

h1:nth-child(1)
    font-size: 80px
    font-weight: bold
    line-height: 1.1 // Fix VP's pixel value
    color: var(--brand)
    margin: 36px 0
    text-align: center

h1:nth-child(2)
    font-size: 30px
    text-align: center

.quote
    width: 100%

h3
    font-size: 1.5em
    margin-top: 48px
    margin-bottom: 24px
    font-weight: bold
    @media (max-width: 600px)
        font-size: 1.2em

.icon
    width: 100%
    max-width: 300px
    margin: 50px auto

.ill_share
    max-width: 600px
    width: 100%
    margin: 0 auto

.memes
    display: flex
    margin: 24px 0

    img
        width: 0
        flex-grow: 1
        cursor: pointer
        margin-right: 24px
        @media (max-width: 600px)
            margin-right: 12px

.people
    display: flex
    align-items: center
    margin: 12px 0

    a
        width: 0
        flex-grow: 2
        text-align: center

        &:last-child
            flex-grow: 1
            @media (min-width: 600px)
                font-size: 2em

        &:not(:last-child)
            margin-right: 24px
            @media (max-width: 600px)
                margin-right: 8px

        img
            border-radius: 50%

.more
    @media (max-width: 600px)
        display: flex
        flex-direction: column

</style>

# Let's copy, church
# Give up your rights for the sake of the kingdom

<img class='icon' src='/_assets/icon.svg'>


## What's the problem?

<span class=mixed>__The commercialization of ministry__ &mdash; through paywalls and copyright</span>

A vast amount of Christian resources exist (books, songs, trainings, etc) to further God's kingdom, and yet most of them are restricted to paying customers. Copyright also automatically applies to new resources, making them illegal to share, whether the authors intend it or not.

This is [hindering ministry](/explain/examples/) in various ways:

 1. __Helpful resources are not being shared__ as widely as they could be
 2. __Many unintentionally break the law__ by sharing copyrighted resources
 3. __We're being taught to pay for ministry__ rather than partner in it

<img src='@/_assets/ill_share.svg' class='ill_share'>


## What does the Bible say?

<img class='quote' src='@/_assets/images/quote.svg'>

Jesus explicitly told his disciples to "freely give" (Matthew 10:8) and [the rest of Scripture also testifies to this command](/explain/biblical/). This is at odds with paywalls and copyright which are all about restricting what is given for the benefit of the creator rather than those they serve.


## What can I do?

### [1. Raise awareness of this issue](/share/)

<a class='memes' href='/share/'>
    <img src='/memes/jesus_give.jpg'>
    <img src='/memes/jesus_charge.jpg'>
    <img src='/memes/paul_trainings.jpg'>
</a>


### [2. Free anything you have created from copyright](/licenses/)

<a href='/licenses/'>
    <img src='@/_assets/ill_unlock.svg' width=120>
</a>


### [3. Join those committed to freely giving](/join/)

<div class='people'>
    <a v-for='person of people_ids_randomized.slice(0, 6)' :href='`/join/#person_${person}`' :key='person'>
        <img :src='`/_assets/people/${person}.webp`' :title='people[person].title'>
    </a>
    <a href='/join/' title="View all">❯</a>
</div>


### [4. Explore our collection of free resources](/collection/)

<a href='/collection/'>
    <img src='@/_assets/ill_collection.svg' width=120>
</a>


## But...
Yes, copyright has some positive benefits and is often used with good intentions. However, we believe in most cases the negatives far outweigh the positives and also go against the biblical ethic of "giving freely". It may be tempting to have a knee-jerk reaction to this, however we'd encourage you to first carefully consider the [biblical basis](/explain/biblical/) and [common objections](/explain/objections/).


## Learn more

<p class='more'>
    <VPButton href='/initiatives/quiz/' theme='alt' text="Take a quiz"></VPButton>
    &nbsp;
    <VPButton href='/share/' theme='alt' text="Scroll some memes"></VPButton>
    &nbsp;
    <VPButton href='/initiatives/bibles/' theme='alt' text="View Bible ratings"></VPButton>
</p>

... or see the top-left menu for topics that interest you.
