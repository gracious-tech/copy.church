
import DefaultTheme from 'vitepress/theme'
import VPButton from 'vitepress/dist/client/theme-default/components/VPButton.vue'
import {Theme} from 'vitepress'

import BibleQuote from '@/_comp/BibleQuote.vue'
import CommittedPerson from '@/_comp/CommittedPerson.vue'
import ArticlePreview from '@/_comp/ArticlePreview.vue'

import './custom.sass'

export default {
    ...DefaultTheme,
    enhanceApp(ctx){

        // Global components
        ctx.app.component('VPButton', VPButton)
        ctx.app.component('BibleQuote', BibleQuote)
        ctx.app.component('CommittedPerson', CommittedPerson)
        ctx.app.component('ArticlePreview', ArticlePreview)

        // Custom route handling
        // WARN Seems to break SSR but not needed for it anyway
        ctx.router.onAfterRouteChanged = to => {
            if (!import.meta.env.SSR){
                // NOTE URL base probably not actually needed, just to be safe
                const url = new URL(to, 'https://copy.church')
                if (!to.endsWith('/')){
                    // Redirect if url is missing trailing slash, overwise VP will show a 404
                    ctx.router.go(to + '/')
                } else if (url.pathname === '/overview/'){
                    // Overview page has been removed
                    ctx.router.go('/')
                } else if (url.pathname === '/objections/'){
                    // Objections index is under different path
                    ctx.router.go('/explain/objections/')
                }
            }
        }
    },
} as Theme
