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
import { Terminal } from './Terminal'
import { EditorTabs } from './components/EditorTabs'
import { Header } from './components/Header'
import { FileSystem } from './fileSystem/FileSystem'
import {
	findItem,
	getFileSystemStructure,
	getFirstDirOrParent,
	isFile,
	isFolder,
	sanitizeFilePath,
	traverseAndSetOpen
} from './fileSystem/fileSystem.service'

import { currentBackground, currentColor, isDark } from './stores/themeStore'
import './xterm.css'
import { downloadNerdFont } from './utils/font'
import { makePersisted, cookieStorage } from '@solid-primitives/storage'
import { Formmater, extensionMap, getConfigFromExt } from './format'
import { editorFS } from './stores/fsStore'

const App: Component = () => {
	const {
		currentPath,
		fs,
		loadTabData,
		saveTabs,
		setCurrentPath,
		currentExtension
	} = editorFS
	const [horizontalPanelSize, setHorizontalPanelSize] = makePersisted(
		createSignal<number[]>([0.25, 0.75]),
		{ name: 'horizontalPanelSize' }
	)
	const [verticalPanelSize, setVerticalPanelSize] = makePersisted(
		createSignal<number[]>([0.7, 0.3]),
		{ name: 'verticalPanelSize' }
	)
	const [editorContainer, setEditorContainer] = createSignal<HTMLDivElement>(
		null!
	)

	const editorSize = createElementSize(editorContainer)
	const [headerRef, setHeaderRef] = createSignal<HTMLDivElement>(null!)
	let container: HTMLElement = null!
	const size = createElementSize(headerRef)

	const [nodes, { refetch, mutate }] = createResource(() =>
		getFileSystemStructure('root', fs)
	)

	const fileMap = new ReactiveMap<string, string>()
	createResource(() => loadTabData(fileMap))
	const prettierConfig = () => getConfigFromExt(currentExtension())
	const currentNode = () =>
		nodes() ? findItem(currentPath(), nodes()!) : undefined
	const dirPath = () =>
		nodes() ? getFirstDirOrParent(currentPath(), nodes()!) : undefined

	const filePath = () => (isFile(currentNode) ? currentPath() : undefined)
	const isTs = () =>
		extensionMap[currentExtension() as keyof typeof extensionMap] ===
		'typescript'

	const [code, { mutate: setCode }] = createResource(filePath, async path => {
		if (!path) return ''
		if (fileMap.has(path)) return fileMap.get(path)
		let file = (await fs.readFile(sanitizeFilePath(path))) as string
		if (isTs()) {
			file = await Formmater.prettier(file, prettierConfig())
		}
		fileMap.set(path, file)
		try {
			await saveTabs(fileMap.keys())
		} catch (e) {
			console.error(e)
		}
		return file
	})
	const currentFile = () => fileMap.get(currentPath())
	const traversedNodes = createMemo(() =>
		nodes.loading
			? []
			: traverseAndSetOpen(nodes()!, currentPath().split('/').filter(Boolean))
	)

	onMount(async () => {
		document.fonts.ready.then(fontFaceSet => {
			const fontFaces = [...fontFaceSet]
		})
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
					currentExtension={currentExtension as () => string}
					fs={fs}
					clearTabs={editorFS.clearTabs}
					setCurrentPath={setCurrentPath}
				/>
			</div>
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
					<FileSystem
						traversedNodes={traversedNodes}
						currentPath={currentPath}
						setCurrentPath={setCurrentPath}
					/>
				</ResizablePanel>
				<ResizableHandle class={isDark() ? ' bg-gray-800' : 'bg-gray-200'} />
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
								<EditorTabs
									fileMap={fileMap}
									filePath={filePath}
									setCurrentPath={setCurrentPath}
								/>
								<Editor
									code={code}
									setCode={setCode}
									size={editorSize}
									currentExtension={currentExtension}
									currentPath={currentPath}
									prettierConfig={prettierConfig}
									isTs={isTs}
								/>
							</div>
						</ResizablePanel>
						<ResizableHandle
							class={isDark() ? ' bg-gray-800' : 'bg-blue-200'}
						/>
						<ResizablePanel
							class="overflow-hidden p-2"
							initialSize={verticalPanelSize()[1]}
						>
							<Terminal dirPath={dirPath} />
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
			<StatusBar isTs={isTs} />
		</main>
	)
}

export default App
