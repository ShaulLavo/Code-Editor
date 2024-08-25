import { fs } from '~/stores/fsStore'

class NodeFs {
	static async readFile(path: string, options?: any) {
		const content = await fs.readFile(path)
		return content
	}

	static async writeFile(file: string, data: string, options?: any) {
		await fs.writeFile(file, data)
	}

	static async unlink(path: string) {
		await fs.removeFile(path)
	}

	static async readdir(path: string, options?: any) {
		const { files } = await fs.readDirectory(path)
		return files
	}

	static async mkdir(path: string, mode?: any) {
		await fs.createDirectory(path)
	}

	static async rmdir(path: string) {
		await fs.removeDirectory(path)
	}

	static async stat(path: string, options?: any) {
		const isFile = await fs.isFile(path)
		return {
			isFile: () => isFile,
			isDirectory: () => !isFile
		}
	}

	static async lstat(path: string, options?: any) {
		return this.stat(path, options)
	}

	static async rm(path: string, options?: { recursive?: boolean }) {
		await fs.remove(path)
	}
}

export default NodeFs
