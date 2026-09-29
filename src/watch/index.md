---
title: Bible Org Watch
description: A registry of Bible versions, who owns them, and how they've responded when their work was shared.
aside: false
head: [[meta, {property: 'og:image', content: 'https://copy.church/_assets/social/watch.png'}]]
---

<script lang='ts' setup>
import WatchOwnerDashboard from '@/_comp/watch/WatchOwnerDashboard.vue'
</script>

<style lang='sass' scoped>

// Give the feature's name more presence than a regular page title
h1
    text-align: center
    font-size: 48px
    line-height: 1.2
    margin-bottom: 32px

    @media (max-width: 640px)
        font-size: 30px

// Two joined blocks, like a logotype — "Bible Org" in black, "Watch" in the brand yellow
.title_org, .title_watch
    display: inline-block
    padding: 4px 16px

.title_org
    background: #000
    color: #fff
    border-radius: 10px 0 0 10px

.title_watch
    background: var(--brand)
    color: #000
    border-radius: 0 10px 10px 0

</style>

# <span class="title_org">Bible Org</span><span class="title_watch">Watch</span> {#bible-org-watch}

Bible Org Watch tracks which organizations hold the rights to God's Word, and what licenses they put it under.

- **Restricted**: You cannot share the Bible version without their permission
- **Semi-restricted**: You cannot use the version as a base for a new Bible translation
  and/or sell printed copies (no derivatives / non-commercial)

See also: [English Bible ratings](/initiatives/bibles/) &middot; [Critical Text ratings](/initiatives/critical-texts/)

<WatchOwnerDashboard/>

&nbsp;

<VPButton text="All Bibles" href='/watch/translations/' theme='alt' />

_Figures above exclude versions over 95 years old (public domain by age), except the KJV
(perpetual Crown copyright)._

_We aim for accuracy based on available information, but mistakes are possible —
[contact us](/about/#contact) if you spot one._
