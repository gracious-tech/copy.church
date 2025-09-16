---
sidebar: false
navbar: false
aside: false
prev: false
next: false
titleTemplate: false
title: The Sunnyvale Statement on the Stewardship of Scripture
description: Scripture is the Word of God, and he has authorized his people to use, copy, distribute, translate, and adapt it regardless of man’s consent.
head: [[meta, {property: 'og:image', content: 'https://copy.church/_assets/social/declaration.jpg'}]]
---

<script lang='ts' setup>

import SignPetition from '@/_comp/petition/SignPetition.vue'
import DisplaySigners from '@/_comp/petition/DisplaySigners.vue'
import TranslateButton from '@/_comp/TranslateButton.vue'

// Statement signable after 8 Oct 10:30am Sunnyvale CA
// const pub_date_ms = new Date('2025-10-08T10:30:00-07:00').getTime()
const pub_date_ms = new Date('2025-09-08T10:30:00-07:00').getTime()
const signable = pub_date_ms < new Date().getTime()

</script>

<style lang='sass' scoped>
h1
    text-align: center
    margin-top: 48px
    font-size: 24px
    span
        font-size: 40px
.shortcuts
    display: flex
    flex-wrap: wrap
    gap: 12px
    justify-content: center
    margin: 24px 0
img
    border-radius: 12px
</style>


<img src='/_assets/social/declaration.jpg' alt="Liberate the Word">

<h2 style='visibility:hidden;margin:0;padding:0;line-height:0' id='preamble'>Preamble</h2>

# <span>The Sunnyvale Statement</span><br>on the Stewardship of Scripture

<div class='shortcuts'>
    <VPButton v-if='signable' theme='alt' text="Sign" href="#sign"></VPButton>
    <VPButton theme='alt' text="Q & A" href="./explanation/"></VPButton>
    <VPButton v-if='signable' theme='alt' text="List of signers" href="#signers"></VPButton>
    <ClientOnly><TranslateButton></TranslateButton></ClientOnly>
</div>

In the past centuries, innovations in technology have greatly increased the distribution of Scripture. However, this progress has been hindered in other ways: Anti-Christian authorities continue to inhibit access as they always have, yet some of the greatest threats to the dissemination of the Word of God come from within our own institutions. The seventeenth century introduced exclusive publishing rights that limited the printing of the Authorized Version of the Bible. The eighteenth century witnessed the advent of modern copyright law, a legal mechanism that, by design, restricts the free propagation of Scripture. In our own day, these regulations have only expanded, and their impact has increased with the invention of digital publishing.

God has given his Word freely; no man has the authority to control or limit its transmission (2 Tim 2:9). The Author of Scripture has protected and preserved this Word for thousands of years, and we can trust him to continue to do so apart from human contrivances. We thank God for the labors of those who have made the Bible accessible to the nations, but we lament that many translations and editions of Scripture are burdened with legal and organizational restrictions that are ultimately inimical to the Great Commission.

__Therefore, we, the undersigned, unite in one conviction: Scripture is the Word of God, and he has authorized his people to use, copy, distribute, translate, and adapt it regardless of man’s consent.__

May the Word of the Lord run freely and be glorified (2 Thess 3:1), filling the earth as the waters cover the sea (Isa 11:9).


## Affirmations & Denials

### 1. Concerning the Authorship of Scripture
__We affirm__ that God is the divine Author of Scripture, the Word of God written, and has given this Word to his people as a gift.

__We deny__ that Scripture may be regarded as merely human writing or that any may claim an exclusive right over it.

### 2. Concerning the Identity of Scripture
__We affirm__ that the sixty-six books of the Old and New Testaments are the inspired Word of God, and that all forms thereof—whether autograph, apograph, recension, translation, or adaptation—retain a divine quality that necessarily entails certain liberties for those to whom they are entrusted.

__We deny__ that any human effort, creativity, or error involved in the transmission, recension, translation, or adaptation of Scripture undermines any of these liberties.

### 3. Concerning the Use of Scripture
__We affirm__ that the people of God have been given Scripture to search and meditate on, and therefore all who have access to the Word are granted the liberty to make full use of it regardless of man’s consent.

__We deny__ that misuse or any other danger undermines this liberty, or that any have a right to forcibly restrict others from lawfully using the Word of God.

### 4. Concerning the Reproduction of Scripture
__We affirm__ that the people of God have a prerogative to preserve Scripture, and therefore all who have access to the Word are granted the liberty to copy it in any medium or format regardless of man’s consent.

__We deny__ that textual corruption or any other danger undermines this liberty, or that any have a right to forcibly restrict others from lawfully copying the Word of God.

### 5. Concerning the Distribution of Scripture
__We affirm__ that the people of God are called to propagate Scripture, and therefore all who have access to the Word are granted the liberty to distribute it in any medium or format regardless of man’s consent.

__We deny__ that misattribution, economic exploitation, or any other danger undermines this liberty, or that any have a right to forcibly restrict others from lawfully distributing the Word of God.

### 6. Concerning the Adaptation of Scripture
__We affirm__ that the people of God should make full use of Scripture, and therefore all who have access to the Word are granted the liberty to adapt it regardless of man’s consent.

__We deny__ that mistranslation, mishandling, or any other danger undermines this liberty, or that any have a right to forcibly restrict others from lawfully adapting the Word of God.


<div class='shortcuts'>
    <VPButton theme='alt' size='big' text="Questions & Answers" href="./explanation/"></VPButton>
</div>


<template v-if='signable'>
    <SignPetition petition='scripture'></SignPetition>
    <DisplaySigners petition='scripture'></DisplaySigners>
</template>
<p v-else>The Statement will be able to be signed after <a href='https://www.doreancon.org/' target='_blank'>Doreancon</a> on 8 October 2025. <a href='https://forms.gle/4kHfFRWfRiGjZS5D9' target='_blank'>Sign up here</a> to be notified.</p>
