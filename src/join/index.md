
<script lang='ts' setup>

import {onMounted} from 'vue'

import {people_ids_randomized, randomize_people} from '@/_comp/people'


onMounted(() => {
    randomize_people()
})

</script>

<style lang='sass' scoped>
.custom-block
    padding: 16px
    p
        font-size: 0.9em
</style>


# Join the community


## Join a discussion group

 * [A Facebook group on money and ministry](https://www.facebook.com/groups/doreanism)
 * [A Discord server for open source software](https://discord.com/invite/auJb4H9ezx)


## Meet who's freely giving
A great many believers are already freely giving their resources; here's just a few of them:

<CommittedPerson v-for='id of people_ids_randomized' :key='id' :id='id'></CommittedPerson>


::: info Are you also freely giving? [Submit your profile](/join/apply/)

:::
