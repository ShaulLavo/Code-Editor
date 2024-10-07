import { ReactiveMap } from '@solid-primitives/map'
import { makePersisted } from '@solid-primitives/storage'
import {
	Accessor,
	createContext,
	createEffect,
	createMemo,
	createResource,
	createSignal,
	JSX,
	Resource,
	Setter,
	useContext
} from 'solid-js'
import { unwrap } from 'solid-js/store'
import {
	EDITOR_FS_NAME,
	EDITOR_PATH_KEY,
	EDITOR_TAB_KEY,
	TERMINAL_FS_NAME,
	TERMINAL_PATH_KEY,
	TERMINAL_TAB_KEY
} from '~/constants/constants'
import {
	findNode,
	isFile,
	loadTabData,
	Node,
	saveTabs,
	traverseAndSetOpen
} from '~/modules/fileSystem/fileSystem.service'
import { extensionMap, Formmater, getConfigFromExt } from '~/format'
import { OPFS } from '~/FS/OPFS'
import { createDeepSignal } from '~/lib/utils'
export interface FileSystemCtx {
	fs: Resource<OPFS | undefined>
	currentPath: Accessor<string>
	setCurrentPath: Setter<string>
	currentExtension: Accessor<string | undefined>
	fileMap: ReactiveMap<string, string>
	openPaths: Accessor<string[]>
	nodes: Resource<Node[]>
	refetchNodes: (
		info?: unknown
	) => Node[] | Promise<Node[] | undefined> | null | undefined
	setNodes: Setter<Node[] | undefined>
	currentNode: Accessor<any>
	code: Resource<string | undefined>
	setCode: Setter<string | undefined>
	currentFile: () => string | undefined
	traversedNodes: Accessor<any[]>
	filePath: Accessor<string | undefined>
	isTs: Accessor<boolean>
	prettierConfig: Accessor<object>
	setPathsToOpen: Setter<string[]>
	pathsToOpen: Accessor<string[]>
	setLastKnownFile: Setter<string>
}

function createFSContext({
	basePath = 'root',
	pathKey,
	tabKey
}: {
	basePath?: string
	pathKey: string
	tabKey: string
}) {
	const FSContext = createContext<FileSystemCtx>()

	const FSProvider = (props: { children: JSX.Element }) => {
		const [fs] = createResource(OPFS.create)

		const [lastKnownFile, setLastKnownFile] = makePersisted(createSignal(''), {
			name: pathKey
		})

		const [currentPath, setCurrentPath] = createSignal(lastKnownFile())

		// const [basePathSignal, setBasePath] = createSignal(basePath)
		// const fullPath = () => `${basePathSignal()}/${currentPath()}`

		const [pathsToOpen, setPathsToOpen] = createSignal<string[]>([])

		const fileMap = new ReactiveMap<string, string>()
		const openPaths = () => Array.from(fileMap.keys())

		const [nodes, { refetch: refetchNodes, mutate: setNodes }] = createResource(
			fs,
			fs => fs.getNodeRepresentation('root') as Promise<Node[]>,
			{ storage: createDeepSignal }
		)

		const currentNode = createMemo<Node | undefined>(prev => {
			return nodes() ? findNode(currentPath(), unwrap(nodes()!)) : prev
		})

		const filePath = createMemo<string>(prev => {
			const currentNodeValue = currentNode()
			if (!currentNodeValue) return ''

			const res = isFile(currentNodeValue!) ? currentPath() : prev
			return res
		}, '')
		const currentExtension = () => filePath().split('.').pop()
		createEffect(() => {
			if (filePath()) {
				setLastKnownFile(filePath()!)
			}
		})
		const isTs = () =>
			extensionMap[currentExtension() as keyof typeof extensionMap] ===
			'typescript'
		const prettierConfig = () => getConfigFromExt(currentExtension())

		createResource(fs, fs => loadTabData(fileMap, fs, tabKey))

		const codefetchTrigger = () => ({ path: filePath(), fs: fs() })
		const fetchFile = async ({
			path,
			fs
		}: ReturnType<typeof codefetchTrigger>) => {
			if (!path) return ''

			if (fileMap.has(path)) {
				return fileMap.get(path)
			}
			if (!fs) return ''
			let file = await (await fs?.read(path))?.text()!
			if (isTs()) {
				file = await Formmater.prettier(file, prettierConfig())
			}
			fileMap.set(path, file)

			await saveTabs(fileMap.keys(), fs, tabKey)

			return file
		}
		const [code, { mutate: setCode }] = createResource(
			codefetchTrigger,
			fetchFile
		)
		const currentFile = () => fileMap.get(filePath()!)
		const traversedNodes = createMemo(() => {
			return nodes.loading
				? []
				: traverseAndSetOpen(
						unwrap(nodes())!,
						currentPath().split('/').filter(Boolean)
					)
		}, [])
		return (
			<FSContext.Provider
				value={{
					fs,
					currentPath,
					setCurrentPath,
					currentExtension,
					fileMap,
					openPaths,
					nodes,
					refetchNodes,
					setNodes,
					currentNode,
					code,
					setCode,
					currentFile,
					traversedNodes,
					filePath,
					isTs,
					prettierConfig,
					setPathsToOpen,
					pathsToOpen,
					setLastKnownFile
				}}
			>
				{props.children}
			</FSContext.Provider>
		)
	}

	const useFS = () => {
		const context = useContext(FSContext)
		if (!context) {
			throw new Error('useFS must be used within an FSProvider')
		}
		return context
	}

	return { FSProvider, useFS }
}

export const { FSProvider: EditorFSProvider, useFS: useEditorFS } =
	createFSContext({
		pathKey: EDITOR_PATH_KEY,
		tabKey: EDITOR_TAB_KEY
	})

export const { FSProvider: TerminalFSProvider, useFS: useTerminalFS } =
	createFSContext({
		pathKey: TERMINAL_PATH_KEY,
		tabKey: TERMINAL_TAB_KEY
	})
