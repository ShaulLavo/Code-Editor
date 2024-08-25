import { createEffect, createSignal } from 'solid-js'
import { all } from '../constants/samples'

export const [editorRef, setEditorRef] = createSignal<HTMLDivElement>(null!)
export const [code, setCode] = createSignal(all.repeat(2))
export const [showLineNumber, setShowLineNumber] = createSignal(true)
export const [currentLine, setCurrentLine] = createSignal(0)
export const [currentColumn, setCurrentColumn] = createSignal(0)
export const [currentSelection, setCurrentSelection] = createSignal('')
export const [editorHight, setEditorHight] = createSignal(window.innerHeight)
