---
sidebar: false
navbar: false
aside: false
prev: false
next: false
head: [[meta, {property: 'og:image', content: 'https://copy.church/_assets/social/declaration.jpg'}]]
---

<script lang='ts' setup>

import SignPetition from '@/_comp/petition/SignPetition.vue'
import DisplaySigners from '@/_comp/petition/DisplaySigners.vue'

</script>

<style lang='sass' scoped>
.shortcuts
    display: flex
    flex-wrap: wrap
    gap: 12px
img
    border-radius: 12px
</style>


<h1><img src='/_assets/social/declaration.jpg' alt="Liberate the Word"></h1>

<h2 style='visibility:hidden;margin:0' id='preamble'>Preamble</h2>

# A Declaration of Freedom to Copy and Share the Bible

We, the undersigned, unite in one conviction: __All people should be free to use, copy, distribute, and adapt the Word of God apart from the permission of man.__

No individual or institution has exclusive rights over the Word of God. He has given it freely, and none has the authority to control or limit it (2 Tim 2:9). God has protected and preserved his Word for thousands of years, and we can trust him to continue to do so apart from human contrivances.

We thank God for the labors of translators, scholars, and ministries who have made the Bible accessible to the nations, but we are also grieved that many translations and editions of Scripture are burdened with legal and organizational restrictions.

While advances in technology have greatly increased the spread of Scripture in the past centuries, in other ways that spread has been increasingly restricted, most especially by copyright, a novel legal mechanism, which has only existed since 1710.

__Therefore, we urge all who have a hand in preserving, translating, or distributing the Bible to dedicate their work to the public domain.__

May the Word of God run freely and be glorified (2 Thess 3:1), filling the earth as the waters cover the sea (Isa 11:9).


<div class='shortcuts'>
    <VPButton text="Sign" href="#sign" />
    <VPButton text="Q & A" href="#questions-answers" />
    <VPButton text="List of signers" href="#signers" />
</div>

## Affirmations & Denials

...

<SignPetition petition='scripture'></SignPetition>

## Questions & Answers

...


<DisplaySigners petition='scripture'></DisplaySigners>
