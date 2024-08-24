import { ReactiveMap } from '@solid-primitives/map'
import { makePersisted } from '@solid-primitives/storage'
import fs from 'indexeddb-fs'
import { createSignal } from 'solid-js'

export const [currentPath, setCurrentPath] = makePersisted(createSignal(''), {
	name: 'path'
})
export const currentExtension = () => currentPath().split('.').pop()

function replacer(key: any, value: any) {
	if (value instanceof Map) {
		return {
			dataType: 'Map',
			value: Array.from(value.entries()) // or with spread: value: [...value]
		}
	} else {
		return value
	}
}
function reviver(key: any, value: any) {
	if (typeof value === 'object' && value !== null) {
		if (value.dataType === 'Map') {
			return new Map(value.value)
		}
	}
	return value
}
export const saveTabs = async (tabIter: IterableIterator<string>) => {
	const tabs = Array.from(tabIter)
	await fs.writeFile('tabs', JSON.stringify(tabs))
}
export const loadTabData = async (fileMap: ReactiveMap<string, string>) => {
	const tabs = JSON.parse((await fs.readFile('tabs')) as string)
	for (const tab of tabs) {
		console.log('loading tab', tab)
		fileMap.set(tab, (await fs.readFile(tab)) as string)
	}
}
