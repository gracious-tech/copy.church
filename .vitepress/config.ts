
import path from 'path'

import {defineConfig} from 'vitepress'


export default defineConfig({
    outDir: 'dist',
    srcDir: 'src',
    title: "Let's copy, church",
    description: "A call to freely share Christian resources to further God's kingdom",
    head: [
        ['link', {rel: 'icon', href: '/icon.png'}],
        ['meta', {property: 'og:image', content: '/social.png'}],
        ['meta', {property: 'og:image:width', content: '1200'}],
        ['meta', {property: 'og:image:height', content: '630'}],
    ],
    vite: {
        resolve: {
            alias: [{find: '@', replacement: path.resolve(__dirname, '../src')}],
        },
    },
    themeConfig: {
        logo: '/icon.svg',
        nav: [
            {text: "About", link: '/about/'},
        ],
        socialLinks: [
            {icon: 'facebook', link: 'https://www.facebook.com/copy.church'},
        ],
        sidebar: {
            '/articles/': [
                {
                    text: "",
                    items: [
                        {text: "← Project Overview", link: '/overview/'},
                    ],
                },
                {
                    text: "Articles",
                    items: [
                        {text: "The Command Many Ministries Overlook", link: '/articles/command-many-overlook/'},
                    ],
                },
            ],
            '/': [
                {
                    text: "Introduction",
                    items: [
                        {text: "Overview", link: '/overview/'},
                        {text: "Quiz", link: '/quiz/'},
                    ],
                },
                {
                    text: "Join the movement",
                    items: [
                        {text: "Raise awareness", link: '/share/'},
                        {text: "Free your resources", link: '/licenses/'},
                        {text: "Join the community", link: '/join/'},
                        {text: "Explore free resources", link: '/collection/'},
                    ],
                },
                {
                    text: "Explanation",
                    items: [
                        {text: "How copyright works", link: '/explain/copyright/'},
                        {text: "Why this is important", link: '/explain/importance/'},
                        {text: "Biblical basis", link: '/explain/biblical/'},
                        {text: "Alternate funding", link: '/explain/funding/'},
                        {text: "Common objections", link: '/explain/objections/'},
                        {text: "Real examples", link: '/explain/examples/'},
                        {text: "More depth", link: '/explain/more/'},
                    ],
                },
                {
                    text: "Initiatives",
                    items: [
                        {text: "English Bible ratings", link: '/initiatives/bibles/'},
                        {text: "Freedom to worship", link: '/initiatives/music/'},
                    ],
                },
            ],
        },
    },
})
