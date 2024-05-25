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
import { defaultKeymap } from './keymap'
import { createCodeMirror } from 'solid-codemirror'
import { Accessor } from 'solid-js'
import { currentTheme } from '../themeStore'
import * as themes from '@uiw/codemirror-themes-all';

type CreateExtension = ReturnType<typeof createCodeMirror>['createExtension']

export function createDefaultExtensions(
	createExtension: CreateExtension,
	showLineNumber?: Accessor<boolean>
) {
	// createExtension(lineNumbers())
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
	createExtension(highlightSelectionMatches())
	createExtension(keymap.of(defaultKeymap))
	createExtension(javascript({ jsx: true, typescript: true }))
	if (showLineNumber instanceof Function) {
		createExtension(() => (showLineNumber() ? lineNumbers() : []))
	} else createExtension(() => lineNumbers())
	createExtension(currentTheme)
}
