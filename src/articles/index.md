---
aside: false
---

<script lang='ts' setup>

import {articles} from '@/_comp/articles'

</script>


# Articles

<ArticlePreview v-for='article of Object.keys(articles)' :key='article' :id='article'></ArticlePreview>
