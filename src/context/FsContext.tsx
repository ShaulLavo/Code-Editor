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
	onCleanup,
	Resource,
	Setter,
	useContext
} from 'solid-js'
import { createStore, unwrap } from 'solid-js/store'
import { extensionMap, Formatter, getConfigFromExt } from '~/format'
import { OPFS } from '~/FS/OPFS'
import { createDeepSignal } from '~/lib/utils'
import {
	findNode,
	isFile,
	loadTabData,
	Node,
	saveTabs,
	traverseAndSetOpen
} from '~/modules/fileSystem/fileSystem.service'
export interface FileSystemCtx {
	fs: Resource<OPFS | undefined>
	currentPath: Accessor<string>
	setCurrentPath: Setter<string>
	currentExtension: Accessor<string | undefined>
	fileMap: ReactiveMap<string, string>
	openFiles: Accessor<string[]>
	nodes: Resource<Node[]>
	refetchNodes: (
		info?: unknown
	) => Node[] | Promise<Node[] | undefined> | null | undefined
	setNodes: Setter<Node[] | undefined>
	currentNode: Accessor<any>
	code: Resource<string | undefined>
	setCode: (code: string | undefined) => void
	currentFile: () => string | undefined
	traversedNodes: Accessor<Node[]>
	filePath: Accessor<string | undefined>
	isTs: Accessor<boolean>
	isPython: Accessor<boolean>
	isJSON: Accessor<boolean>
	prettierConfig: Accessor<object>
	setLastKnownFile: Setter<string>
}

export const fileMaps = new ReactiveMap<string, ReactiveMap<string, string>>()

export const [pathsToOpen, setPathsToOpen] = createSignal<string[]>([])
function createFSContextInstance({
	basePath = 'root/projects',
	pathKey,
	tabKey
}: {
	basePath?: string
	pathKey: string
	tabKey: string
}) {
	const [fs] = createResource(OPFS.create)

	const [lastKnownFile, setLastKnownFile] = makePersisted(createSignal(''), {
		name: pathKey
	})

	const [currentPath, setCurrentPath] = createSignal(lastKnownFile())

	// const [basePathSignal, setBasePath] = createSignal(basePath)
	// const fullPath = () => `${basePathSignal()}/${currentPath()}`

	const fileMap = new ReactiveMap<string, string>()
	createEffect(() => {
		if (fileMap.size > 0) {
			fileMaps.set(tabKey, fileMap)
		}
		onCleanup(() => {
			fileMaps.delete(tabKey)
		})
	})
	const openFiles = () => Array.from(fileMap.keys())

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
		['typescript', 'javascript'].includes(
			extensionMap[currentExtension() as keyof typeof extensionMap]
		)

	const isPython = () =>
		extensionMap[currentExtension() as keyof typeof extensionMap] === 'python'
	const isJSON = () =>
		extensionMap[currentExtension() as keyof typeof extensionMap] === 'json'
	const prettierConfig = () => getConfigFromExt(currentExtension())

	createResource(fs, fs => loadTabData(fileMap, fs, tabKey))

	const codeFetchTrigger = () => ({ path: filePath(), fs: fs() })
	const fetchFile = async ({
		path,
		fs
	}: ReturnType<typeof codeFetchTrigger>) => {
		if (!path) return ''

		if (fileMap.has(path)) {
			return fileMap.get(path)
		}
		if (!fs) return ''
		let file = await (await fs?.read(path))?.text()!
		if (isTs()) {
			file = await Formatter.prettier(file, prettierConfig())
		}
		fileMap.set(path, file)

		await saveTabs(fileMap.keys(), fs, tabKey)

		return file
	}
	const [code, { mutate: _setCode }] = createResource(
		codeFetchTrigger,
		fetchFile
	)
	const setCode = (code: string | undefined) => {
		if (code === undefined) return
		_setCode(code)
		fileMap.set(filePath(), code)
	}
	const currentFile = () => fileMap.get(filePath()!)
	const traversedNodes = createMemo(() => {
		return nodes.loading
			? []
			: traverseAndSetOpen(
					unwrap(nodes())!,
					currentPath().split('/').filter(Boolean)
				)
	}, [])
	return {
		fs,
		currentPath,
		setCurrentPath,
		currentExtension,
		fileMap,
		openFiles,
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
		isPython,
		isJSON,
		prettierConfig,
		setLastKnownFile
	}
}

interface FsContextType {
	fsContexts: Record<string, FileSystemCtx>
	createFSContext: (id: string, basePath?: string) => void
	removeFSContext: (id: string) => void
	getFSById: (id: string) => FileSystemCtx
}

export const FsContext = createContext<FsContextType>()

export function FsProvider(props: { children: JSX.Element }) {
	const [fsContexts, setFsContexts] = createStore<
		Record<string, FileSystemCtx>
	>({})

	const getFSById = (id: string): FileSystemCtx => {
		if (!fsContexts[id]) {
			setFsContexts(id, createFSContext(id))
		}
		return fsContexts[id]
	}

	const createFSContext = (id: string) => {
		const newContext = createFSContextInstance({
			pathKey: id + '-path',
			tabKey: id + '-tab'
		})
		setFsContexts(id, newContext)
		return newContext
	}

	const removeFSContext = (id: string) => {
		setFsContexts(contexts => {
			const { [id]: _, ...rest } = contexts
			return rest
		})
	}

	return (
		<FsContext.Provider
			value={{ fsContexts, createFSContext, removeFSContext, getFSById }}
		>
			{props.children}
		</FsContext.Provider>
	)
}

export function useFs(id: string) {
	const context = useContext(FsContext)
	if (!context) throw new Error('useFs must be used within a FsProvider')
	return context.getFSById(id)
}
