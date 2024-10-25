import { createSignal } from 'solid-js'

export const editorRefs: HTMLDivElement[] = []
export const removeEditorRef = (ref: HTMLDivElement) => {
	const index = editorRefs.indexOf(ref)
	if (index > -1) {
		editorRefs.splice(index, 1)
	}
}
export const [showLineNumber, setShowLineNumber] = createSignal(true)
export const [currentLine, setCurrentLine] = createSignal(0)
export const [currentColumn, setCurrentColumn] = createSignal(0)
export const [currentSelection, setCurrentSelection] = createSignal('')
export const [editorHight, setEditorHight] = createSignal(window.innerHeight)
export const [isTsLoading, setIsTsLoading] = createSignal(false)
export const [isGitLoading, setIsGitLoading] = createSignal(false)
export const [isMiniMap, setIsMiniMap] = createSignal(true)
