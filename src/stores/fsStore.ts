import { ReactiveMap } from '@solid-primitives/map'
import { makePersisted } from '@solid-primitives/storage'
import { createFs } from 'indexeddb-fs'
import { createSignal } from 'solid-js'
import { sanitizeFilePath } from '~/fileSystem/fileSystem.service'
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

	const [currentPath, setCurrentPath] = makePersisted(createSignal(''), {
		name: pathKey
	})
	const currentExtension = () => currentPath().split('.').pop()

	const saveTabs = async (tabIter: IterableIterator<string>) => {
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

	const clearTabs = async () => {
		await fs.writeFile('tabs', JSON.stringify([]))
	}
	return {
		fs,
		currentPath,
		setCurrentPath,
		currentExtension,
		saveTabs,
		loadTabData,
		clearTabs
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
