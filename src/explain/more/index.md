
<script lang='ts' setup>

import ResourcePreview from '@/_comp/ResourcePreview.vue'
import {articles} from '@/_comp/articles'

const lcc_articles = Object.entries(articles).map(([id, meta]) => ({
    title: meta.title,
    url: `/articles/${id}/`,
}))

</script>

# More depth

While this site is designed to be succinct, others have written and spoken more extensively on the topic.

## Books

<ResourcePreview title="The Dorean Principle" desc="A biblical response to the commercialization of Christianity" url='https://thedoreanprinciple.org/' img='/_assets/books/dorean_principle.jpg'></ResourcePreview>

<ResourcePreview title="The Christian Commons" desc="Ending the spiritual famine of the global Church" url='https://www.unfoldingword.org/publications/the-christian-commons' img='/_assets/books/christian_commons.jpg'></ResourcePreview>


## Articles

<ArticlePreview v-for='article of Object.keys(articles)' :key='article' :id='article'></ArticlePreview>


### External articles

 * [Free and Open](https://www.missionfrontiers.org/issue/article/free-and-open)
 * [How To Navigate The Crossroad Of Ministry And Money](https://africa.thegospelcoalition.org/reviews/how-to-navigate-the-crossroad-of-ministry-and-money/)


## Essays

 * [The Dorean Principle (thesis)](https://thedoreanprinciple.org/dorean-thesis.pdf)
 * [Letting Go](/letting_go.pdf)


## Video interviews

 * [Missions Podcast with Conley Owens](https://www.youtube.com/watch?v=Af6JngwT2Hs)
 * [AD Robles with Conley Owens](https://www.youtube.com/watch?v=k7LqSf7W-V8)
 * [Trinity Apologetics with Conley Owens](https://www.youtube.com/watch?v=qxBaB1N3JBI)
 <!-- * [Joe Ensley with Conley Owens](https://www.youtube.com/watch?v=LrM4BIz2G3w) -->


## Podcast episodes

 * Working for the Word
    * [The Dorean Principle (part 1)](https://podcasts.google.com/feed/aHR0cHM6Ly9hbmNob3IuZm0vcy9mM2FhZDU0L3BvZGNhc3QvcnNz/episode/OTkyMDJjMWQtNjg0Zi00YjRhLTlmMDgtMDVjNTkzNDE0OTZm?sa=X&ved=0CA0QkfYCahcKEwjg-bmgv4z8AhUAAAAAHQAAAAAQAQ)
    * [The Dorean Principle (part 2)](https://podcasts.google.com/feed/aHR0cHM6Ly9hbmNob3IuZm0vcy9mM2FhZDU0L3BvZGNhc3QvcnNz/episode/YTI3YzAzYTAtOTI0Mi00MmM0LWIxYjAtNmQ2MzYxZWZkZDU2?sa=X&ved=0CA0QkfYCahcKEwjg-bmgv4z8AhUAAAAAHQAAAAAQAQ)
    * [Towards a Dorean reformation](https://podcasts.google.com/feed/aHR0cHM6Ly9hbmNob3IuZm0vcy9mM2FhZDU0L3BvZGNhc3QvcnNz/episode/M2VmYmY4MTctODE1Yy00OTk2LTgyMGEtNDJjNzJkMWFmYjc4?sa=X&ved=0CA0QkfYCahcKEwjg-bmgv4z8AhUAAAAAHQAAAAAQAQ)
    * [Bible translation licenses (part 1)](https://podcasts.google.com/feed/aHR0cHM6Ly9hbmNob3IuZm0vcy9mM2FhZDU0L3BvZGNhc3QvcnNz/episode/ZjUyOWRjOWUtY2I3MS00ZjM5LWE1M2YtMjg5ZjlmMGJhZmNm?sa=X&ved=0CA0QkfYCahcKEwjorPjQwcn8AhUAAAAAHQAAAAAQAQ)
    * [Bible translation licenses (part 2)](https://podcasts.google.com/feed/aHR0cHM6Ly9hbmNob3IuZm0vcy9mM2FhZDU0L3BvZGNhc3QvcnNz/episode/YjY2YjkzODEtMmM1YS00ZDA1LThhZWEtMzIwOTk2M2FmNzQ0?sa=X&ved=0CAUQkfYCahcKEwj4zYiK24n9AhUAAAAAHQAAAAAQAQ)
 <!-- * [The B.A.R. with Conley Owens](https://podcasts.google.com/feed/aHR0cHM6Ly9mZWVkcy5yZWRjaXJjbGUuY29tLzZhYjFlM2UwLWJmNjgtNGE1Mi1hYjM3LTA0NWM3MWI4NDRjMw/episode/NjA1NzZjM2ItOTkyZi00Y2JkLWJiNDItZWJiNTI5NDg0ZjM5?sa=X&ved=0CAgQuIEEahcKEwi44tyjvYz8AhUAAAAAHQAAAAAQQA) -->
 <!-- * [Truthspresso with Conley Owens](https://podcasts.google.com/feed/aHR0cHM6Ly9mZWVkcy5jYXB0aXZhdGUuZm0vdHJ1dGhzcHJlc3NvLw/episode/ZGI5ZjExZWUtZGE2Zi00YmQ0LWFkMGEtYzFhMDMwYTU5OGIw?sa=X&ved=0CAgQuIEEahcKEwi44tyjvYz8AhUAAAAAHQAAAAAQQA)
 * [Hope in Source with Conley Owens](https://podcasts.google.com/feed/aHR0cHM6Ly9mZWVkcy50cmFuc2lzdG9yLmZtL2hvcGUtaW4tc291cmNl/episode/MDI5NDM4YTYtOThjNy00NDllLWI3YzYtOWM5Yjg2MTg1ZWU5?sa=X&ved=0CAUQkfYCahcKEwjAw-WGv4z8AhUAAAAAHQAAAAAQAw) -->
 * [Do Theology with Conley Owens](https://podcasts.google.com/feed/aHR0cHM6Ly93d3cuZG90aGVvbG9neS5jb20vZmVlZC54bWw/episode/ZG90aGVvbG9neS5wb2RiZWFuLmNvbS83ZTg4MDYyOS0zMTk0LTMzZWMtOGU2OS1jNjRlMmNmY2VkMDk?sa=X&ved=0CAIQuIEEahgKEwi4pv-VwIz8AhUAAAAAHQAAAAAQiAc)
 <!-- * [Things Above Us Roundtable with Conley Owens](https://podcasts.google.com/feed/aHR0cHM6Ly90aGluZ3NhYm92ZS51cy9jYXRlZ29yeS9yb3VuZHRhYmxlL2ZlZWQv/episode/aHR0cHM6Ly90aGluZ3NhYm92ZS51cy8_cD0xNDQxNg?sa=X&ved=0CAIQuIEEahgKEwi4pv-VwIz8AhUAAAAAHQAAAAAQiAc) -->
 <!-- * [The Bible Bashed with Conley Owens](https://podcasts.google.com/feed/aHR0cHM6Ly9hbmNob3IuZm0vcy83YmNmN2MyNC9wb2RjYXN0L3Jzcw/episode/ZGJiZmNmOTMtOTUxMy00NDJlLTk2YzUtYzY0YWQxOWRkNzUy?sa=X&ved=0CAIQuIEEahgKEwi4pv-VwIz8AhUAAAAAHQAAAAAQiAc) -->
 <!-- * [Rooted In Revelation with Conley Owens](https://podcasts.google.com/feed/aHR0cHM6Ly9hbmNob3IuZm0vcy81M2RjYmU3MC9wb2RjYXN0L3Jzcw/episode/ZmE0ZmU5NDEtNjMxMS00ZTExLWFkNzYtNjEyYzcxYTNlMGI0?sa=X&ved=0CAgQuIEEahgKEwi4pv-VwIz8AhUAAAAAHQAAAAAQkQc) -->
 * [TheoTech with Conley Owens](https://podcasts.google.com/feed/aHR0cHM6Ly93d3cudGhlb3RlY2gub3JnL2ZlZWQv/episode/ZTk3NGZlMGEtMjAxMS00YjAzLWFhMDMtMTNiNjU4MmE3MzRh?sa=X&ved=0CA0QkfYCahcKEwjIwqj6wYz8AhUAAAAAHQAAAAAQAQ)
 <!-- * [The Pantry Podcast with Conley Owens](https://podcasts.google.com/feed/aHR0cHM6Ly90aGVwYW50cnlwb2RjYXN0LmNvbS9wb2RjYXN0L2ZlZWQv/episode/aHR0cHM6Ly90aGVwYW50cnlwb2RjYXN0LmNvbS8_cG9zdF90eXBlPXBvZGNhc3QmcD00MDAz?sa=X&ved=0CAIQuIEEahcKEwiA892rwoz8AhUAAAAAHQAAAAAQQw) -->
 * [MinistryWatch with Conley Owens](https://podcasts.google.com/feed/aHR0cHM6Ly9taW5pc3RyeXdhdGNoLmNvbS9wb2RjYXN0L01pbmlzdHJ5V2F0Y2hQb2RjYXN0LnhtbA/episode/aHR0cHM6Ly8xNTUuMTM4LjIxOS4yNDkvP3A9MTIxMjU?sa=X&ved=0CAIQuIEEahgKEwjwsOz-wIz8AhUAAAAAHQAAAAAQigI)
 <!-- * [Conversations with a Calvinist with Conley Owens](https://podcasts.google.com/feed/aHR0cHM6Ly9hbmNob3IuZm0vcy8yZjUzNzc2MC9wb2RjYXN0L3Jzcw/episode/YTg0Njg0MDAtMmZkOS00Mzk5LWJmODEtZDY1MDEyOTVlMzE3?sa=X&ved=0CAIQuIEEahgKEwjwsOz-wIz8AhUAAAAAHQAAAAAQpQI) -->
 <!-- * [Reformed Meditations with Conley Owens](https://podcasts.google.com/feed/aHR0cHM6Ly9mZWVkcy5yZWRjaXJjbGUuY29tL2I3YzZiMjc2LTk2Y2ItNDA5ZC1iZTA5LWFkNjM2OTliZGQ1Ng/episode/N2UwMjkwYWItZGYzMS00N2EyLWFiNmEtNGQyMTQxMzAwMTk1?sa=X&ved=0CAIQuIEEahcKEwjYhraxz4z8AhUAAAAAHQAAAAAQNA) -->
