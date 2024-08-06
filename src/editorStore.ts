import { createSignal } from 'solid-js'
import { all } from './constants/samples'

export interface Refs {
	editor: HTMLDivElement
	miniMap: HTMLDivElement
}

export const refs: Refs = { editor: null!, miniMap: null! }
export const [code, setCode] = createSignal(all.repeat(2))
export const [showLineNumber, setShowLineNumber] = createSignal(true)
