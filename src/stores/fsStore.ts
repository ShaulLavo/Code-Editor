import { ReactiveMap } from '@solid-primitives/map'
import { makePersisted } from '@solid-primitives/storage'
import { createFs } from 'indexeddb-fs'
import { createSignal } from 'solid-js'
import { sanitizeFilePath } from '~/fileSystem/fileSystem.service'
import { Formmater } from '~/format'

export const fs = createFs({
	databaseName: 'file-system',
	databaseVersion: 1,
	objectStoreName: 'fs',
	rootDirectoryName: 'root'
})

export const [currentPath, setCurrentPath] = makePersisted(createSignal(''), {
	name: 'path'
})
export const currentExtension = () => currentPath().split('.').pop()

export const saveTabs = async (tabIter: IterableIterator<string>) => {
	const tabs = Array.from(tabIter)
	const res = await fs.writeFile('tabs', JSON.stringify(tabs))
}
export const loadTabData = async (fileMap: ReactiveMap<string, string>) => {
	if (!(await fs.exists('tabs'))) {
		await fs.writeFile('tabs', JSON.stringify([]))
		return
	}
	const tabs = JSON.parse((await fs.readFile('tabs')) as string)
	const readPromises = tabs.map(async (tab: string) => {
		const content = await fs.readFile(sanitizeFilePath(tab))
		fileMap.set(tab, await Formmater.prettier(content as string))
	})

	await Promise.all(readPromises)
}
