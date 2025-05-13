---
sidebar: false
navbar: false
aside: false
prev: false
next: false
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
</style>

# Andrew should nail this petition to the door of his seminary

## Preamble

Sign if you want to see this happen...

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
