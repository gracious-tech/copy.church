
import DefaultTheme from 'vitepress/theme'
import VPButton from 'vitepress/dist/client/theme-default/components/VPButton.vue'
import {Theme} from 'vitepress'

import './custom.sass'

export default {
    ...DefaultTheme,
    enhanceApp(ctx){
        ctx.app.component('VPButton', VPButton)
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
