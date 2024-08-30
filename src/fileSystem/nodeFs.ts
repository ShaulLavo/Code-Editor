import { fs } from '~/stores/fsStore'

const NodeFs = {
	async mkdir(path: string, mode?: any) {
		await fs.createDirectory(path)
	},

	async rmdir(path: string) {
		await fs.removeDirectory(path)
	},

	async readFile(path: string, options?: any) {
		const content = await fs.readFile(path)
		return content
	},

	async writeFile(file: string, data: string, options?: any) {
		await fs.writeFile(file, data)
	},

	async unlink(path: string) {
		await fs.removeFile(path)
	},

	async readdir(path: string, options?: any) {
		const { files } = await fs.readDirectory(path)
		return files
	},

	async stat(path: string, options?: any) {
		const isFile = await fs.isFile(path)
		return {
			isFile: () => isFile,
			isDirectory: () => !isFile
		}
	},

	async lstat(path: string, options?: any) {
		return this.stat(path, options)
	},

	async rm(path: string, options?: { recursive?: boolean }) {
		await fs.remove(path)
	}
}

export default NodeFs

enum FileType {
	FILE = 'file',
	DIRECTORY = 'directory',
	UNKNOWN = 'unknown'
}

const NodeFsAdapter = {
	...NodeFs,

	async getType(path: string): Promise<FileType> {
		const isFile = await fs.isFile(path)
		if (isFile) return FileType.FILE

		const isDirectory = await fs.isDirectory(path)
		if (isDirectory) return FileType.DIRECTORY

		return FileType.UNKNOWN
	},

	async readdir(path: string): Promise<[] | [string, ...string[]]> {
		const files = await NodeFs.readdir(path)
		return files.map(file => file.name) as [string, ...string[]]
	},

	async readFile(path: string): Promise<string> {
		const content = await fs.readFile<string>(path)
		return content
	},

	async rename(previous: string, next: string): Promise<void> {
		const fileDetails = await fs.fileDetails(previous)
		await fs.removeFile(previous)
		await fs.writeFile(next, fileDetails.data as string)
	},

	async rm(path: string): Promise<void> {
		await fs.remove(path)
	},

	async writeFile(path: string, data: string): Promise<void> {
		await fs.writeFile(path, data)
	}
}

export { NodeFsAdapter }
