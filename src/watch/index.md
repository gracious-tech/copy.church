---
title: Bible Org Watch
description: Explore who owns Bible translations and how restrictive they are with their licensing.
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

// Related pages are secondary to the dashboard, so keep them small
.see_also
    font-size: 0.85em
    line-height: 1.6

</style>

# <span class="title_org">Bible Org</span><span class="title_watch">Watch</span> {#bible-org-watch}

Bible Org Watch tracks which organizations control the licensing of God's Word, and how restrictive they are.

<WatchOwnerDashboard>

See also: [All Bible versions](/watch/translations/) &middot; [English Bible ratings](/initiatives/bibles/) &middot; [Critical Text ratings](/initiatives/critical-texts/) {.see_also}

</WatchOwnerDashboard>
