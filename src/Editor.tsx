import { createCodeMirror, createEditorControlledValue } from 'solid-codemirror'
import {
	Accessor,
	Setter,
	createEffect,
	createResource,
	onMount
} from 'solid-js'
import { ThemeKey, setTheme } from './themeStore'
import { createDefaultExtensions } from './utils/extensions'
import {
	createShortcut,
	useKeyDownEvent,
	useKeyDownList
} from '@solid-primitives/keyboard'
import { formatCode } from './format'

export interface EditorProps {
	code: Accessor<string>
	setCode: Setter<string>
	defaultTheme?: ThemeKey
	showLineNumber?: Accessor<boolean>
	formatOnMount?: Accessor<boolean>
}

export const Editor = ({
	code,
	setCode,
	defaultTheme,
	showLineNumber,
	formatOnMount = () => true
}: EditorProps) => {
	const {
		ref: EditorRef,
		createExtension,
		editorView
	} = createCodeMirror({
		onValueChange: setCode,
		value: code()
	})

	//this function does a heavy string compare
	createEditorControlledValue(editorView, code)
	createShortcut(
		['Alt', 'Shift', 'F'],
		async () => {
			console.log('alt shift f', editorView())
			const formatted = await formatCode(code())
			setCode(formatted)
		},
		{ preventDefault: true, requireReset: true }
	)
	createShortcut(
		['Alt', 'Shift', 'F'],
		async () => {
			console.log('alt shift f', editorView())
			const formatted = await formatCode(code())
			setCode(formatted)
		},
		{ preventDefault: true, requireReset: true }
	)
	createShortcut(
		['Alt', 'Shift', 'Ï'],
		async () => {
			console.log('alt shift f', editorView())
			const formatted = await formatCode(code())
			setCode(formatted)
		},
		{ preventDefault: true, requireReset: true }
	)

	const key = useKeyDownList()
	createEffect(() => {
		console.log(key())
	})

	createDefaultExtensions(createExtension, showLineNumber)
	defaultTheme && setTheme(defaultTheme)
	onMount(async () => {
		if (formatOnMount()) {
			//maybe add a blocking before mount
			setCode(await formatCode(code()))
		}
	})

	return <div ref={EditorRef} />
}
