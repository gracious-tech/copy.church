---
titleTemplate: false
layout: home
hero:
    name: Let's copy, church
    tagline: Give up your rights for the sake of the gospel
    image:
        src: /_assets/home/illustration.svg
    actions:
        -   link: /explain/importance/
            text: What's the problem?
features:
    -   title: How to relinquish copyright
        link: /dedicate/
        icon:
            src: /_assets/home/give.svg
        details: It's very easy...
    -   title: Sign the statement on Scripture
        link: /statement/
        target: statement
        icon:
            src: /_assets/home/sign.svg
        details: That it should be free to copy, translate, and distribute.
    -   title: Bible ratings
        link: /initiatives/bibles/
        icon:
            src: /_assets/home/rating.svg
        details: See how your favorite translation compares!
---

<script lang='ts' setup>

import {onMounted} from 'vue'

import {people, people_ids_randomized, randomize_people} from '@/_comp/people'


onMounted(() => {
    randomize_people()
})

</script>


<style lang='sass' scoped>

.people
    display: flex
    align-items: center
    margin: 48px auto
    padding: 0 24px
    max-width: 800px

    a
        width: 0
        flex-grow: 2
        text-align: center
        text-decoration: none

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


</style>


<div class='people'>
    <a v-for='person of people_ids_randomized.slice(0, 9)' :href='`/join/#person_${person}`' :key='person'>
        <img :src='`/_assets/people/${person}.webp`' :title='people[person].title'>
    </a>
    <a href='/join/' title="View all">❯</a>
</div>
