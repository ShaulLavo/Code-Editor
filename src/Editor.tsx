import { closeBrackets } from '@codemirror/autocomplete'
import { history } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import { bracketMatching, indentOnInput } from '@codemirror/language'
import { highlightSelectionMatches } from '@codemirror/search'
import { EditorState } from '@codemirror/state'
import {
	EditorView,
	drawSelection,
	highlightActiveLine,
	highlightSpecialChars,
	keymap,
	lineNumbers,
	rectangularSelection
} from '@codemirror/view'
import { showMinimap } from '@replit/codemirror-minimap'
import { createShortcut, useKeyDownList } from '@solid-primitives/keyboard'
import {
	tsFacetWorker,
	tsHoverWorker,
	tsLinterWorker,
	tsSyncWorker
} from '@valtown/codemirror-ts'
import { type WorkerShape } from '@valtown/codemirror-ts/worker'
import * as Comlink from 'comlink'
import {
	Accessor,
	Setter,
	createEffect,
	createSignal,
	onCleanup,
	onMount
} from 'solid-js'
import { createEditorControlledValue } from './hooks/controlledValue'
import { createCompartmentExtension } from './hooks/createCompartmentExtension'
import { refs, showLineNumber } from './editorStore'
import { formatter } from './format'
import { ThemeKey, currentTheme, setTheme } from './themeStore'
import { defaultKeymap } from './utils/keymap'
import { useShortcuts } from './hooks/useShortcuts'

import { makeEventListener } from '@solid-primitives/event-listener'

export interface EditorProps {
	code: Accessor<string>
	setCode: Setter<string>
	defaultTheme?: ThemeKey
	formatOnMount?: Accessor<boolean>
}
interface Worker extends WorkerShape {
	close: () => void
}

export const Editor = ({
	code,
	setCode,
	defaultTheme,

	formatOnMount = () => true
}: EditorProps) => {
	useShortcuts(code, setCode)
	const [editorView, setView] = createSignal<EditorView>(null!)

	const start = performance.now()

	const baseExtensions = [
		highlightSpecialChars(),
		history(),
		drawSelection(),
		EditorState.allowMultipleSelections.of(true),
		indentOnInput(),
		bracketMatching(),
		closeBrackets(),
		rectangularSelection(),
		highlightActiveLine(),
		highlightSelectionMatches(),
		EditorView.lineWrapping,
		keymap.of(defaultKeymap),
		javascript({ jsx: true, typescript: true }),
		currentTheme()
	]

	createEffect(() => {
		console.log('code', showLineNumber())
	})

	const setupEditor = () => {
		const editorState = EditorState.create({
			doc: code(),
			extensions: baseExtensions
		})

		const view = new EditorView({
			parent: refs.editor,
			dispatch: (transaction, view) => {
				view.update([transaction])
				const { state } = view
				const { selection, doc } = state
				const { main } = selection

				const line = doc.lineAt(main.head).number
				const column = main.head - doc.lineAt(main.head).from

				console.log(`line: ${line}, column: ${column}`)
				setCode(state.doc.toString())
			}
		})
		view.setState(editorState)
		setView(view)
		autoHide(refs.miniMap)
		console.log(
			`time to first paint: ${performance.now() - start} milliseconds`
		)

		formatOnMount() && formatCode()
		defaultTheme && setTheme(defaultTheme)

		return view
	}

	const initWorker = async (view: EditorView) => {
		const innerWorker = new Worker(new URL('./worker.ts', import.meta.url), {
			type: 'module'
		})
		const worker = Comlink.wrap<Worker>(innerWorker)
		onCleanup(() => worker.close())

		innerWorker.onmessage = async e => {
			if (e.data === 'ready') {
				await worker.initialize()
				// view.state.update({
				// 	extensions: [
				// 		tsFacetWorker.of({ worker, path: 'index.ts' }),
				// 		tsSyncWorker(),
				// 		tsLinterWorker(),
				// 		tsHoverWorker()
				// 	]
				// })
				view.setState(
					EditorState.create({
						doc: code(),
						extensions: [
							tsFacetWorker.of({ worker, path: 'index.ts' }),
							tsSyncWorker(),
							tsLinterWorker(),
							tsHoverWorker(),
							showMinimap.compute([], () => {
								return {
									create: () => ({ dom: refs.miniMap }),
									showOverlay: 'mouse-over',
									displayText: 'blocks'
								}
							})
						].concat(baseExtensions)
					})
				)
				console.log(
					`time for TS worker to load: ${performance.now() - start} milliseconds`
				)
			}
		}
	}

	const formatCode = async () => {
		const formatted = await formatter()(code())
		setCode(formatted)
	}

	const autoHide = (el: HTMLElement) => {
		let isVisible = false
		let rect = el.getBoundingClientRect()
		const showOnHover = (event: MouseEvent) => {
			const newRect = el.getBoundingClientRect()
			if (newRect.width) rect = newRect

			const isMouseOverElement =
				event.clientX >= rect.left &&
				event.clientX <= rect.right &&
				event.clientY >= rect.top &&
				event.clientY <= rect.bottom

			if (isMouseOverElement && !isVisible) {
				el.style.display = 'block'
				el.style.opacity = '1'
				isVisible = true
			} else if (!isMouseOverElement && isVisible) {
				el.style.display = 'none'
				el.style.opacity = '0'
				isVisible = false
			}
		}
		window.addEventListener('mousemove', showOnHover)
		onCleanup(() => window.removeEventListener('mousemove', showOnHover))
	}

	onMount(() => {
		const view = setupEditor()
		initWorker(view)
	})
	createCompartmentExtension(currentTheme, editorView)
	createCompartmentExtension(
		() => (showLineNumber?.() ? lineNumbers() : []),
		editorView
	)
	createEditorControlledValue(editorView, code)

	return (
		<>
			<div id="editor" class="pt-10 " ref={refs.editor} />

			<div id="minimap" class="transition-display -z-50" ref={refs.miniMap} />
		</>
	)
}
