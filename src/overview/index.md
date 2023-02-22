---
title: Overview
---

<script lang='ts' setup>

import {onBeforeMount} from 'vue'

import {people} from '@/_comp/people'


const people_ids = Object.keys(people)

onBeforeMount(() => {
    // Randomize order of people (ignored for SSR)
    const random_nums = Object.fromEntries(people_ids.map(id => [id, Math.random()]))
    people_ids.sort((a, b) => random_nums[a] - random_nums[b])
})

</script>


<style lang='sass' scoped>

.memes
    display: flex
    margin: 24px 0

    img
        width: 0
        flex-grow: 1
        margin-right: 12px
        cursor: pointer

.people
    display: flex
    align-items: center
    margin: 12px 0

    img
        width: 0
        flex-grow: 1
        border-radius: 50%
        margin-right: 12px

</style>


# This is a call<br>to further God's kingdom<br>by freely sharing resources

“Freely you received, freely give” &mdash; __Jesus__

<img src='@/_assets/ill_share.svg'>

## What's the problem?

<span class=mixed>__The commercialization of ministry__ &mdash; through paywalls and copyright</span>

A vast amount of Christian resources exist (books, songs, trainings, etc) to further God's kingdom, and yet most of them are restricted to paying customers. Copyright also automatically applies to new resources, making them illegal to share, whether the authors intend it or not.

This is [hindering ministry](/explain/examples/) in various ways:

 1. __Helpful resources are not being shared__ as widely as they could be
 2. __Many unintentionally break the law__ by sharing copyrighted resources
 3. __We're being taught to pay for ministry__ rather than partner in it


## What does the Bible say?

Jesus explicitly told his disciples to "freely give" (Matthew 10:8) and [the rest of Scripture also testifies to this command](/explain/biblical/). This is at odds with paywalls and copyright which are all about restricting what is given for the benefit of the creator rather than those they serve.


## What can I do?

### [1. Raise awareness of this issue](/share/)

<a class='memes' href='/share/'>
    <img src='/memes/other_purpose.jpg'>
    <img src='/memes/jesus_ascension.jpg'>
    <img src='/memes/paul_trainings.jpg'>
</a>


### [2. Free anything you have created from copyright](/licenses/)

<a href='/licenses/'>
    <img src='@/_assets/ill_unlock.svg' width=120>
</a>


### [3. Join those committed to freely giving](/join/)

<a class='people' href='/join/'>
    <img v-for='person of people_ids.slice(0, 6)' :src='`/_assets/people/${person}.webp`' :title='people[person].title'>
    <div title="View all">❯</div>
</a>


### [4. Explore our collection of free resources](/collection/)

<a href='/collection/'>
    <img src='@/_assets/ill_collection.svg' width=120>
</a>


## But...
Yes, copyright has some positive benefits and is often used with good intentions. However, we believe in most cases the negatives far outweigh the positives and also go against the biblical ethic of "giving freely". It may be tempting to have a knee-jerk reaction to this, however we'd encourage you to first carefully consider the [biblical basis](/explain/biblical/) and [common objections](/explain/objections/).


## Learn more
See the menu (top left) for topics that interest you, or continue with the button below and take the quiz!
