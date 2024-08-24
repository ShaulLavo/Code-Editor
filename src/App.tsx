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
import fs from 'indexeddb-fs'
import {
	For,
	Setter,
	batch,
	createEffect,
	createMemo,
	createResource,
	createSignal,
	type Component
} from 'solid-js'
import {
	Resizable,
	ResizableHandle,
	ResizablePanel
} from '~/components/ui/resizable'
import { Editor } from './Editor'
import { Header } from './components/Header'
import { StatusBar } from './StatusBar'
import { FileSystem } from './fileSystem/FileSystem'
import {
	Node,
	findItem,
	getFileSystemStructure,
	isFile,
	traverseAndSetOpen
} from './fileSystem/fileSystem.service'
import {
	currentPath,
	loadTabData,
	saveTabData,
	setCurrentPath
} from './stores/fsStore'
import { currentBackground, currentColor } from './stores/themeStore'
import { EditorTabs } from './components/EditorTabs'

const App: Component = () => {
	const fileMap = new ReactiveMap<string, string>()
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
		saveTabData(fileMap)
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
				<ResizablePanel initialSize={0.3}>
					<FileSystem traversedNodes={traversedNodes} />
				</ResizablePanel>
				<ResizableHandle class={' bg-gray-600'} />
				<ResizablePanel initialSize={0.7}>
					<div>
						<EditorTabs
							currentNode={currentNode}
							fileMap={fileMap}
							setCurrentPath={setCurrentPath}
						/>
						<Editor code={code} setCode={setCode} />
					</div>
				</ResizablePanel>
			</Resizable>

			<StatusBar />
		</main>
	)
}

export default App
