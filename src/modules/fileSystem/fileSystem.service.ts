import { ReactiveMap } from '@solid-primitives/map'
import { DemoNode } from '~/constants/demo/nodes'
import { Formatter, getConfigFromExt } from '~/format'
import { Document, Folder, OPFS } from '~/FS/OPFS'

export type Node = (Folder | Document) & { isOpen?: boolean }

export function restoreFilePath(path: string): string {
	return path.replace(/__LSB__/g, '[').replace(/__RSB__/g, ']')
}
export function isFile(node?: Node): node is Document {
	return Boolean(node) && (node as Document).type === 'file'
}
export function isFolder(node: Node | any): node is Folder {
	return (node as Folder)?.children !== undefined
}

export async function createFileSystemStructure(
	nodes: Array<DemoNode>,
	fs: OPFS,
	basePath = '',
	isRootCall = true
): Promise<void> {
	let start = isRootCall ? performance.now() : 0
	for (const node of nodes) {
		const currentPath = basePath + '/' + node.name
		if (isFolder(node)) {
			try {
				await fs.createDirectory(currentPath)
			} catch (err) {
				console.error(`Error creating directory ${currentPath}:`, err)
			}
			await createFileSystemStructure(
				node.children as DemoNode[],
				fs,
				currentPath,
				false
			)
		} else {
			try {
				//@ts-ignore
				await fs.write(currentPath, node.content ?? '')
			} catch (err) {
				console.error(`Error creating file ${currentPath}:`, err)
			}
		}
	}
	if (isRootCall)
		console.info('createFileSystemStructure', performance.now() - start)
}

export function findNode(path: string, structure: Node[]): Node | undefined {
	const parts = path.split('/').filter(Boolean)

	function search(nodes: Node[] | undefined, index = 0): Node | undefined {
		if (!nodes || nodes.length === 0) return undefined

		for (const node of nodes) {
			if (node.name === parts[index]) {
				if (index === parts.length - 1) {
					return node
				}
				if (isFolder(node) && node.children?.length) {
					const result = search(node.children, index + 1)
					if (result) return result
				}
			}
		}

		return undefined
	}

	return search(structure)
}
export function getFirstDirectory(
	path: string,
	structure: Node[]
): Folder | undefined {
	const parts = path.split('/').filter(Boolean)

	function searchForDirectory(
		nodes: Node[] | undefined,
		index = 0,
		parent: Node | undefined = undefined
	): Folder | undefined {
		if (!nodes || nodes.length === 0) return undefined

		for (const node of nodes) {
			if (node.name === parts[index]) {
				if (index === parts.length - 1) {
					if (isFolder(node)) {
						return node
					} else {
						return parent as Folder | undefined
					}
				}

				if (isFolder(node) && node.children?.length) {
					return searchForDirectory(node.children, index + 1, node)
				}
			}
		}

		return undefined
	}

	return searchForDirectory(structure)
}
export function moveNode(
	structure: Node[],
	fromPath: string,
	toPath: string
): Node[] {
	const nodeToMove = findNode(fromPath, structure)
	if (!nodeToMove) {
		throw new Error(`Node not found at ${fromPath}`)
	}

	const destinationFolder = findNode(toPath, structure)
	if (!destinationFolder || destinationFolder.type !== 'directory') {
		throw new Error(`Destination path ${toPath} is invalid or not a directory.`)
	}

	removeNode(fromPath, structure)
	destinationFolder.children.push(nodeToMove)

	return structuredClone(structure)
}

function removeNode(path: string, structure: Node[]): void {
	const parts = path.split('/').filter(part => part !== '')

	function searchAndRemove(nodes: Node[], index = 0): boolean {
		const nodeIndex = nodes.findIndex(node => node.name === parts[index])

		if (nodeIndex === -1) return false

		const node = nodes[nodeIndex]

		if (index === parts.length - 1) {
			nodes.splice(nodeIndex, 1)
			return true
		}

		if (isFolder(node)) {
			return searchAndRemove(node.children, index + 1)
		}

		return false
	}

	if (!searchAndRemove(structure, 0)) {
		throw new Error(`Failed to remove node at ${path}`)
	}
}

export function getFirstDirOrParent(
	path: string,
	structure: Node[]
): Node | undefined {
	const parts = path.split('/').filter(part => part !== '')

	function search(
		nodes: Node[],
		index = 0,
		parent: Node | undefined = undefined
	): Node | undefined {
		for (const node of nodes) {
			if (node.name === parts[index]) {
				if (index === parts.length - 1) {
					// Return the parent node if it's a file or the current node if it's a directory
					return isFolder(node) ? node : parent
				}
				if (isFolder(node)) {
					// Continue searching down the tree, passing the current node as the parent
					return search(node.children, index + 1, node)
				}
			}
		}
		return undefined
	}

	return search(structure, 0)
}

export function traverseAndSetOpen(nodes: Node[], path: string[]): Node[] {
	if (!nodes) return []
	nodes.sort((a, b) => {
		if (isFolder(a) && !isFolder(b)) return -1
		if (!isFolder(a) && isFolder(b)) return 1
		return a.name.localeCompare(b.name)
	})
	for (const node of nodes) {
		if (node.name === path[0]) {
			if (path.length === 1) {
				// node.isOpen = true
				return nodes
			}
			if (isFolder(node) && traverseAndSetOpen(node.children, path.slice(1))) {
				node.isOpen = true
				return nodes
			}
		}
	}

	return nodes
}

export const saveTabs = async (
	tabIter: IterableIterator<string> | string[],
	fs: OPFS,
	tabKey: string
) => {
	const tabs = Array.from(tabIter)
	await fs.write(tabKey, JSON.stringify(tabs))
}

export const loadTabData = async (
	fileMap: ReactiveMap<string, string>,
	fileSystem: OPFS,
	tabKey: string
) => {
	if (!(await fileSystem.exists(tabKey))) {
		await fileSystem.write(tabKey, JSON.stringify([]))
		return
	}
	const file = await fileSystem.read(tabKey)
	const tabs = JSON.parse(await file.text())
	const readPromises = tabs.map(async (tab: string) => {
		const file = await fileSystem.read(tab)
		const ext = tab.split('.').pop()
		fileMap.set(
			tab,
			await Formatter.prettier(
				(await file?.text()) ?? '',
				getConfigFromExt(ext)
			)
		)
	})

	await Promise.all(readPromises)
}

export const clearTabs = async (
	fileMap: ReactiveMap<string, string>,
	fs: OPFS,
	tabKey: string
) => {
	await fs.write(tabKey, JSON.stringify([]))
	fileMap.clear()
}
