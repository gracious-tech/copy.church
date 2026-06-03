
import path from 'path'

import {defineConfig} from 'vitepress'
import MarkdownPluginFootnote from 'markdown-it-footnote'


export default defineConfig({
    cleanUrls: true,  // Don't force `.html` on urls
    outDir: 'dist',
    srcDir: 'src',
    title: "Let's copy, church",
    description: "A call to freely share Christian resources to further God's kingdom",
    head: [
        ['link', {rel: 'icon', href: '/_assets/icon.png'}],
        // Required for Twitter to show any image at all
        ['meta', {name: 'twitter:card', content: 'summary'}],
        // WARN WhatsApp requires a URL with domain included
        ['meta', {property: 'og:image', content: 'https://copy.church/_assets/social/site.png'}],
        // Needed for translation widget
        ['script', {
            src: 'https://static.elfsight.com/platform/platform.js',
            async: '',
        }],
    ],
    vite: {
        publicDir: '_public',
        resolve: {
            alias: [
                {find: '@', replacement: path.resolve(__dirname, '../src')},
            ],
        },
        build: {
            rollupOptions: {
                output: {
                    // Merge chunks together if less than 2kb
                    // Previously rollup had separate chunk for img urls used more than once
                    // Resulting in 2 requests per image
                    experimentalMinChunkSize: 2000,
                },
            },
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
            {text: "What the Bible says", link: 'https://sellingjesus.org'},
            {text: "Browse resources", link: 'https://freely.giving'},
            {text: "Memes", link: '/share/'},
            {text: "About", link: '/about/'},
        ],
        search: {
            provider: 'local',
        },
        sidebar: {
            '/objections/': [
                {
                    text: "",
                    items: [
                        {text: "← All Objections", link: '/explain/objections/'},
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

            '/': [
                {
                    text: "Act",
                    items: [
                        {text: "Relinquish copyright", link: '/dedicate/'},
                        {text: "Sign the statement", link: '/statement/', target: 'statement'},
                    ],
                },
                {
                    text: "Explanation",
                    items: [
                        {text: "What's the problem?", link: '/explain/importance/'},
                        {text: "How copyright works", link: '/explain/copyright/'},
                        {text: "Harm caused by copyright", link: '/explain/examples/'},
                        {text: "Common objections", link: '/explain/objections/'},
                    ],
                },
                {
                    text: "Ratings",
                    items: [
                        {text: "Bible ratings", link: '/initiatives/bibles/'},
                        {text: "Critical Text ratings", link: '/initiatives/critical-texts/'},
                        {text: "Statement ratings", link: '/initiatives/statements/'},
                    ],
                },
                {
                    text: "Quiz",
                    items: [
                        {text: "Is sharing Scripture legal?", link: '/initiatives/quiz/'},
                        {text: "Am I being generous?", link: '/initiatives/assess/'},
                    ],
                },
            ],
        },
    },

    transformHead(ctx){
        const head:[string, Record<string, string>][] = []

        // Twitter preview/card ignores <title> and meta description :/
        head.push(['meta', {name: 'og:title', content: ctx.title}])
        head.push(['meta', {name: 'og:description', content: ctx.description}])

        return head
    },
})
