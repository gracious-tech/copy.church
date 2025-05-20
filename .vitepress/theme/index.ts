
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

        // Preserve lang query param when navigating so that sharing URL preserves language choice
        // (Elfsight will auto-add the lang param, but Vitepress will lose it when changing page)
        let prev_lang:string|null = null
        ctx.router.onBeforeRouteChange = to => {
            prev_lang = new URLSearchParams(self.location.search).get('lang')
        }
        ctx.router.onAfterRouteChange = to => {
            const current_lang = new URLSearchParams(self.location.search).get('lang')
            if (prev_lang && !current_lang){
                const new_url = new URL(self.location.href)
                new_url.searchParams.set('lang', prev_lang)
                self.history.replaceState(self.history.state, '', new_url.href)
            }
        }
    },
} as Theme
