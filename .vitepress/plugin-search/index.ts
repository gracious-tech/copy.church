import {Plugin, ResolvedConfig} from "vite"
import {IndexSearch} from "./md-index-builder"
import {Options} from './types'
import {resolve} from 'path'


export interface SearchData {
    PREVIEW_LOOKUP: string
    INDEX_DATA: string
    Options: Options
}

const DEFAULT_OPTIONS: Options = {
    previewLength: 62,
    buttonLabel: "Search",
    placeholder: "Search docs",
}

export function SearchPlugin(searchOptions?: Partial<Options>): Plugin {
    const options = {
        ...DEFAULT_OPTIONS,
        ...searchOptions,
    }

    let config: ResolvedConfig
    let computedIndex = null as string|null
    const virtualModuleId = "virtual:search-data"
    const resolvedVirtualModuleId = "\0" + virtualModuleId

    return {
        name: "vite-plugin-search",
        enforce: "pre",
        configResolved(resolvedConfig) {
            config = resolvedConfig
        },

        config: () => ({
            resolve: {
                alias: {"./VPNavBarSearch.vue": resolve(__dirname, "./Search.vue")},
            },
        }),

        async resolveId(id) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId
            }
        },
        async load(this, id) {
            if (id !== resolvedVirtualModuleId)
                return
            if (!computedIndex){
                // Avoid computing the index more than once
                computedIndex = await IndexSearch(config.root, options)
            }
            return computedIndex
        },
    }
}
