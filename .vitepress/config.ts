
import path from 'path'

import {defineConfig} from 'vitepress'
import MarkdownPluginFootnote from 'markdown-it-footnote'

import {articles} from '../src/_comp/articles'


export default defineConfig({
    cleanUrls: true,  // Don't force `.html` on urls
    outDir: 'dist',
    srcDir: 'src',
    title: "Let's copy, church",
    description: "A call to freely share Christian resources to further God's kingdom",
    head: [
        ['link', {rel: 'icon', href: '/_assets/icon.png'}],
        // WARN WhatsApp requires a URL with domain included
        ['meta', {property: 'og:image', content: 'https://copy.church/_assets/social/site.png'}],
        ['meta', {property: 'og:image:width', content: '1200'}],
        ['meta', {property: 'og:image:height', content: '630'}],
    ],
    vite: {
        resolve: {
            alias: [
                {find: '@', replacement: path.resolve(__dirname, '../src')},
            ],
        },
    },
    markdown: {
        config: (md) => {
            md.use(MarkdownPluginFootnote)
        },
    },
    themeConfig: {
        logo: '/_assets/icon.svg',
        nav: [
            {text: "About", link: '/about/'},
            {text: "Pricing", link: '/pricing/'},
        ],
        socialLinks: [
            {icon: 'facebook', link: 'https://www.facebook.com/copy.church'},
        ],
        search: {
            provider: 'local',
        },
        sidebar: {
            '/objections/': [
                {
                    text: "",
                    items: [
                        {text: "All Objections", link: '/explain/objections/'},
                    ],
                },
                {
                    text: "Scripture",
                    items: [
                        {text: "It's not a command", link: '/objections/not-command/'},
                        {text: "Only applies to evangelism", link: '/objections/only-evangelism/'},
                        {text: "Worker deserves wages", link: '/objections/deserves-wages/'},
                        {text: "Only greed condemned", link: '/objections/only-greed/'},
                    ],
                },
                {
                    text: "Theology",
                    items: [
                        {text: "There's only one verse", link: '/objections/one-verse/'},
                        {text: "This is political ideology", link: '/objections/political/'},
                        {text: "We're in a different era", link: '/objections/different-era/'},
                        {text: "You can't force generosity", link: '/objections/generosity/'},
                        {text: "Everything belongs to God", link: '/objections/everything/'},
                    ],
                },
                {
                    text: "Application",
                    items: [
                        {text: "Some can't give freely", link: '/objections/feasibility/'},
                        {text: "What about authors", link: '/objections/authors/'},
                        {text: "What about publishers", link: '/objections/publishers/'},
                        {text: "Why target parachurch", link: '/objections/parachurch/'},
                        {text: "There's lots already free", link: '/objections/already-free/'},
                        {text: "What can't be sold", link: '/objections/scope/'},
                        {text: "Free works not valued", link: '/objections/not-valued/'},
                    ],
                },
                {
                    text: "Copyright",
                    items: [
                        {text: "Prevents theft", link: '/objections/theft/'},
                        {text: "Prevents heresy", link: '/objections/heresy/'},
                        {text: "Prevents plagiarism", link: '/objections/plagiarism/'},
                        {text: "Fosters innovation", link: '/objections/innovation/'},
                        {text: "Just ask permission", link: '/objections/permission/'},
                    ],
                },
                {
                    text: "Licenses",
                    items: [
                        {text: "Forbidding commercial use", link: '/objections/non-commercial/'},
                        {text: "Forbidding derivatives", link: '/objections/no-derivatives/'},
                        {text: "Requiring share-alike", link: '/objections/share-alike/'},
                        {text: "Requiring attribution", link: '/objections/attribution/'},
                        {text: "Why public domain", link: '/objections/public-domain/'},
                    ],
                },
            ],

            '/articles/': [
                {
                    text: "Articles",
                    items: Object.entries(articles).map(([id, meta]) => ({
                        text: meta.title,
                        link: `/articles/${id}/`,
                    })),
                },
            ],

            '/': [
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
                        {text: "Quiz", link: '/initiatives/quiz/'},
                        {text: "Am I being generous?", link: '/initiatives/assess/'},
                        {text: "English Bible ratings", link: '/initiatives/bibles/'},
                        {text: "Critical Text ratings", link: '/initiatives/critical-texts/'},
                        {text: "Freedom to worship", link: '/initiatives/music/'},
                        {text: "Opposing views", link: '/initiatives/opposition/'},
                    ],
                },
            ],
        },
    },
})
