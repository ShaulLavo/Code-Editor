//TODO: use OPFS as FS (maybe make the same wrapper for both idxDB and OPFS)
//TODO: add resizable panes
//TODO: add drag and drop to FS
//TODO: add drag And drop to tabs
//TODO: add a tetminal connect it to FS with basic commands (ls, cd, mkdir, touch, rm, cat, echo, clear, pwd, help)
//TODO: add npm https://github.com/naruaway/npm-in-browser
//TODO: add bundler in browser ??
//TODO: run the code (quickjs? but polyfill the enterie DOM, just eval?)
//TODO: ??
//TODO: proft
import { createElementSize } from '@solid-primitives/resize-observer'
import {
	For,
	Show,
	batch,
	createEffect,
	createMemo,
	createResource,
	createSignal,
	onCleanup,
	onMount,
	useContext,
	type Component
} from 'solid-js'
import {
	Resizable,
	ResizableHandle,
	ResizablePanel
} from '~/components/ui/resizable'
import { Editor } from './Editor'
import { StatusBar } from './StatusBar'
import { Terminal } from './Terminal'
import { EditorTabs } from './components/EditorTabs'
import { Header } from './components/Header'
import { FileSystem } from './fileSystem/FileSystem'
import {
	findItem,
	getFileSystemStructure,
	getFirstDirOrParent,
	isFile,
	sanitizeFilePath,
	traverseAndSetOpen
} from './fileSystem/fileSystem.service'
import { toast } from 'solid-sonner'
import {
	ColorModeProvider,
	ColorModeScript,
	createLocalStorageManager,
	useColorMode
} from '@kobalte/core'
import { makePersisted } from '@solid-primitives/storage'
import {
	EditorFSContext,
	EditorFSProvider,
	TerminalFSProvider
} from './context/FsContext'
import { Formmater, extensionMap, getConfigFromExt } from './format'
import {
	baseFontSize,
	currentBackground,
	currentColor,
	isDark,
	bracketColors
} from './stores/themeStore'
import './xterm.css'
import { CmdK } from './components/CmdK'
import { initTsWorker } from './utils/worker'
import { WorkerShape } from '@valtown/codemirror-ts/worker'
import { Remote } from 'comlink'
import ts from 'typescript'

export let worker: WorkerShape & Remote<ts.System> & { close: () => void } =
	null!
const Main: Component = () => {
	const {
		currentExtension,
		code,
		setCode,
		refetch,
		traversedNodes,
		filePath,
		prettierConfig,
		isTs,
		openPaths
	} = useContext(EditorFSContext)

	const [isWorkerReady, setIsWorkerReady] = createSignal(false)
	initTsWorker(async tsWorker => {
		worker = tsWorker
		console.log('worker ready')
		setIsWorkerReady(true)
	})

	const [horizontalPanelSize, setHorizontalPanelSize] = makePersisted(
		createSignal<number[]>([0.25, 0.75]),
		{ name: 'horizontalPanelSize' }
	)
	const [verticalPanelSize, setVerticalPanelSize] = makePersisted(
		createSignal<number[]>([0.7, 0.3]),
		{ name: 'verticalPanelSize' }
	)
	let container: HTMLElement = null!
	const [editorContainer, setEditorContainer] = createSignal<HTMLDivElement>(
		null!
	)
	const [terminalContainer, setTerminalContainer] =
		createSignal<HTMLDivElement>(null!)
	const [statusBarRef, setStatusBarRef] = createSignal<HTMLDivElement>(null!)
	const editorSize = createElementSize(editorContainer)
	const terminalContainerSize = createElementSize(terminalContainer)
	const statusBarSize = createElementSize(statusBarRef)

	onMount(async () => {
		document.fonts.ready.then(fontFaceSet => {
			const fontFaces = [...fontFaceSet]
		})
	})

	const { setColorMode } = useColorMode()
	createEffect(() => {
		setColorMode(isDark() ? 'dark' : 'light')
	})
	return (
		<>
			<CmdK code={code} setCode={setCode} refetch={refetch} />

			<main
				ref={container}
				class="dockview-theme-dark"
				style={{
					'font-family': 'JetBrains Mono, monospace',
					height: '100vh',
					overflow: 'hidden',
					'background-color': currentBackground()
				}}
			>
				<Resizable
					onSizesChange={size => {
						if (size.length !== 2) return
						if (size[0] === 0.5 && size[1] === 0.5) return

						setHorizontalPanelSize(size)
					}}
					class="w-full flex"
					style={{
						'background-color': currentBackground(),
						color: currentColor()
					}}
					orientation="horizontal"
				>
					<ResizablePanel
						class="overflow-x-hidden"
						initialSize={horizontalPanelSize()?.[0]}
					>
						<FileSystem traversedNodes={traversedNodes} />
					</ResizablePanel>
					<ResizableHandle class={isDark() ? 'bg-gray-800' : 'bg-gray-200'} />
					<ResizablePanel
						class="overflow-hidden"
						initialSize={horizontalPanelSize()?.[1]}
					>
						<Resizable
							onSizesChange={size => {
								if (size.length !== 2) return
								if (size[0] === 0.5 && size[1] === 0.5) return
								setVerticalPanelSize(size)
							}}
							class="w-full"
							style={{
								'background-color': currentBackground(),
								color: currentColor()
							}}
							orientation="vertical"
						>
							<ResizablePanel
								ref={setEditorContainer}
								class="overflow-hidden"
								initialSize={verticalPanelSize()[0]}
							>
								<div class="">
									<EditorTabs filePath={filePath} />
									<Editor
										code={code}
										setCode={setCode}
										size={editorSize}
										isWorkerReady={isWorkerReady}
									/>
								</div>
							</ResizablePanel>
							<ResizableHandle
								class={isDark() ? 'bg-gray-800' : 'bg-gray-200'}
							/>
							<ResizablePanel
								class="overflow-hidden p-2"
								initialSize={verticalPanelSize()[1]}
								ref={setTerminalContainer}
							>
								<Terminal size={terminalContainerSize} />
							</ResizablePanel>
						</Resizable>
					</ResizablePanel>
				</Resizable>

				<StatusBar ref={setStatusBarRef} isTs={isTs} />
			</main>
		</>
	)
}

const App: Component = () => {
	const storageManager = createLocalStorageManager('vite-ui-theme')
	const setCSSVariable = (varName: string, color: string) => {
		if (!varName.startsWith('--')) {
			varName = `--${varName}`
		}

		document.documentElement.style.setProperty(varName, color)
	}
	createEffect(() => {
		setCSSVariable('--current-color', currentColor())
		setCSSVariable('--current-background', currentBackground())

		if (bracketColors()) {
			for (const [key, color] of Object.entries(bracketColors())) {
				setCSSVariable('--rainbow-bracket-' + key, color as string)
			}
		}
	})

	createEffect(() => {
		const fontSize = `${baseFontSize()}px`
		document.documentElement.style.fontSize = fontSize
	})
	return (
		<EditorFSProvider>
			<TerminalFSProvider>
				<ColorModeScript storageType={storageManager.type} />
				<ColorModeProvider storageManager={storageManager}>
					<Main />
				</ColorModeProvider>
			</TerminalFSProvider>
		</EditorFSProvider>
	)
}

export default App
