
import {IndexOptions} from "@akryum/flexsearch-es"


export interface Options extends IndexOptions<unknown> {
    previewLength: number
    buttonLabel: string
    placeholder: string
}
