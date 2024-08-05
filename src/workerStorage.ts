declare global {
	interface FileSystemFileHandle {
		createSyncAccessHandle(): Promise<FileSystemSyncAccessHandle>
	}
	interface FileSystemSyncAccessHandle {
		read(dataView: DataView, options?: { at?: number }): void
		write(data: BufferSource, options?: { at?: number }): void
		truncate(size: number): void
		flush(): void
		getSize(): number
		close(): void
	}
}

const { encode } = new TextEncoder()
const { decode } = new TextDecoder()

async function createWorkerStorage(fileName: string = 'store') {
	const root = await navigator.storage.getDirectory()
	const fileHandle = await root.getFileHandle(fileName, { create: true })
	const accessHandle = await fileHandle.createSyncAccessHandle()

	const readStore = (): { [key: string]: string } => {
		const size = accessHandle.getSize()
		if (size === 0) return {}

		const dataView = new DataView(new ArrayBuffer(size))
		accessHandle.read(dataView, { at: 0 })
		const fileContent = decode(dataView)
		try {
			return JSON.parse(fileContent)
		} catch {
			return {}
		}
	}

	const writeStore = (store: { [key: string]: string }): void => {
		const content = encode(JSON.stringify(store, null, 2))
		accessHandle.truncate(0)
		accessHandle.write(content, { at: 0 })
		accessHandle.flush()
	}

	const storage = {
		setItem(key: string, value: string) {
			const store = readStore()
			store[key] = value
			writeStore(store)
		},
		getItem(key: string): string | null {
			const store = readStore()
			return store[key] || null
		},
		key(index: number): string | null {
			const store = readStore()
			const keys = Object.keys(store)
			return keys[index] || null
		},
		removeItem(key: string) {
			const store = readStore()
			delete store[key]
			writeStore(store)
		},
		clear() {
			accessHandle.truncate(0)
			accessHandle.flush()
		},
		get length(): number {
			const store = readStore()
			return Object.keys(store).length
		},
		get store() {
			return readStore()
		},
		close() {
			accessHandle.close()
		}
	} satisfies Storage

	self.addEventListener('unload', () => {
		console.log('unload')
		accessHandle.close()
	})

	return storage
}

export { createWorkerStorage }
