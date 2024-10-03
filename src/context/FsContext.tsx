import { ReactiveMap } from '@solid-primitives/map'
import { makePersisted } from '@solid-primitives/storage'
import { createFs, ICreateFsOutput } from 'indexeddb-fs'
import {
	Accessor,
	JSX,
	Resource,
	Setter,
	createContext,
	createMemo,
	createResource,
	createSignal,
	useContext
} from 'solid-js'
import {
	findItem,
	getFileSystemStructure,
	isFile,
	sanitizeFilePath,
	traverseAndSetOpen
} from '~/fileSystem/fileSystem.service'
import { Formmater, extensionMap, getConfigFromExt } from '~/format'
import type { Node } from '~/fileSystem/fileSystem.service'

export interface FileSystemCtx {
	fs: ICreateFsOutput
	currentPath: Accessor<string>
	setCurrentPath: Setter<string>
	currentExtension: Accessor<string | undefined>
	saveTabs: (tabIter: IterableIterator<string> | string[]) => Promise<void>
	loadTabData: (fileMap: ReactiveMap<string, string>) => Promise<any>
	clearTabs: (fileMap: ReactiveMap<string, string>) => void
	fileMap: ReactiveMap<string, string>
	openPaths: Accessor<string[]>
	subscribe: (subscriber: Subscriber) => () => void
	nodes: Resource<Node[]>
	refetch: (
		info?: unknown
	) => Node[] | Promise<Node[] | undefined> | null | undefined
	mutate: (data: any) => void
	currentNode: Accessor<any>
	code: Resource<string | undefined>
	setCode: Setter<string | undefined>
	currentFile: () => string | undefined
	traversedNodes: Accessor<any[]>
	filePath: Accessor<string | undefined>
	isTs: Accessor<boolean>
	prettierConfig: Accessor<object>
}

interface Subscriber {
	set(data: { fullPath: string; content: string }): void
	subscribedPaths: string[]
	subscribedOperations: Array<'write' | 'read'>
}

function createFSContext({
	name,
	pathKey,
	tabKey
}: {
	name: string
	pathKey: string
	tabKey: string
}) {
	const FSContext = createContext<FileSystemCtx>()

	function FSProvider(props: { children: JSX.Element }) {
		const fs = createFs({
			databaseName: name,
			databaseVersion: 1,
			objectStoreName: 'fs',
			rootDirectoryName: 'root'
		})
		const originalWriteFile = fs.writeFile
		const originalReadFile = fs.readFile

		const subscribers: Subscriber[] = []

		const subscribe = (subscriber: Subscriber) => {
			subscribers.push(subscriber)
			return () => {
				const index = subscribers.indexOf(subscriber)
				if (index !== -1) {
					subscribers.splice(index, 1)
				}
			}
		}

		fs.writeFile = async <TData = unknown,>(fullPath: string, data: TData) => {
			subscribers.forEach(sub => {
				const hasWriteSub = sub.subscribedOperations.includes('write')
				const hasFileSub = sub.subscribedPaths.includes(fullPath)
				if (hasWriteSub && hasFileSub) {
					sub.set({ fullPath, content: data as string })
				}
			})

			return originalWriteFile<TData>(fullPath, data)
		}

		fs.readFile = async <TData,>(fullPath: string) => {
			subscribers.forEach(sub => {
				const hasReadSub = sub.subscribedOperations.includes('read')
				const hasFileSub = sub.subscribedPaths.includes(fullPath)
				if (hasReadSub && hasFileSub) {
					sub.set({ fullPath, content: '' })
				}
			})
			return originalReadFile<TData>(fullPath)
		}
		const [currentPath, setCurrentPath] = makePersisted(createSignal(''), {
			name: pathKey
		})

		const fileMap = new ReactiveMap<string, string>()
		const openPaths = () => Array.from(fileMap.keys())
		const currentExtension = () => currentPath().split('.').pop()

		const saveTabs = async (tabIter: IterableIterator<string> | string[]) => {
			const tabs = Array.from(tabIter)
			await fs.writeFile('tabs', JSON.stringify(tabs))
		}
		const loadTabData = async (fileMap: ReactiveMap<string, string>) => {
			if (!(await fs.exists('tabs'))) {
				await fs.writeFile('tabs', JSON.stringify([]))
				return
			}
			const tabs = JSON.parse((await fs.readFile('tabs')) as string)
			const readPromises = tabs.map(async (tab: string) => {
				const content = await fs.readFile(sanitizeFilePath(tab))
				const ext = tab.split('.').pop()
				fileMap.set(
					tab,
					await Formmater.prettier(content as string, getConfigFromExt(ext))
				)
			})

			await Promise.all(readPromises)
		}

		const clearTabs = async (fileMap: ReactiveMap<string, string>) => {
			await fs.writeFile('tabs', JSON.stringify([]))
			fileMap.clear()
		}

		const [nodes, { refetch, mutate }] = createResource(() =>
			getFileSystemStructure('root', fs)
		)
		const currentNode = () =>
			nodes() ? findItem(currentPath(), nodes()!) : undefined
		const filePath = createMemo<string | undefined>(prev => {
			const currentNodeValue = currentNode()
			return isFile(currentNodeValue!) ? currentPath() : prev
		})

		const isTs = () =>
			extensionMap[currentExtension() as keyof typeof extensionMap] ===
			'typescript'
		const prettierConfig = () => getConfigFromExt(currentExtension())

		createResource(() => loadTabData(fileMap))
		const [code, { mutate: setCode }] = createResource(filePath, async path => {
			if (!path) return ''
			if (fileMap.has(path)) {
				return fileMap.get(path)
			}
			let file = (await fs.readFile(sanitizeFilePath(path))) as string
			if (isTs()) {
				file = await Formmater.prettier(file, prettierConfig())
			}
			fileMap.set(path, file)

			await saveTabs(fileMap.keys())

			return file
		})
		const currentFile = () => fileMap.get(filePath()!)
		const traversedNodes = createMemo(
			() =>
				nodes.loading
					? []
					: traverseAndSetOpen(
							nodes()!,
							currentPath().split('/').filter(Boolean)
						),
			[],
			{
				equals: () => false
			}
		)
		return (
			<FSContext.Provider
				value={{
					fs,
					currentPath,
					setCurrentPath,
					currentExtension,
					saveTabs,
					loadTabData,
					clearTabs,
					fileMap,
					openPaths,
					subscribe,
					nodes,
					refetch,
					mutate,
					currentNode,
					code,
					setCode,
					currentFile,
					traversedNodes,
					filePath,
					isTs,
					prettierConfig
				}}
			>
				{props.children}
			</FSContext.Provider>
		)
	}

	function useFS() {
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
		name: 'file-system',
		pathKey: 'editorPath',
		tabKey: 'editorTabs'
	})

export const { FSProvider: TerminalFSProvider, useFS: useTerminalFS } =
	createFSContext({
		name: 'file-system',
		pathKey: 'xTerm',
		tabKey: 'xTermTabs'
	})
