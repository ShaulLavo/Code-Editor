import { createSignal } from 'solid-js'
import { all } from './constants/samples'

export const [editor, setEditor] = createSignal<HTMLDivElement>(null!)
export const [miniMap, setMiniMap] = createSignal<HTMLDivElement>(null!)
export const [code, setCode] = createSignal(all.repeat(2))
export const [showLineNumber, setShowLineNumber] = createSignal(true)
