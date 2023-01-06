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
    margin: 12px 0
    overflow: hidden

    img
        width: 80px
        height: 80px
        border-radius: 40px
        margin-right: 12px
        cursor: pointer

</style>


# This is a call<br>to further God's kingdom<br>by freely sharing resources

“Freely you received, so freely give” &mdash; __Jesus__

<img src='@/_assets/ill_share.svg'>

## What's the problem?

<span class=mixed>__The commercialization of ministry__ &mdash; through paywalls and copyright</span>

A vast amount of Christian resources exist (books, songs, trainings, etc) to further God's kingdom, and yet most of them are restricted to paying customers. Copyright also automatically applies to new resources, making them illegal to share, whether the authors intend it or not.

This is [hindering ministry](/examples/) in various ways:

 1. __Helpful resources are not being shared__ as widely as they could be
 2. __Many unintentionally break the law__ by sharing copyrighted resources
 3. __We're being taught to pay for ministry__ rather than partner in it


## What does the Bible say?

Jesus explicitly told his disciples to "freely give" (Matthew 10:8) and [the rest of Scripture also testifies to this command](/biblical/). This is at odds with paywalls and copyright which are all about restricting what is given for the benefit of the creator rather than those they serve.


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
    <img v-for='person of people_ids' :src='`/people/${person}.webp`' :title='people[person].title'>
</a>


### [4. Explore our collection of free resources](/collection/)

<a href='/collection/'>
    <img src='@/_assets/ill_collection.svg' width=120>
</a>


## What's an example?
Say you wrote a Bible study on Ephesians for a youth group. Another youth leader thought the study was helpful so they asked you for a copy, which they then made some changes to and also shared it with some other leaders.

You are totally fine with how your resource was used, but they actually broke the law. Your resource was copyrighted the moment you created it. While you permitted the leader to make a copy for themselves, you did not initially give them permission to share it with others or to modify it.

Your resource then ends up in the hands of some other leaders, who know a bit about copyright, and they decide they'll have to write their own study on Ephesians because they don't know whether the original author (you) would permit them to use it or not.

So copyright in this example (1) unnecessarily made other believers lawbreakers and (2) prevented the resource from being further shared.


## What resources get copyrighted?

Almost any form of intellectual property:
 * __Textual resources:__ books, bibles, articles, trainings, ...
 * __Artistic resources:__ music, poems, photos, artwork, ...
 * __And others like:__ sermons, software, ...


## But...
Yes, copyright has some positive benefits and is often used with good intentions. However, we believe in most cases the negatives far outweigh the positives and also go against the biblical ethic of "giving freely". It may be tempting to have a knee-jerk reaction to this, however we'd encourage you to first carefully consider the [biblical basis](/biblical/) and [common objections](/objections/).


## Learn more
See the menu (top left) for topics that interest you, or continue with the button below and take the quiz!
