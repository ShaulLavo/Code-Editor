import { fs } from '~/stores/fsStore'

type File = {
	name: string
	content?: string
}
type Folder = {
	name: string
	nodes: Node[]
	isOpen?: boolean
}
export type Node = File | Folder

//helpers
export function sanitizeFilePath(path: string): string {
	return path.replace(/\[/g, '__LSB__').replace(/\]/g, '__RSB__')
}

export function restoreFilePath(path: string): string {
	return path.replace(/__LSB__/g, '[').replace(/__RSB__/g, ']')
}
export function isFile(node: Node): node is File {
	return Boolean(node) && (node as Folder).nodes === undefined
}
export function isFolder(node: Node): node is Folder {
	return (node as Folder)?.nodes !== undefined
}

//debug
export async function getFileSystemStructure(dirPath: string): Promise<Node[]> {
	let dirents = await fs.readDirectory(dirPath)

	const directoryPromises = dirents.directories.map(async dir => {
		const fullPath = `${dirPath}/${dir.name}`
		const children = await getFileSystemStructure(fullPath)
		return { name: restoreFilePath(dir.name), nodes: children }
	})

	const filePromises = dirents.files.map(async file => {
		return {
			name: restoreFilePath(file.name)
		}
	})

	const nodes = await Promise.all(filePromises.concat(directoryPromises))

	return nodes
}

export async function createFileSystemStructure(
	nodes: Node[],
	basePath = '',
	isRootCall = true
): Promise<void> {
	let start = isRootCall ? performance.now() : 0
	for (const node of nodes) {
		const currentPath = sanitizeFilePath(basePath + '/' + node.name)
		if (isFolder(node)) {
			try {
				await fs.createDirectory(currentPath)
			} catch (err) {
				console.error(`Error creating directory ${currentPath}:`, err)
			}
			await createFileSystemStructure(node.nodes, currentPath, false)
		} else {
			try {
				await fs.writeFile(currentPath, node.content ?? '')
			} catch (err) {
				console.error(`Error creating file ${currentPath}:`, err)
			}
		}
	}
	if (isRootCall)
		console.log('createFileSystemStructure', performance.now() - start)
}

export async function deleteAll(directoryPath: string): Promise<void> {
	const dirents = await fs.readDirectory(sanitizeFilePath(directoryPath))

	for (const dirent of dirents.directories) {
		await fs.removeDirectory(directoryPath + '/' + dirent.name)
	}
	for (const dirent of dirents.files) {
		await fs.removeFile(directoryPath + '/' + dirent.name)
	}
}

//nodes
export function findItem(path: string, structure: Node[]): Node | undefined {
	const parts = path.split('/').filter(part => part !== '')

	function search(nodes: Node[], index = 0): Node | undefined {
		for (const node of nodes) {
			if (node.name === parts[index]) {
				if (index === parts.length - 1) {
					return node
				}
				if (isFolder(node)) {
					return search(node.nodes, index + 1)
				}
			}
		}
		return undefined
	}

	return search(structure, 0)
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
					return search(node.nodes, index + 1, node)
				}
			}
		}
		return undefined
	}

	return search(structure, 0)
}

export function traverseAndSetOpen(nodes: Node[], path: string[]): Node[] {
	for (const node of nodes) {
		if (node.name === path[0]) {
			if (path.length === 1) {
				// node.isOpen = true
				return nodes
			}
			if (isFolder(node) && traverseAndSetOpen(node.nodes, path.slice(1))) {
				node.isOpen = true
				return nodes
			}
		}
	}

	return nodes
}
