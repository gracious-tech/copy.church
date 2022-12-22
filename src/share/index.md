
<script lang='ts' setup>

import {onBeforeMount, ref, computed} from 'vue'


const have_share = ref(false)
const have_clipboard = ref(false)
const show_copied = ref(false)


const share_label = computed(() => {
    return have_share.value ? "Share link" : (have_clipboard.value ? "Copy link" : null)
})


const share_meme_instruct = computed(() => {
    return have_share.value ? "Click a meme to share it." :
        (have_clipboard.value ? "Click a meme to copy it." : null)
})


const flash_copied = () => {
    // Briefly show .copied div
    show_copied.value = true
    setTimeout(() => {
        show_copied.value = false
    }, 3000)
}


const share = event => {
    // Share link to site
    const url = 'https://copy.church/'
    if (have_share.value){
        self.navigator.share({url})
    } else if (have_clipboard.value){
        self.navigator.clipboard.writeText(url)
        flash_copied()
    }
}


const share_img = async event => {
    // Share meme clicked on

    // Prepare data to be shared
    const url = event.target.src
    const blob = await (await fetch(url)).blob()
    const file = new File([blob], 'lets_copy_church_meme.jpg', {type: blob.type})
    const data = {
        url: 'https://copy.church',
        title: "Let's copy, church",
        files: [file],
    }

    if (have_share.value){
        if (self.navigator.canShare(data)){
            self.navigator.share(data)
        } else {
            self.navigator.share({
                url: url,  // URL of actual image so social sites will display it
                title: "Let's copy, church",
            })
        }
    } else if (have_clipboard.value){
        self.navigator.clipboard.write([new ClipboardItem({[blob.type]: blob})])
        flash_copied()
    }
}


onBeforeMount(() => {
    // Can only access browser API at runtime
    have_share.value = 'share' in self.navigator
    have_clipboard.value = 'clipboard' in self.navigator
})


</script>


<style lang='sass' scoped>

.memes
    display: flex
    flex-direction: column

    img
        margin-bottom: 24px
        cursor: pointer


.copied
    position: fixed
    bottom: 50%
    left: 30%
    z-index: 999
    background-color: var(--vp-c-brand-lighter)
    filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.5))
    font-size: 14px
    font-weight: bold
    color: rgba(0, 0, 0, 0.8)
    padding: 6px 12px
    border-radius: 24px


.v-enter-active, .v-leave-active
    transition: opacity 0.5s ease

.v-enter-from, .v-leave-to
    opacity: 0


</style>


# Raise awareness

Hearts and minds need to be changed for us to see true generosity for the sake of the Kingdom.


## Share this site

<p v-if='share_label'><VPButton :text='share_label' @click='share'></VPButton></p>


## Share a meme

Sometimes it takes a bit of humor to better understand why something is important.

__{{ share_meme_instruct }}__

<div class='memes'>
    <img src='/memes/jesus_give.jpg' @click='share_img'>
    <img src='/memes/paul_preaching.jpg' @click='share_img'>
    <img src='/memes/jesus_temple.jpg' @click='share_img'>
    <img src='/memes/other_singing.jpg' @click='share_img'>
    <img src='/memes/paul_terms.jpg' @click='share_img'>
    <img src='/memes/paul_read.jpg' @click='share_img'>
    <img src='/memes/jesus_ascension.jpg' @click='share_img'>
    <img src='/memes/other_share.jpg' @click='share_img'>
    <img src='/memes/other_beginning.jpg' @click='share_img'>
    <img src='/memes/other_burden.jpg' @click='share_img'>
    <img src='/memes/other_ministry.jpg' @click='share_img'>
    <img src='/memes/paul_trainings.jpg' @click='share_img'>
    <img src='/memes/other_access.jpg' @click='share_img'>
    <img src='/memes/other_purpose.jpg' @click='share_img'>
    <img src='/memes/other_owner.jpg' @click='share_img'>
    <img src='/memes/other_copyright.jpg' @click='share_img'>
    <img src='/memes/other_church.jpg' @click='share_img'>
    <img src='/memes/jesus_charge.jpg' @click='share_img'>
</div>


## Talk to people

Start conversations about how we can resist the commercialization of ministry by talking to:

 * Your pastor
 * Your college/seminary teachers
 * Your small group
 * Your band
 * and any other Christians you know


<transition>
    <div v-if='show_copied' class='copied'>Copied! Now paste it somewhere</div>
</transition>
