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
import {
	Accessor,
	For,
	Resource,
	Setter,
	batch,
	createEffect,
	createSignal,
	onMount
} from 'solid-js'
import { extensionMap, formatCode } from '~/format'
import { createEditorControlledValue } from '~/hooks/controlledValue'
import { createCompartmentExtension } from '~/hooks/createCompartmentExtension'
import {
	editorHight,
	editorRef,
	isMiniMap,
	setCurrentColumn,
	setCurrentLine,
	setCurrentSelection,
	setEditorHight,
	setEditorRef,
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

import { createInnerZoom } from '~/hooks/createInnerZoom'
//@ts-ignore no types :(
import rainbowBrackets from 'rainbowbrackets'
import { useEditorFS } from '~/context/FsContext'
import { worker } from '~/modules/main/Main'
import { autoHide } from '~/utils/dom'
import { createKeymap } from '~/utils/keymap'
import { EditorNav } from './EditorNav'

export interface EditorProps {
	code:
		| Accessor<string>
		| Resource<string | undefined>
		| (() => string | undefined)
	setCode: Setter<string | undefined>
	defaultTheme?: ThemeKey
	formatOnMount?: Accessor<boolean>
	size: Readonly<NullableSize>
	isWorkerReady: Accessor<boolean>
}

export const Editor = ({
	code,
	setCode,
	defaultTheme,
	formatOnMount,
	size,
	isWorkerReady
}: EditorProps) => {
	const editorFS = useEditorFS()
	const { currentPath, prettierConfig, currentExtension, isTs, filePath } =
		editorFS
	// useShortcuts(code, setCode, currentExtension)

	const { fontSize } = createInnerZoom({
		ref: editorRef,
		key: 'editor'
	})
	const [editorView, setView] = createSignal<EditorView>(null!)
	const start = performance.now()
	// editorView().state.toJSON({foldState})
	const setupEditor = () => {
		const defaultKeymap = createKeymap(editorFS)
		const createColorCycler = () => {
			const colors = Object.values(bracketColors())
			let index = 0

			return () => {
				const color = colors[index]
				index = (index + 1) % colors.length // Cycle back to the start when reaching the end
				return color
			}
		}

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
			// EditorView.lineWrapping,
			keymap.of(defaultKeymap),
			javascript({ jsx: true, typescript: true }),
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
			})
		] as Extension[]
		const editorState = EditorState.create({
			doc: code(),
			extensions: baseExtensions
			// extensions: baseExtensions
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
					setEditorHight(Math.max(doc.lines * 13, 13))
					// if (doc.eq(view.state.doc)) return //??
					setCode(doc.toString())
				})
			}
		})
		view.setState(editorState)
		setView(view)
		console.info(
			`time to first paint: ${performance.now() - start} milliseconds`
		)

		formatOnMount?.() && formatCode(prettierConfig(), code, setCode)
		defaultTheme && setTheme(defaultTheme)

		return view
	}

	const createExtention = (extention: Accessor<Extension>) =>
		createCompartmentExtension(extention, editorView)

	createEditorControlledValue(editorView, code)
	createExtention(() => (showLineNumber?.() ? lineNumbers() : []))
	createExtention(currentTheme)
	createExtention(foldGutter)
	createExtention(() =>
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
	createExtention(() => {
		if (!isWorkerReady() || !worker || !isTs() || !filePath()) return []

		const tsExtensions = [
			tsFacetWorker.of({ worker, path: filePath()! }),
			tsSyncWorker(),
			tsLinterWorker(),
			tsHoverWorker()
		]
		return tsExtensions
	})
	createExtention(() =>
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
			<EditorNav />
			<div
				id="editor"
				class="w-full"
				style={{
					height: (size.height ?? editorHight()) - 40 + 'px'
				}}
				ref={ref => setEditorRef(ref)}
			/>
		</>
	)
}
