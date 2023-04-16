
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


const share = async event => {
    // Share link to site
    const url = 'https://copy.church/'
    if (have_share.value){
        self.navigator.share({url})
    } else if (have_clipboard.value){
        await self.navigator.clipboard.writeText(url)
        flash_copied()
    }
}


const share_img = async event => {
    // Share meme clicked on

    // Get PNG form for higher quality, and because some browsers don't support writing jpg yet
    // e.g. Chrome 108 desktop couldn't write a jpg to clipboard
    const url = event.target.src.replace('.jpg', '.png')  // NOTE Browser returns absolute URL
    const blob = await (await fetch(url)).blob()

    // Use Share API if available, otherwise fallback on clipboard
    if (have_share.value){

        // Prepare data to share
        const file = new File([blob], 'lets_copy_church_meme.png', {type: blob.type})
        const data = {
            url: 'https://copy.church',
            title: "Let's copy, church",
            files: [file],
        }

        // Try to share image data, otherwise fallback on sharing a link to the image
        if (self.navigator.canShare(data)){
            self.navigator.share(data)
        } else {
            self.navigator.share({
                url: url,  // URL of actual image so social sites will display it
                title: "Let's copy, church",
            })
        }

    } else if (have_clipboard.value){
        // Can't use Share API so write to clipboard and notify user
        await self.navigator.clipboard.write([new ClipboardItem({[blob.type]: blob})])
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
    <img @click='share_img' width='1024' height='848' src='/memes/jesus_give.jpg'>
    <img @click='share_img' width='1024' height='848' src='/memes/paul_preaching.jpg'>
    <img @click='share_img' width='1024' height='848' src='/memes/jesus_temple.jpg'>
    <img @click='share_img' width='1024' height='848' src='/memes/other_singing.jpg'>
    <img @click='share_img' width='1024' height='848' src='/memes/other_permission.jpg'>
    <img @click='share_img' width='1024' height='848' src='/memes/jesus_stop.jpg'>
    <img @click='share_img' width='1024' height='848' src='/memes/other_modify.jpg'>
    <img @click='share_img' width='1024' height='848' src='/memes/paul_terms.jpg'>
    <img @click='share_img' width='1024' height='848' src='/memes/paul_read.jpg'>
    <img @click='share_img' width='1024' height='848' src='/memes/other_giving.jpg'>
    <img @click='share_img' width='1024' height='848' src='/memes/jesus_ascension.jpg'>
    <img @click='share_img' width='1024' height='848' src='/memes/other_teach.jpg'>
    <img @click='share_img' width='1024' height='848' src='/memes/other_share.jpg'>
    <img @click='share_img' width='1024' height='848' src='/memes/other_beginning.jpg'>
    <img @click='share_img' width='1024' height='848' src='/memes/other_ministry.jpg'>
    <img @click='share_img' width='1024' height='848' src='/memes/paul_trainings.jpg'>
    <img @click='share_img' width='1024' height='848' src='/memes/other_access.jpg'>
    <img @click='share_img' width='1024' height='848' src='/memes/other_purpose.jpg'>
    <img @click='share_img' width='1024' height='848' src='/memes/other_owner.jpg'>
    <img @click='share_img' width='1024' height='848' src='/memes/other_copyright.jpg'>
    <img @click='share_img' width='1024' height='848' src='/memes/other_church.jpg'>
    <img @click='share_img' width='1024' height='848' src='/memes/jesus_charge.jpg'>
    <img @click='share_img' width='1024' height='848' src='/memes/other_critical.jpg'>
    <img @click='share_img' width='1024' height='848' src='/memes/jesus_serve.jpg'>
    <img @click='share_img' width='1024' height='848' src='/memes/paul_compare.jpg'>
    <img @click='share_img' width='1024' height='848' src='/memes/jesus_follow.jpg'>
    <img @click='share_img' width='1024' height='848' src='/memes/other_consult.jpg'>
    <img @click='share_img' width='1024' height='848' src='/memes/other_hq.jpg'>
    <img @click='share_img' width='1024' height='848' src='/memes/other_plans.jpg'>
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
