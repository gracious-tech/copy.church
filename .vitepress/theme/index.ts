
import DefaultTheme from 'vitepress/theme'
import VPButton from 'vitepress/dist/client/theme-default/components/VPButton.vue'
import {Theme} from 'vitepress'

import BibleQuote from '@/_comp/BibleQuote.vue'
import CommittedPerson from '@/_comp/CommittedPerson.vue'

import './custom.sass'

export default {
    ...DefaultTheme,
    enhanceApp(ctx){

        // Global components
        ctx.app.component('VPButton', VPButton)
        ctx.app.component('BibleQuote', BibleQuote)
        ctx.app.component('CommittedPerson', CommittedPerson)

        // Redirect if url is missing trailing slash, overwise VP will show a 404
        ctx.router.onAfterRouteChanged = to => {
            const url = new URL(to)
            if (!to.endsWith('/')){
                ctx.router.go(to + '/')
            } else if (url.pathname === '/overview/'){
                // Overview page has been removed
                ctx.router.go('/')
            }
        }
    },
} as Theme
