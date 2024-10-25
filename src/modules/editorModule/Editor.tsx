import { closeBrackets } from '@codemirror/autocomplete'
import { history } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import {
	bracketMatching,
	foldGutter,
	indentOnInput
} from '@codemirror/language'
import { highlightSelectionMatches } from '@codemirror/search'
import { EditorState, Extension } from '@codemirror/state'
import {
	EditorView,
	drawSelection,
	highlightActiveLine,
	highlightActiveLineGutter,
	highlightSpecialChars,
	keymap,
	lineNumbers,
	rectangularSelection
} from '@codemirror/view'
import { indentationMarkers } from '@replit/codemirror-indentation-markers'
import { showMinimap } from '@replit/codemirror-minimap'
import {
	tsFacetWorker,
	tsHoverWorker,
	tsLinterWorker,
	tsSyncWorker
} from '@valtown/codemirror-ts'
import { Accessor, batch, createEffect, createSignal, onMount } from 'solid-js'
import { extensionMap, formatCode, setFormatter } from '~/format'
import { createEditorControlledValue } from '~/hooks/controlledValue'
import { createCompartmentExtension } from '~/hooks/createCompartmentExtension'
import {
	editorHight,
	editorRefs,
	isMiniMap,
	setCurrentColumn,
	setCurrentLine,
	setCurrentSelection,
	setEditorHight,
	setIsTsLoading,
	showLineNumber
} from '~/stores/editorStore'
import {
	ThemeKey,
	bracketColors,
	currentBackground,
	currentTheme,
	setTheme
} from '~/stores/themeStore'

import { NullableSize } from '@solid-primitives/resize-observer'

// import { createInnerZoom } from '~/hooks/createInnerZoom'
import { html } from '@codemirror/lang-html'
import { json } from '@codemirror/lang-json'
import { python } from '@codemirror/lang-python'
//@ts-ignore no types :(
import rainbowBrackets from 'rainbowbrackets'
import { useFs } from '~/context/FsContext'
import { createInnerZoom } from '~/hooks/createInnerZoom'
import { viewTransition } from '~/hooks/viewTransition'
import { autoHide } from '~/lib/dom'
import { createKeymap } from '~/lib/keymap'
import { worker } from '~/modules/main/Main'
import { setCurrentEditorIndex } from '~/stores/appStateStore'
import { EditorNav } from './EditorNav'
export interface EditorProps {
	defaultTheme?: ThemeKey
	formatOnMount?: Accessor<boolean>
	size: Readonly<NullableSize>
	isWorkerReady: Accessor<boolean>
	index: number
	extraKeyBindings?: Record<string, () => boolean>
}

export const Editor = ({
	defaultTheme,
	formatOnMount,
	size,
	isWorkerReady,
	index,
	extraKeyBindings
}: EditorProps) => {
	const editorFS = useFs('editor-' + index)

	const {
		currentPath,
		prettierConfig,
		currentExtension,
		isTs,
		isPython,
		isJSON,
		isHtml,
		filePath,
		code,
		setCode
	} = editorFS

	const { fontSize } = createInnerZoom({
		ref: () => editorRefs[index],
		key: 'editor'
	})
	const [editorView, setView] = createSignal<EditorView>(null!)
	const start = performance.now()
	const setupEditor = () => {
		const KeyBindings = Object.entries(extraKeyBindings ?? {}).map(
			([key, fn]) => ({
				key,
				run: fn,
				preventDefault: true
			})
		)
		console.log(KeyBindings)
		const defaultKeymap = createKeymap(editorFS, KeyBindings)
		const createColorCycler = () => {
			const colors = Object.values(bracketColors())
			let index = 0

			return () => {
				const color = colors[index]
				index = (index + 1) % colors.length // Cycle back to the start when reaching the end
				return color
			}
		}
		const focusExtension = EditorView.focusChangeEffect.of((state, focus) => {
			if (focus) {
				viewTransition(() => setCurrentEditorIndex(index))
				// setCurrentEditorIndex(index)
			}
			return null
		})
		const getBracketColor = createColorCycler()
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
			keymap.of(defaultKeymap),
			bracketMatching(),
			rainbowBrackets(),
			highlightActiveLineGutter(),
			indentationMarkers({
				hideFirstIndent: true,
				markerType: 'codeOnly',
				colors: {
					light: getBracketColor(),
					dark: getBracketColor(),
					activeLight: getBracketColor(),
					activeDark: getBracketColor()
				}
			}),
			focusExtension
		] as Extension[]

		const editorState = EditorState.create({
			doc: code(),
			extensions: baseExtensions
		})

		const view = new EditorView({
			parent: editorRefs[index],
			dispatch: (transaction, view) => {
				view.update([transaction])

				batch(() => {
					const { state } = view
					const { selection, doc } = state
					const { main } = selection

					const line = doc.lineAt(main.head)
					const selectionText = state.sliceDoc(main.from, main.to)
					setCurrentSelection(selectionText)
					setCurrentLine(line.number)
					setCurrentColumn(main.head - line.from)
					setEditorHight(Math.max(doc.lines * 13, 13))
					setCode(doc.toString())
				})
			}
		})
		view.setState(editorState)
		setView(view)

		formatOnMount?.() && formatCode(prettierConfig(), code, setCode)
		defaultTheme && setTheme(defaultTheme)

		console.info(
			`time to first paint: ${performance.now() - start} milliseconds`
		)
		return view
	}

	const createExtension = (extension: Accessor<Extension>) =>
		createCompartmentExtension(extension, editorView)

	createEditorControlledValue(editorView, code)
	createExtension(() =>
		isTs() ? javascript({ jsx: true, typescript: true }) : []
	)
	createExtension(() => (isPython() ? python() : []))
	createExtension(() => (isJSON() ? json() : []))
	createExtension(() =>
		isHtml()
			? html({
					autoCloseTags: true,
					matchClosingTags: true,
					selfClosingTags: true
				})
			: []
	)
	createExtension(() => (showLineNumber?.() ? lineNumbers() : []))
	createExtension(currentTheme)
	createExtension(foldGutter)
	createExtension(() =>
		showMinimap.compute([], () => {
			return isMiniMap()
				? {
						create: () => {
							const minimap = document.createElement('div')
							autoHide(minimap)
							return { dom: minimap }
						},
						showOverlay: 'mouse-over',
						displayText: 'blocks'
					}
				: null
		})
	)
	createExtension(() => {
		if (!isTs() || !isWorkerReady() || !worker || !filePath()) return []

		const tsExtensions = [
			tsFacetWorker.of({ worker: worker as any, path: filePath()! }),
			tsSyncWorker(),
			tsLinterWorker(),
			tsHoverWorker()
		]
		return tsExtensions
	})
	createExtension(() =>
		EditorView.theme({
			'.cm-content': {
				fontSize: fontSize() + 'pt'
			},
			'.cm-gutters': {
				fontSize: fontSize() + 'pt',
				backgroundColor: currentBackground()
			}
		})
	)
	createEffect(() => {
		if (isTs()) setFormatter('prettier')
		if (isPython()) setFormatter('python')
	})
	createEffect(() => {
		//@ts-ignore
		if (extensionMap[currentExtension()] === 'typescript') {
			setIsTsLoading(true)
		}
	})

	onMount(() => {
		setupEditor()
	})

	return (
		<>
			<EditorNav index={index} />
			<div
				// id="editor"
				class="w-full"
				style={{
					height: (size.height ?? editorHight()) - 40 + 'px'
				}}
				ref={ref => editorRefs.push(ref)}
			/>
		</>
	)
}
