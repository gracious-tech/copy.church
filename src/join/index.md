
<script lang='ts' setup>

import CommittedPerson from '@/_comp/CommittedPerson.vue'

import {people} from '@/_comp/people'

</script>


# Join the community

## Get updates about free ministry resources
Like or follow [the Facebook page](https://www.facebook.com/copy.church), which regularly posts quality free ministry resources as we come across them.


## Join a discussion group

 * [A Facebook group on money and ministry](https://www.facebook.com/groups/doreanism)
 * [A Discord server for open source software](https://discord.com/invite/auJb4H9ezx)


## Meet who's freely giving
A great many believers are already freely giving their resources; here's just a few of them:

<CommittedPerson v-for='id of Object.keys(people)' :id='id'></CommittedPerson>


::: warning Are you freely giving quality resources?

[Let us know](/about/) so we can add you.

:::
