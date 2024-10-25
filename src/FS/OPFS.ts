import { it } from 'node:test'

interface FileSystemAPI {
	read(path: FilePath): Promise<File>
	write(path: FilePath, content: string | ArrayBuffer): Promise<void>
	moveFile(
		source: FilePath,
		dest: DirectoryPath,
		options?: MoveOptions
	): Promise<void>
	moveDirectory(
		source: DirectoryPath,
		dest: DirectoryPath,
		options?: MoveOptions
	): Promise<void>
	getNodeRepresentation(path: DirectoryPath): Promise<FSNode[]>
	delete(path: string, options?: DeleteOptions): Promise<void>
	list(path: DirectoryPath): Promise<FSNode[]>
	copyFile(source: FilePath, dest: string, options?: CopyOptions): Promise<void>
	watch(path: string, callback: (event: FSWatchEvent) => void): () => void
	createFile(path: FilePath, options?: CreateFileOptions): Promise<File>
	createDirectory(
		path: DirectoryPath,
		options?: CreateDirectoryOptions
	): Promise<FSNode[]>
	info(path: string): Promise<FileSystemInfo>
	NodeAPI?: NodeAPI
}
type DirectoryPath = string
type FilePath = string
interface FileSystemInfo {
	type: 'directory' | 'file'
	name: string
	size?: number // Size in bytes
	mode: number // Permissions (octal)
	nlink: number // Number of hard links
	uid: number // User ID of owner
	gid: number // Group ID of owner
	atimeMs: number // Last access time in milliseconds
	mtimeMs: number // Last modified time in milliseconds
	ctimeMs: number // Change time in milliseconds
	birthtimeMs: number // Creation time in milliseconds
}
interface CreateFileOptions {
	recursiveDirs?: boolean
	overwrite?: boolean
}

interface CreateDirectoryOptions {
	recursive?: boolean
}

interface MoveOptions {
	overwrite?: boolean
}
interface CopyOptions {
	overwrite?: boolean
}

interface DeleteOptions {
	recursive?: boolean
}

type Extension =
	| 'txt'
	| 'json'
	| 'md'
	| 'html'
	| 'css'
	| 'js'
	| 'ts'
	| 'tsx'
	| 'jsx'
	| string

interface BaseNode {
	name: string
	path: string
	type: 'file' | 'directory'
	handle: FileSystemHandle
}
interface FileSystemStats {
	dev: number
	ino: number
	mode: number
	nlink: number
	uid: number
	gid: number
	rdev: number
	size: number
	blksize: number
	blocks: number
	atimeMs: number
	mtimeMs: number
	ctimeMs: number
	birthtimeMs: number
	atime: Date
	mtime: Date
	ctime: Date
	birthtime: Date
}

export interface Folder extends BaseNode {
	type: 'directory'
	handle: FileSystemDirectoryHandle
	children: Array<Folder | Document>
}

export interface Document extends BaseNode {
	type: 'file'
	handle: FileSystemFileHandle
	extension: Extension
}
export type FSNode = Document | Folder

export interface FSWatchEvent {
	type: 'add' | 'update' | 'delete'
	path: string
}

interface NodeAPI {
	readFile: (path: string, options?: any) => Promise<string | Buffer>
	writeFile: (
		file: string,
		data: string | Buffer,
		options?: any
	) => Promise<void>
	unlink: (path: string) => Promise<void>
	readdir: (path: string, options?: any) => Promise<string[]>
	mkdir: (path: string, options?: any) => Promise<void>
	rmdir: (path: string) => Promise<void>
	stat: (path: string) => Promise<FileSystemStats>
	lstat: (path: string) => Promise<FileSystemStats>
	readlink?: (path: string) => Promise<string>
	symlink?: (target: string, path: string, type?: string) => Promise<void>
	chmod?: (path: string, mode: string | number) => Promise<void>
}
const CHUNK_SIZE = 1024

export class OPFS implements FileSystemAPI {
	public NO_NAME_PLACEHOLDER = '<MISSING_NAME>'
	private static _rootHandle: FileSystemDirectoryHandle | null = null

	private watchers: Map<string, Set<(event: FSWatchEvent) => void>> = new Map()
	private constructor() {}
	NodeAPI: NodeAPI = new FileSystemWrapper(this)

	static async create(): Promise<OPFS> {
		if (!OPFS._rootHandle) {
			OPFS._rootHandle = await navigator.storage.getDirectory()
		}
		return new OPFS()
	}

	get rootHandle(): FileSystemDirectoryHandle {
		if (!OPFS._rootHandle) {
			throw new Error(
				'OPFS not initialized. Please use OPFS.create() to initialize.'
			)
		}
		return OPFS._rootHandle
	}
	private sanitizeFilePath(path: string): string {
		let sanitized = path
			// .replace(/\[/g, '__LSB__')
			// .replace(/\]/g, '__RSB__')
			.trim()

		if (sanitized.startsWith('/')) {
			sanitized = sanitized.substring(1)
		}
		if (
			!sanitized.startsWith('root/') &&
			!(sanitized === 'root') &&
			sanitized
		) {
			// sanitized = sanitized.substring('root/'.length)
			sanitized = 'root/' + sanitized
		}
		return sanitized
	}
	private async navigateToParentHandle(
		path: string,
		options?: { create?: boolean }
	): Promise<{ parentHandle: FileSystemDirectoryHandle; itemName: string }> {
		path = this.sanitizeFilePath(path)

		const parts = path.split('/').filter(part => part)
		const itemName = parts.pop()!
		if (itemName === undefined) {
			return {
				parentHandle: this.rootHandle,
				itemName: this.NO_NAME_PLACEHOLDER
			}
		}

		let currentHandle = this.rootHandle

		for (const part of parts) {
			if (part === 'root') {
				continue
			}
			try {
				currentHandle = await currentHandle.getDirectoryHandle(part, {
					create: options?.create
				})
			} catch (e) {
				console.info('navigateToParentHandle error', e)
			}
		}

		return { parentHandle: currentHandle, itemName }
	}

	private async getHandle(path: string): Promise<FileSystemHandle> {
		path = this.sanitizeFilePath(path)
		if (path === '/') {
			return this.rootHandle
		}

		const { parentHandle, itemName } = await this.navigateToParentHandle(path)

		for await (const [name, handle] of parentHandle) {
			if (name === itemName) {
				return handle
			}
		}

		throw new DOMException(
			`Handle for item "${itemName}" not found.`,
			'NotFoundError'
		)
	}

	private async getDirectoryHandle(
		path: string,
		options?: { create?: boolean }
	): Promise<FileSystemDirectoryHandle> {
		const parts = this.sanitizeFilePath(path)
			.split('/')
			.filter(part => part)
		let currentHandle = this.rootHandle

		if (parts.length === 0) {
			return await currentHandle.getDirectoryHandle(this.NO_NAME_PLACEHOLDER, {
				create: options?.create
			})
		}

		for (let i = 0; i < parts.length; i++) {
			const part = parts[i]
			try {
				if (i === 0 && part === 'root') continue
				currentHandle = await currentHandle.getDirectoryHandle(part, {
					create: options?.create
				})
			} catch (e) {
				console.info(
					'getDirectoryHandle error',
					e instanceof Error ? e.message : e
				)
			}
		}
		return currentHandle
	}

	async exists(path: string): Promise<boolean> {
		try {
			await this.getHandle(this.sanitizeFilePath(path))
			return true
		} catch (error) {
			if (error instanceof DOMException && error.name === 'NotFoundError') {
				return false
			}
			throw error
		}
	}

	async read(path: string, options?: { signal?: AbortSignal }): Promise<File> {
		path = this.sanitizeFilePath(path)
		if (path === 'root' || path === '/') {
			throw new Error(
				`Cannot read a file at path "${path}" because it refers to the root directory.`
			)
		}

		if (path.startsWith('root/')) {
			path = path.substring('root/'.length)
		} else if (path.startsWith('/')) {
			path = path.substring(1)
		}

		const handle = await this.getHandle(path)
		if (handle.kind !== 'file') {
			throw new Error(`Path is not a file: ${path}`)
		}

		const file = await (handle as FileSystemFileHandle).getFile()

		if (!options) {
			return file
		}

		if (options?.signal?.aborted) {
			throw new DOMException('The operation was aborted.', 'AbortError')
		}

		const chunks: Uint8Array[] = []

		try {
			for await (const chunk of this.chunker(file, CHUNK_SIZE)) {
				if (options?.signal?.aborted) {
					console.error('Aborted', options?.signal?.aborted)
					throw new DOMException('The operation was aborted.', 'AbortError')
				}

				const arrayBuffer = await chunk.arrayBuffer()
				chunks.push(new Uint8Array(arrayBuffer))
			}

			const blob = new Blob(chunks, { type: file.type })

			const newFile = new File([blob], file.name, { type: file.type })
			return newFile
		} catch (error) {
			throw error
		}
	}

	async write(
		path: string,
		content: string | ArrayBuffer | File,
		options?: { signal?: AbortSignal }
	): Promise<void> {
		path = this.sanitizeFilePath(path)
		const { parentHandle, itemName } = await this.navigateToParentHandle(path, {
			create: true
		})
		const fileHandle = await parentHandle.getFileHandle(itemName, {
			create: true
		})

		const writable = await fileHandle.createWritable()

		await writable.truncate(0)
		if (!options) {
			if (typeof content === 'string') {
				await writable.write(content)
			} else if (content instanceof ArrayBuffer) {
				await writable.write(new Uint8Array(content))
			} else {
				const reader = new FileReader()
				await new Promise<void>((resolve, reject) => {
					reader.onload = () => resolve()
					reader.onerror = () => reject(reader.error)
					reader.readAsArrayBuffer(content)
				})
				await writable.write(new Uint8Array(reader.result as ArrayBuffer))
			}
			await writable.close()

			await this.triggerWatchEvent('update', path)
			return
		}

		if (options?.signal?.aborted) {
			await writable.close()
			throw new DOMException('The operation was aborted.', 'AbortError')
		}

		try {
			let blobContent: Blob
			if (typeof content === 'string') {
				blobContent = new Blob([content], { type: 'text/plain' })
			} else if (content instanceof ArrayBuffer) {
				blobContent = new Blob([content])
			} else if (content instanceof File) {
				blobContent = content
			} else {
				throw new TypeError('Unsupported content type')
			}

			for await (const chunk of this.chunker(blobContent, CHUNK_SIZE)) {
				if (options?.signal?.aborted) {
					throw new DOMException('The operation was aborted.', 'AbortError')
				}

				await writable.write(chunk)
			}

			await writable.close()

			await this.triggerWatchEvent('update', path)
		} catch (error) {
			await writable.close()
			throw error
		}
	}

	async moveFile(
		source: string,
		dest: string,
		options?: MoveOptions
	): Promise<void> {
		source = this.sanitizeFilePath(source)
		dest = this.sanitizeFilePath(dest)
		const sourceHandle = await this.getHandle(source)
		if (sourceHandle.kind !== 'file') {
			throw new Error(`Source is not a file: ${source}`)
		}
		// const destinationExists = await this.exists(dest)
		// if (!destinationExists) {
		// 	throw new Error(`Destination '${dest}' not exist.`)
		// }

		// // sourceHandle.name
		// const list = await this.list(dest)
		// if (list.map(l => l.name).includes(sourceHandle.name)) {
		// 	throw new Error(
		// 		`Destination '${dest}' already contains a file with the same name.`
		// 	)
		// }

		const name = '/' + sourceHandle.name
		const content = await this.read(source)
		await this.createFile(dest + name)
		await this.write(dest + name, await content.arrayBuffer())
		await this.delete(source, { recursive: true })

		await this.triggerWatchEvent('delete', source)
		await this.triggerWatchEvent('add', dest)
	}
	async rename(path: string, name: string) {
		const idDir = await this.isDirectory(path)
		const { parentHandle, itemName } = await this.navigateToParentHandle(path)
		console.log("let's fking GO", parentHandle, itemName)
		await parentHandle.removeEntry(itemName)
		console.log('removed entry', 'isDir?', idDir)
		idDir
			? await parentHandle.getDirectoryHandle(name, { create: true })
			: await parentHandle.getFileHandle(name, { create: true })
		console.log('created new entry')
		await this.triggerWatchEvent('update', path)
	}
	async moveDirectory(
		source: string,
		dest: string,
		options?: MoveOptions
	): Promise<void> {
		source = this.sanitizeFilePath(source)
		dest = this.sanitizeFilePath(dest)
		const sourceHandle = await this.getHandle(source)
		if (sourceHandle.kind !== 'directory') {
			throw new Error(`Source is not a directory: ${source}`)
		}
		const name = '/' + sourceHandle.name
		dest = dest + name
		const destinationExists = await this.exists(dest)
		if (destinationExists && !options?.overwrite) {
			throw new Error(`Destination '${dest}' already exists.`)
		}

		if (destinationExists && options?.overwrite) {
			await this.delete(dest, { recursive: true })
		}
		await this.copyDirectory(source, dest)
		await this.delete(source, { recursive: true })
		await this.triggerWatchEvent('delete', source)
		await this.triggerWatchEvent('add', dest)
	}
	async isDirectory(path: string) {
		return await this.getHandle(path).then(
			handle => handle.kind === 'directory'
		)
	}
	async getNodeRepresentation(dirPath: string): Promise<Folder[]> {
		dirPath = this.sanitizeFilePath(dirPath)
		if (dirPath === '') {
			dirPath = 'root/' + this.NO_NAME_PLACEHOLDER
		}

		if (dirPath === 'root' || dirPath === '/' || dirPath === '/root') {
			const handle = this.rootHandle

			if (!(handle instanceof FileSystemDirectoryHandle)) {
				throw new Error(`Root handle is not a directory`)
			}
			const nodeRepresentation = {
				name: 'root',
				path: dirPath,
				type: 'directory',
				handle,
				children: await this.list(dirPath)
			}
			return [nodeRepresentation] as Folder[]
		}
		const handle = await this.getHandle(dirPath || this.NO_NAME_PLACEHOLDER)
		const pathArray = dirPath.split('/')
		const name = pathArray.pop()
		if (!name) {
			throw new Error(`Invalid path: ${dirPath}`)
		}

		if (!(handle instanceof FileSystemDirectoryHandle)) {
			if (handle.kind === 'file') {
				throw new Error(`Path is a file: ${dirPath}`)
			}
			throw new Error(`Invalid handle`)
		}
		const nodeRepresentation = {
			name,
			path: dirPath,
			type: 'directory',
			handle,
			children: await this.list(dirPath)
		} as Folder
		return [nodeRepresentation] as Folder[]
	}

	async delete(path: string, options?: DeleteOptions): Promise<void> {
		const handle = (await this.getHandle(path)) as FileSystemFileHandle
		const { parentHandle, itemName } = await this.navigateToParentHandle(path)

		//@ts-ignore
		await handle.requestPermission({ mode: 'readwrite' })

		try {
			await parentHandle.removeEntry(itemName, {
				recursive: options?.recursive
			})

			await this.triggerWatchEvent('delete', path)
		} catch (e) {
			console.error('delete error', itemName, e)
		}
	}

	async list(path: string): Promise<FSNode[]> {
		try {
			const dirHandle = await this.getDirectoryHandle(path)

			const entries: FSNode[] = []
			if (!(dirHandle instanceof FileSystemDirectoryHandle)) {
				throw new Error('Invalid handle')
			}

			for await (const [name, handle] of dirHandle) {
				const entryPath = `${path}/${name}`
				handle.kind === 'file'
					? entries.push({
							name,
							path: entryPath,
							type: 'file',
							handle: handle as FileSystemFileHandle,
							extension: name.split('.').pop() as Extension
						})
					: entries.push({
							name,
							path: entryPath,
							type: 'directory',
							handle: handle as FileSystemDirectoryHandle,
							children: await this.list(entryPath)
						})
			}

			return entries
		} catch (e) {
			console.error(e)
			return []
		}
	}

	async copyFile(
		source: string,
		dest: string,
		options?: CopyOptions
	): Promise<void> {
		const sourceHandle = await this.getHandle(source)
		if (sourceHandle.kind !== 'file') {
			throw new Error(`Source is not a file: ${source}`)
		}

		if (!options?.overwrite) {
			const destinationExists = await this.exists(dest)
			if (destinationExists) {
				throw new Error(`Destination '${dest}' already exists.`)
			}
		}

		const file = await this.read(source)
		await this.write(dest, await file.arrayBuffer())

		await this.triggerWatchEvent('add', dest)
	}

	watch(path: string, callback: (event: FSWatchEvent) => void): () => void {
		if (!this.watchers.has(path)) {
			this.watchers.set(path, new Set())
		}
		const watchersSet = this.watchers.get(path)!
		watchersSet.add(callback)

		return () => {
			watchersSet.delete(callback)
			if (watchersSet.size === 0) {
				this.watchers.delete(path)
			}
		}
	}

	async createFile(path: string, options?: CreateFileOptions): Promise<File> {
		const { parentHandle, itemName } = await this.navigateToParentHandle(path, {
			create: options?.recursiveDirs
		})
		const exists = await this.exists(path)
		if (exists && !options?.overwrite) {
			throw new Error(`File already exists at path: ${path}`)
		}

		const fileHandle = await parentHandle.getFileHandle(itemName, {
			create: true
		})

		if (options?.overwrite) {
			const writable = await fileHandle.createWritable({
				keepExistingData: false
			})
			await writable.close()
		}

		const file = await fileHandle.getFile()

		await this.triggerWatchEvent('add', path)

		return file
	}

	async createDirectory(
		path: string,
		options?: CreateDirectoryOptions
	): Promise<FSNode[]> {
		if (options?.recursive) {
			const parts = path.split('/')

			let currentPath = ''
			for (const part of parts) {
				currentPath = currentPath ? `${currentPath}/${part}` : part
				await this.getDirectoryHandle(currentPath, { create: true })

				await this.triggerWatchEvent('add', currentPath)
			}
		} else {
			await this.getDirectoryHandle(path, { create: true })
			await this.triggerWatchEvent('add', path)
		}

		return this.getNodeRepresentation(path)
	}

	async *chunker(
		file: File | Blob,
		chunkSize: number | ((offset: number, fileSize: number) => number)
	) {
		let offset = 0

		while (offset < file.size) {
			const resolvedChunkSize =
				typeof chunkSize === 'function'
					? chunkSize(offset, file.size)
					: chunkSize

			yield this.chunk(file, offset, resolvedChunkSize)
			offset += resolvedChunkSize
		}
	}
	async deleteAll(): Promise<void> {
		const rootHandle = this.rootHandle

		for await (const [name] of rootHandle) {
			const entryPath = `/${name}`
			try {
				await rootHandle.removeEntry(name, { recursive: true })

				await this.triggerWatchEvent('delete', entryPath)
			} catch (e) {
				console.error('Error deleting', entryPath, e)
			}
		}
	}
	async info(path: string): Promise<FileSystemInfo> {
		const handle = await this.getHandle(path)
		const now = Date.now()
		if (handle.kind === 'directory') {
			return {
				type: handle.kind,
				name: handle.name,
				mode: 0o755,
				nlink: 1,
				uid: 0,
				gid: 0,
				atimeMs: now,
				mtimeMs: now,
				ctimeMs: now,
				birthtimeMs: now
			}
		}
		// const stats = await handle.
		const file = await this.read(path)
		return {
			type: handle.kind,
			name: handle.name,
			size: file.size,
			mode: 0o755,
			nlink: 1,
			uid: 0,
			gid: 0,
			atimeMs: now,
			mtimeMs: now,
			ctimeMs: now,
			birthtimeMs: now
		}
	}
	// return handle.queryPermission()

	private async copyDirectory(source: string, destination: string) {
		const sourceHandle = await this.getDirectoryHandle(source)
		await this.createDirectory(destination, { recursive: true })

		for await (const [name, handle] of sourceHandle) {
			const sourcePath = `${source}/${name}`
			const destPath = `${destination}/${name}`

			if (handle.kind === 'file') {
				await this.copyFile(sourcePath, destPath)
			} else {
				await this.copyDirectory(sourcePath, destPath)
			}
		}
	}

	private async triggerWatchEvent(
		eventType: 'add' | 'update' | 'delete',
		path: string
	): Promise<void> {
		for (const [watchPath, callbacks] of this.watchers.entries()) {
			if (path === watchPath || path.startsWith(watchPath + '/')) {
				const event: FSWatchEvent = { type: eventType, path }
				for (const callback of callbacks) {
					callback(event)
				}
			}
		}
	}

	private chunk(file: File | Blob, offset: number, chunkSize: number) {
		const end = Math.min(offset + chunkSize, file.size)
		return file.slice(offset, end)
	}
}

class FileSystemWrapper implements NodeAPI {
	private fileSystemAPI: FileSystemAPI

	constructor(fileSystemAPI: FileSystemAPI) {
		this.fileSystemAPI = fileSystemAPI
	}

	async readFile(path: string, options?: any): Promise<string | Buffer> {
		const file = await this.fileSystemAPI.read(path)
		return file instanceof ArrayBuffer ? Buffer.from(file) : file.toString()
	}

	async writeFile(
		file: string,
		data: string | Buffer,
		options?: any
	): Promise<void> {
		const content = Buffer.isBuffer(data) ? data.toString() : data
		await this.fileSystemAPI.write(file, content)
	}

	async unlink(path: string): Promise<void> {
		await this.fileSystemAPI.delete(path)
	}

	async readdir(path: string, options?: any): Promise<string[]> {
		const nodes = await this.fileSystemAPI.list(path)
		return nodes.map(node => node.name)
	}

	async mkdir(path: string, options?: any): Promise<void> {
		await this.fileSystemAPI.createDirectory(path)
	}

	async rmdir(path: string): Promise<void> {
		await this.fileSystemAPI.delete(path, { recursive: true })
	}

	async stat(path: string): Promise<FileSystemStats> {
		const fileInfo = await this.fileSystemAPI.info(path)

		return {
			dev: 0,
			ino: 0,
			mode: fileInfo.mode,
			nlink: fileInfo.nlink,
			uid: fileInfo.uid,
			gid: fileInfo.gid,
			rdev: 0,
			size: fileInfo?.size ?? 0,
			blksize: 4096,
			blocks: Math.ceil((fileInfo?.size ?? 4096) / 4096),
			atimeMs: fileInfo.atimeMs,
			mtimeMs: fileInfo.mtimeMs,
			ctimeMs: fileInfo.ctimeMs,
			birthtimeMs: fileInfo.birthtimeMs,
			atime: new Date(fileInfo.atimeMs),
			mtime: new Date(fileInfo.mtimeMs),
			ctime: new Date(fileInfo.ctimeMs),
			birthtime: new Date(fileInfo.birthtimeMs)
		}
	}

	async lstat(path: string): Promise<FileSystemStats> {
		return this.stat(path)
	}

	// Optional methods for symlink, readlink, and chmod
	async symlink(target: string, path: string, type?: string): Promise<void> {
		// Implement symlink logic based on your FileSystemAPI if supported
		throw new Error('symlink not implemented in FileSystemAPI')
	}

	async readlink(path: string): Promise<string> {
		// Implement readlink logic if your FileSystemAPI supports symbolic links
		throw new Error('readlink not implemented in FileSystemAPI')
	}

	async chmod(path: string, mode: string | number): Promise<void> {
		// Implement chmod logic if supported
		throw new Error('chmod not implemented in FileSystemAPI')
	}
}
