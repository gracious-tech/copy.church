
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
        sidebar: [
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
                ],
            },
            {
                text: "Explanation",
                items: [
                    {text: "How copyright works", link: '/copyright/'},
                    {text: "Why this is important", link: '/importance/'},
                    {text: "Biblical basis", link: '/biblical/'},
                    {text: "Alternate funding", link: '/funding/'},
                    {text: "Common objections", link: '/objections/'},
                    {text: "More depth", link: '/more/'},
                ],
            },
            {
                text: "Resources",
                items: [
                    {text: "Bibles", link: '/resources/bibles/'},
                    {text: "Music", link: '/resources/music/'},
                    {text: "Other", link: '/resources/other/'},
                ],
            },
            {
                text: "",
                items: [
                    {text: "About this site", link: '/about/'},
                ],
            },
        ],
    },
})
