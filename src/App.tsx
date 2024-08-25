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
import { ReactiveMap } from '@solid-primitives/map'
import { createElementSize } from '@solid-primitives/resize-observer'
import { FitAddon } from '@xterm/addon-fit'
import { Terminal } from '@xterm/xterm'
import fs from 'indexeddb-fs'
import {
	createEffect,
	createMemo,
	createResource,
	createSignal,
	onMount,
	type Component
} from 'solid-js'
import {
	Resizable,
	ResizableHandle,
	ResizablePanel
} from '~/components/ui/resizable'
import { Editor } from './Editor'
import { StatusBar } from './StatusBar'
import { EditorTabs } from './components/EditorTabs'
import { Header } from './components/Header'
import { FileSystem } from './fileSystem/FileSystem'
import {
	findItem,
	getFileSystemStructure,
	isFile,
	traverseAndSetOpen
} from './fileSystem/fileSystem.service'
import {
	currentPath,
	loadTabData,
	saveTabs,
	setCurrentPath
} from './stores/fsStore'
import { currentBackground, currentColor, isDark } from './stores/themeStore'
import './xterm.css'
import { Xterm } from './Xterm'
const App: Component = () => {
	const fileMap = new ReactiveMap<string, string>()
	const [editorContainer, setEditorContainer] = createSignal<HTMLDivElement>(
		null!
	)
	const editorSize = createElementSize(editorContainer)
	createResource(() => loadTabData(fileMap)) // could just keep the paths an preload them
	const [headerRef, setHeaderRef] = createSignal<HTMLDivElement>(null!)
	let container: HTMLElement = null!
	const size = createElementSize(headerRef)

	const [nodes, { refetch }] = createResource(() =>
		getFileSystemStructure('root')
	)

	const currentNode = () =>
		nodes() ? findItem(currentPath(), nodes()!) : undefined

	const filePath = () => (isFile(currentNode) ? currentPath() : undefined)

	const [code, { mutate: setCode }] = createResource(filePath, async path => {
		if (!path) return ''
		if (fileMap.has(path)) return fileMap.get(path)
		const file = (await fs.readFile(path)) as string
		fileMap.set(path, file)
		saveTabs(fileMap.keys())
		return file
	})

	const traversedNodes = createMemo(() =>
		nodes.loading
			? []
			: traverseAndSetOpen(nodes()!, currentPath().split('/').filter(Boolean))
	)
	createEffect(() => {
		if (code() === undefined || code() === '') return
		if (!currentPath()) return
		fs.writeFile(currentPath(), code())
	})
	createEffect(() => {
		console.log('height', editorSize.height)
		console.log('width', editorSize.width)
	})
	return (
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
			<div style={{ 'padding-bottom': `${size.height}px` }}>
				<Header
					code={code}
					setCode={setCode}
					refetch={refetch}
					setHeaderRef={setHeaderRef}
				/>
			</div>
			<Resizable
				class="w-full flex"
				style={{
					'background-color': currentBackground(),
					color: currentColor()
				}}
				orientation="horizontal"
			>
				<ResizablePanel class="overflow-hidden" initialSize={0.25}>
					<FileSystem traversedNodes={traversedNodes} />
				</ResizablePanel>
				<ResizableHandle class={isDark() ? ' bg-gray-800' : 'bg-gray-200'} />
				<ResizablePanel class="overflow-hidden" initialSize={0.7}>
					<Resizable
						class="w-full flex"
						style={{
							'background-color': currentBackground(),
							color: currentColor()
						}}
						orientation="vertical"
					>
						<ResizablePanel
							ref={setEditorContainer}
							class="overflow-hidden"
							initialSize={0.7}
						>
							<div class="">
								<EditorTabs
									currentNode={currentNode}
									fileMap={fileMap}
									setCurrentPath={setCurrentPath}
								/>
								<Editor code={code} setCode={setCode} size={editorSize} />
							</div>
						</ResizablePanel>
						<ResizableHandle
							class={isDark() ? ' bg-gray-800' : 'bg-gray-200'}
						/>
						<ResizablePanel class="overflow-hidden" initialSize={0.3}>
							<Xterm />
						</ResizablePanel>
					</Resizable>
				</ResizablePanel>
			</Resizable>
			{/* <EditorTabs
				currentNode={currentNode}
				fileMap={fileMap}
				setCurrentPath={setCurrentPath}
			/>
			<Editor code={code} setCode={setCode} /> */}
			<StatusBar />
		</main>
	)
}

export default App
