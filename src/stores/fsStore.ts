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
export const saveTabData = async (fileMap: ReactiveMap<string, string>) => {
	const data = JSON.stringify(fileMap, replacer)
	await fs.writeFile('tabsData', data)
}
export const loadTabData = async (fileMap: ReactiveMap<string, string>) => {
	const data = (await fs.readFile('tabsData')) as string
	const parsed = JSON.parse(data, reviver)
	for (const [key, value] of parsed) {
		fileMap.set(key, value)
	}
}
