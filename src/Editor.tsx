import { closeBrackets } from '@codemirror/autocomplete'
import { history } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import { bracketMatching, indentOnInput } from '@codemirror/language'
import { highlightSelectionMatches } from '@codemirror/search'
import { EditorState, Extension, StateEffect } from '@codemirror/state'
import {
	EditorView,
	drawSelection,
	gutter,
	highlightActiveLine,
	highlightSpecialChars,
	keymap,
	lineNumbers,
	rectangularSelection
} from '@codemirror/view'
import { showMinimap } from '@replit/codemirror-minimap'
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
	Resource,
	Setter,
	batch,
	createEffect,
	createSignal,
	onCleanup,
	onMount
} from 'solid-js'
import { formatter } from './format'
import { createEditorControlledValue } from './hooks/controlledValue'
import {
	createCompartmentExtension,
	useExtension
} from './hooks/createCompartmentExtension'
import { useShortcuts } from './hooks/useShortcuts'
import {
	editorHight,
	editorRef,
	setCurrentColumn,
	setCurrentLine,
	setCurrentSelection,
	setEditorHight,
	setEditorRef,
	showLineNumber
} from './stores/editorStore'
import { ThemeKey, currentTheme, setTheme } from './stores/themeStore'
import { defaultKeymap } from './utils/keymap'

import { NullableSize } from '@solid-primitives/resize-observer'
import { Remote } from 'comlink'
import ts from 'typescript'
import { currentExtension, currentPath } from './stores/fsStore'

export interface EditorProps {
	code: Accessor<string> | Resource<string | undefined>
	setCode: Setter<string | undefined>
	defaultTheme?: ThemeKey
	formatOnMount?: Accessor<boolean>
	size: Readonly<NullableSize>
}

type Worker = WorkerShape &
	Remote<ts.System> & {
		close: () => void
	}

export const Editor = ({
	code,
	setCode,
	defaultTheme,
	formatOnMount,
	size
}: EditorProps) => {
	useShortcuts(code, setCode)
	const [editorView, setView] = createSignal<EditorView>(null!)
	const [worker, setWorker] = createSignal<Worker>(null!)
	const start = performance.now()
	let miniMapShown = false
	const baseExtensions = [
		highlightSpecialChars(),
		history(),
		drawSelection(),
		EditorState.allowMultipleSelections.of(true),
		indentOnInput(),
		bracketMatching(),
		closeBrackets(),
		gutter({ class: 'gutter' }),
		rectangularSelection(),
		highlightActiveLine(),
		highlightSelectionMatches(),
		EditorView.lineWrapping,
		keymap.of(defaultKeymap),
		javascript({ jsx: true, typescript: true })
	]

	const setupEditor = () => {
		const editorState = EditorState.create({
			doc: code(),
			extensions: baseExtensions
		})

		const view = new EditorView({
			parent: editorRef(),
			dispatch: (transaction, view) => {
				view.update([transaction])
				batch(() => {
					const { state } = view
					const { selection, doc } = state
					const { main } = selection
					const line = doc.lineAt(main.head)
					// lastLine.number
					// const lineContents = view.state.sliceDoc(line.from, line.to)
					const selectionText = state.sliceDoc(main.from, main.to)
					setCurrentSelection(selectionText)
					setCurrentLine(line.number)
					setCurrentColumn(main.head - line.from)
					setCode(doc.toString())
					setEditorHight(Math.max(doc.lines * 13, 13))
				})
			}
		})
		view.setState(editorState)
		setView(view)
		// autoHide(refs.miniMap)
		console.log(
			`time to first paint: ${performance.now() - start} milliseconds`
		)

		formatOnMount?.() && formatCode()
		defaultTheme && setTheme(defaultTheme)

		return view
	}
	const createExtention = (
		extention: Extension | Accessor<Extension | undefined>
	) => createCompartmentExtension(extention, editorView)
	const initWorker = async (view: EditorView) => {
		const innerWorker = new Worker(new URL('./worker.ts', import.meta.url), {
			type: 'module'
		})
		const worker = Comlink.wrap<Worker>(innerWorker)
		onCleanup(() => worker.close())

		innerWorker.onmessage = async e => {
			if (e.data === 'ready') {
				await worker.initialize()
				setWorker(() => worker)

				console.log(
					`time for TS worker to load: ${performance.now() - start} milliseconds`
				)
			}
		}
	}
	createExtention(currentTheme())

	createEffect(() => {
		if (editorView() === null || worker() === null) return
		if (currentExtension() === 'ts' || currentExtension() === 'tsx') {
			editorView().dispatch({
				effects: StateEffect.reconfigure.of(
					[
						tsFacetWorker.of({ worker: worker(), path: currentPath() }),
						tsSyncWorker(),
						tsLinterWorker(),
						tsHoverWorker()
					].concat(baseExtensions)
				)
			})
		} else {
			editorView().dispatch({
				effects: StateEffect.reconfigure.of(baseExtensions)
			})
		}
		useExtension(
			showMinimap.compute([], () => {
				return {
					create: () => {
						const minimap = document.createElement('div')
						// autoHide(minimap)
						return { dom: minimap }
					},
					showOverlay: 'mouse-over',
					displayText: 'blocks'
				}
			}),
			editorView
		)

		useExtension(showLineNumber?.() ? lineNumbers() : [], editorView)
		useExtension(currentTheme(), editorView)
	})
	createEditorControlledValue(editorView, code)

	const formatCode = async () => {
		const formatted = await formatter()(code()!)
		setCode(formatted)
	}

	const autoHide = (el: HTMLElement) => {
		el.classList.add('transition-display')
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
		// editorRef().style.lineHeight = '1.5'
	})

	return (
		<>
			<div
				id="editor"
				class="w-full"
				style={{ height: (size.height ?? editorHight()) + 'px' }}
				ref={ref => setEditorRef(ref)}
			/>
		</>
	)
}
