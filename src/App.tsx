import { autocompletion, closeBrackets } from '@codemirror/autocomplete'
import { history } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import { bracketMatching, foldGutter, indentOnInput } from '@codemirror/language'
import { highlightSelectionMatches } from '@codemirror/search'
import { EditorState } from '@codemirror/state'
import {
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
import { createSignal, type Component } from 'solid-js'
import { ayuLight, barf, dracula } from 'thememirror'
import { AppTsx, sampleClass, sampleFunc } from './constants'
import { defaultKeymap } from './keymap'

import { Replicache } from 'replicache'
const rep = new Replicache({ name: 'shaul', licenseKey: 'l8e5f09890dc049c8a38d71d2347001a2' })

const App: Component = () => {
	const [code, setCode] = createSignal(AppTsx + '\n' + sampleClass + '\n\n' + sampleFunc)
	const [showLineNumber, setShowLineNumber] = createSignal(true)
	const themeSettings = {
		dracula: { theme: dracula, color: '#2d2f3f' },
		barf: { theme: barf, color: '#16191e' },
		ayuLight: { theme: ayuLight, color: '#fcfcfc' }
	} as const
	type ThemeKey = keyof typeof themeSettings
	type ThemeSetting = (typeof themeSettings)[ThemeKey]

	const [currentThemeSetting, setCurrentThemeSetting] = createSignal<ThemeSetting>(
		themeSettings.dracula
	)

	const changeTheme = (themeKey: keyof typeof themeSettings) => {
		setCurrentThemeSetting(themeSettings[themeKey])
	}
	// l8e5f09890dc049c8a38d71d2347001a2
	const currentTheme = () => currentThemeSetting().theme
	const currentColor = () => currentThemeSetting().color
	const { ref: EditorRef, createExtension } = createCodeMirror({
		onValueChange: setCode,
		value: code()
	})
	let wrapperRef: HTMLElement = null!

	createExtension(lineNumbers())
	createExtension(gutter({ class: 'cm-gutter' }))
	createExtension(highlightActiveLineGutter())
	createExtension(highlightSpecialChars())
	createExtension(history())
	createExtension(foldGutter())
	createExtension(drawSelection())
	createExtension(EditorState.allowMultipleSelections.of(true))
	createExtension(indentOnInput())
	createExtension(bracketMatching())
	createExtension(closeBrackets())
	createExtension(autocompletion())
	createExtension(rectangularSelection())
	createExtension(highlightActiveLine())
	createExtension(currentTheme)
	createExtension(highlightSelectionMatches())
	createExtension(keymap.of(defaultKeymap))
	createExtension(javascript({ jsx: true, typescript: true }))

	return (
		<main
			ref={wrapperRef}
			class='bg-background-dark h-max'
			style={{ 'background-color': currentColor() }}>
			<select
				style={{ 'background-color': currentColor() }}
				onChange={e => {
					changeTheme(e.currentTarget.value as ThemeKey)
				}}>
				<option value='dracula'>Dracula</option>
				<option value='barf'>Barf</option>
				<option value='ayuLight'>Ayu Light</option>
			</select>
			<div ref={EditorRef} />
		</main>
	)
}

export default App
