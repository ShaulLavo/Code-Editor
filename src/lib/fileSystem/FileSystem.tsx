import fs from 'indexeddb-fs'
import {
	For,
	Suspense,
	createMemo,
	createResource,
	createSignal,
	type Component
} from 'solid-js'

import { demoNodes, nextApp } from '../../constants/demo/nodes'
import { FilesystemItem } from './FilesystemItem'

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

export function isFile(node: Node): node is File {
	return Boolean(node) && (node as Folder).nodes === undefined
}
export function isFolder(node: Node): node is Folder {
	return (node as Folder)?.nodes !== undefined
}

async function getFileSystemStructure(dirPath: string): Promise<Node[]> {
	const dirents = await fs.readDirectory(dirPath)

	const directoryPromises = dirents.directories.map(async dir => {
		const fullPath = `${dirPath}/${dir.name}`
		const children = await getFileSystemStructure(fullPath)
		return { name: dir.name, nodes: children }
	})

	const filePromises = dirents.files.map(async file => {
		// const content = await fs.readFile(`${dirPath}/${file.name}`)
		return {
			name: file.name
			// content: typeof content === 'string' ? content : ''
		}
	})

	const nodes = await Promise.all(filePromises.concat(directoryPromises))

	return nodes
}

async function createFileSystemStructure(
	nodes: Node[],
	basePath = ''
): Promise<void> {
	let start = performance.now()
	for (const node of nodes) {
		const currentPath = basePath + '/' + node.name
		if (isFolder(node)) {
			try {
				await fs.createDirectory(currentPath)
			} catch (err) {
				console.error(`Error creating directory ${currentPath}:`, err)
			}
			await createFileSystemStructure(node.nodes, currentPath)
		} else {
			try {
				const file = await fs.writeFile(currentPath, node.content ?? '')
				console.log('file', file)
			} catch (err) {
				console.error(`Error creating file ${currentPath}:`, err)
			}
		}
	}
	console.log('createFileSystemStructure', performance.now() - start)
}

async function deleteAll(directoryPath: string): Promise<void> {
	const dirents = await fs.readDirectory(directoryPath)

	for (const dirent of dirents.directories) {
		await fs.removeDirectory(directoryPath + '/' + dirent.name)
	}
	for (const dirent of dirents.files) {
		await fs.removeFile(directoryPath + '/' + dirent.name)
	}
}
function traverseAndSetOpen(nodes: Node[], path: string[]): Node[] {
	let start = performance.now()

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
	console.log('traverseAndSetOpen', performance.now() - start)
	return nodes
}

export const FileSystem: Component = () => {
	// const [nodes, setNodes] = createSignal<Node[]>([])
	const [nodes, { refetch }] = createResource(() =>
		getFileSystemStructure('root')
	)
	const [currentNode, setCurrentNode] = createSignal<Node>(null!)
	const [currentPath, setCurrentPath] = createSignal('')
	const filePath = () => (isFile(currentNode()) ? currentPath() : undefined)

	const [content] = createResource(
		filePath,
		async path => fs.readFile(path) as Promise<string>
	)

	const traversedNodes = createMemo(() =>
		nodes.loading
			? []
			: traverseAndSetOpen(nodes()!, currentPath().split('/').filter(Boolean))
	)

	return (
		<div>
			<button
				onClick={async () => {
					await deleteAll('root')
					refetch()
				}}
			>
				delete all
			</button>
			{' | '}
			<button
				onclick={async () => {
					await createFileSystemStructure(nextApp)
					refetch()
				}}
			>
				create new fs nextApp
			</button>
			{' | '}
			<button
				onclick={async () => {
					await createFileSystemStructure(demoNodes)
					refetch()
				}}
			>
				create new fs demoNodes
			</button>
			<div class="flex flex-row">
				<Suspense fallback={'loading...'}>
					<ul>
						<For each={traversedNodes()}>
							{node => (
								<FilesystemItem
									node={node}
									currentPath={currentPath}
									setCurrentPath={setCurrentPath}
									setCurrentNode={setCurrentNode}
								/>
							)}
						</For>
					</ul>
				</Suspense>
				<Suspense fallback={'loading...'}>
					<code>{content()}</code>
				</Suspense>
			</div>
		</div>
	)
}
