import { ReactiveMap } from '@solid-primitives/map'
import { makePersisted } from '@solid-primitives/storage'
import { createFs } from 'indexeddb-fs'
import { Setter, createContext, createSignal } from 'solid-js'
import {
	restoreFilePath,
	sanitizeFilePath
} from '~/fileSystem/fileSystem.service'
import { Formmater, getConfigFromExt } from '~/format'

function createFsStore({
	name,
	pathKey,
	tabKey
}: {
	name: string
	pathKey: string
	tabKey: string
}) {
	const fs = createFs({
		databaseName: name,
		databaseVersion: 1,
		objectStoreName: 'fs',
		rootDirectoryName: 'root'
	})
	const originalWriteFile = fs.writeFile
	const originalReadFile = fs.readFile

	interface Subscriber {
		set(data: { fullPath: string; content: string }): void
		subscribedPaths: string[]
		subscribedOperations: Array<'write' | 'read'>
	}

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

	fs.writeFile = async <TData = unknown>(fullPath: string, data: TData) => {
		subscribers.forEach(sub => {
			const hasWriteSub = sub.subscribedOperations.includes('write')
			const hasFileSub = sub.subscribedPaths.includes(fullPath)
			if (hasWriteSub && hasFileSub) {
				sub.set({ fullPath, content: data as string })
			}
		})

		return originalWriteFile<TData>(fullPath, data)
	}

	fs.readFile = async <TData>(fullPath: string) => {
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
		const res = await fs.writeFile('tabs', JSON.stringify(tabs))
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
	return {
		fs,
		currentPath,
		setCurrentPath,
		currentExtension,
		saveTabs,
		loadTabData,
		clearTabs,
		fileMap,
		openPaths,
		subscribe
	}
}

export const editorFS = createFsStore({
	name: 'file-system',
	pathKey: 'editorPath',
	tabKey: 'editorTabs'
})

export const terminalFS = createFsStore({
	name: 'file-system',
	pathKey: 'xTerm',
	tabKey: 'xTermTabs'
})
