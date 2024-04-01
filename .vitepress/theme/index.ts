
import DefaultTheme from 'vitepress/theme'
import VPButton from 'vitepress/dist/client/theme-default/components/VPButton.vue'
import {Theme} from 'vitepress'

import CustomLayout from './CustomLayout.vue'
import BibleQuote from '@/_comp/BibleQuote.vue'
import CommittedPerson from '@/_comp/CommittedPerson.vue'
import ArticlePreview from '@/_comp/ArticlePreview.vue'

import './custom.sass'


export default {
    ...DefaultTheme,
    Layout: CustomLayout,
    enhanceApp(ctx){
        DefaultTheme.enhanceApp(ctx)
        // Global components
        ctx.app.component('VPButton', VPButton)
        ctx.app.component('BibleQuote', BibleQuote)
        ctx.app.component('CommittedPerson', CommittedPerson)
        ctx.app.component('ArticlePreview', ArticlePreview)

    },
} as Theme
