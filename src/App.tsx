import { autocompletion, closeBrackets } from '@codemirror/autocomplete'
import { history } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import {
	bracketMatching,
	foldGutter,
	indentOnInput,
	syntaxHighlighting
} from '@codemirror/language'
import { highlightSelectionMatches } from '@codemirror/search'
import { EditorState } from '@codemirror/state'
import {
	EditorView,
	drawSelection,
	gutter,
	highlightActiveLine,
	highlightActiveLineGutter,
	highlightSpecialChars,
	keymap,
	lineNumbers,
	rectangularSelection
} from '@codemirror/view'
import { createCodeMirror } from 'solid-codemirror'
import { createSignal, type Component, createResource } from 'solid-js'
import { AppTsx, sampleClass, sampleFunc } from './constants'
import { defaultKeymap } from './keymap'
import { highlightStyle } from './syntaxHighlight'

const App: Component = () => {
	const [code, setCode] = createSignal(AppTsx + '\n' + sampleClass + '\n\n' + sampleFunc)
	const [showLineNumber, setShowLineNumber] = createSignal(true)
	const { ref: EditorRef, createExtension } = createCodeMirror({
		onValueChange: setCode,
		value: code()
	})
	let wrapperRef: HTMLElement = null!

	const theme = EditorView.theme(
		{
			'&': {
				color: '#e4f0fb',
				backgroundColor: '#1b1e28'
			},
			'.cm-content': {
				caretColor: '#a6accd'
			},

			'.cm-gutter': {
				backgroundColor: '#1b1e28',
				color: '#383b4d'
			},
			'cm-activeLineGutter': {
				//changed in css
			}
			// '.cm-cursor': {
			// 	backgroundColor: '#e4f0fb',
			// 	color: '#e4f0fb'
			// }
		},
		{ dark: true }
	)

	createExtension(lineNumbers())
	createExtension(gutter({ class: 'cm-gutter' }))
	createExtension(theme)
	createExtension(highlightActiveLineGutter())
	createExtension(highlightSpecialChars())
	createExtension(history())
	createExtension(foldGutter())
	createExtension(drawSelection())
	// createExtension(dropCursor())
	createExtension(EditorState.allowMultipleSelections.of(true))
	createExtension(indentOnInput())
	createExtension(bracketMatching())
	createExtension(closeBrackets())
	createExtension(autocompletion())
	createExtension(rectangularSelection())
	createExtension(highlightActiveLine())
	createExtension(highlightSelectionMatches())
	createExtension(keymap.of(defaultKeymap))
	createExtension(syntaxHighlighting(highlightStyle, { fallback: true }))
	createExtension(javascript({ jsx: true, typescript: true }))

	return (
		<main ref={wrapperRef} class='bg-background-dark h-screen'>
			<div class='pt-4' ref={EditorRef} />
		</main>
	)
}

export default App
