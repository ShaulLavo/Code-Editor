import {
	Accessor,
	batch,
	createSignal,
	onMount,
	Setter,
	useContext
} from 'solid-js'

import { makeEventListenerStack } from '@solid-primitives/event-listener'
import { FsContext, setPathsToOpen } from '~/context/FsContext'
import { isFile, isFolder, Node } from '~/modules/fileSystem/fileSystem.service'
import { currentEditorFs, currentEditorId } from '~/stores/appStateStore'
import { OPFS } from '~/FS/OPFS'
interface fsDndProps {
	isOpen: Accessor<boolean>
	setIsOpen: Setter<boolean>
	thisPath: string
	node: Node
}
const handleFileEntry = async (
	entry: FileSystemFileEntry,
	fileSystem: OPFS,
	toPath: string
) => {
	entry.file(async file => {
		await fileSystem.write(`${toPath}/${file.name}`, file)
	})
}

const handleDirectoryEntry = async (
	entry: FileSystemDirectoryEntry,
	fileSystem: OPFS,
	toPath: string
) => {
	await fileSystem.createDirectory(toPath + '/' + entry.name)
	await processDirectory(entry, fileSystem, toPath + '/' + entry.name)
}

const processDirectory = async (
	directory: FileSystemDirectoryEntry,
	fileSystem: OPFS,
	parentPath: string
) => {
	const reader = directory.createReader()
	const entries = await new Promise<FileSystemEntry[]>(resolve => {
		reader.readEntries(resolve)
	})

	for (const entry of entries) {
		if (entry.isFile) {
			await handleFileEntry(
				entry as FileSystemFileEntry,
				fileSystem,
				parentPath
			)
		} else if (entry.isDirectory) {
			await handleDirectoryEntry(
				entry as FileSystemDirectoryEntry,
				fileSystem,
				parentPath
			)
		}
	}
}
export function useFsDnd(props: fsDndProps) {
	const { isOpen } = props
	const [localIsOpen, setLocalIsOpen] = createSignal(false)
	const { setCurrentPath, fs, refetchNodes, fileMap, filePath } =
		currentEditorFs()

	const fsCtxs = useContext(FsContext)?.fsContexts!

	let dragTimeout: ReturnType<typeof setTimeout> | null = null

	const { setDraggable, setDropzone, dropzone } = useDnD({
		onDragStart: event => {
			if (!event.dataTransfer) return
			event.dataTransfer.setData('text/plain', (event.target as HTMLElement).id)
		},
		onDrop: async event => {
			event.preventDefault()
			event.stopPropagation()

			if (!event.dataTransfer) return

			const to = (event.target as HTMLElement)?.id
			let toPath = to.split('/').slice(1).join('/')
			const fileSystem = fs()

			if (!fileSystem) return
			if (!to) return

			const items = event.dataTransfer.items
			if (items && items.length > 0) {
				for (const item of items) {
					const entry = item.webkitGetAsEntry()
					if (entry?.isFile) {
						await handleFileEntry(
							entry as FileSystemFileEntry,
							fileSystem,
							toPath
						)
					} else if (entry?.isDirectory) {
						await handleDirectoryEntry(
							entry as FileSystemDirectoryEntry,
							fileSystem,
							toPath
						)
					}
				}
			} else {
				await handleElementDrop(event, toPath, fileSystem)
			}

			// non-optimistic refetch
			await refetchNodes()

			// refetch other file systems in the background
			async function refetchAllExceptCurrent() {
				const currentId = currentEditorId()
				const otherFsCtxs = Object.entries(fsCtxs).filter(
					([id]) => id !== currentId
				)

				await Promise.all(otherFsCtxs.map(([, fsCtx]) => fsCtx.refetchNodes()))
			}
			refetchAllExceptCurrent()
		},
		onDragOver: event => {
			event.preventDefault()
			event.stopPropagation()

			if (!event.dataTransfer) return
			event.dataTransfer.dropEffect = 'move'

			dragTimeout = setTimeout(() => {
				if (!isOpen() && !localIsOpen()) {
					setLocalIsOpen(true)
					setPathsToOpen(current => [...current, props.thisPath])
				}
			}, 300)

			if (!dropzone().style.backgroundColor) {
				dropzone().style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
			}
		},
		onDragEnter: event => {
			event.preventDefault()
			if (isFolder(props.node)) event.stopPropagation()
			if (isFile(props.node)) return
			if (!event.dataTransfer) return

			event.dataTransfer.dropEffect = 'move'

			if (!dropzone().style.backgroundColor) {
				dropzone().style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
			}
		},
		onDragLeave: event => {
			if (dragTimeout) {
				clearTimeout(dragTimeout)
				dragTimeout = null
			}
			if (dropzone().style.backgroundColor !== '') {
				dropzone().style.backgroundColor = ''
			}
			// if (localIsOpen()) {
			// 	setTimeout(() => {
			// 		// setLocalIsOpen(false)
			// 		setPathsToOpen(current =>
			// 			current.filter(path => path !== props.thisPath)
			// 		)
			// 	}, 100)
			// }
		}
	})
	const handleElementDrop = async (
		event: DragEvent,
		toPath: string,
		fileSystem: OPFS
	) => {
		const from = event.dataTransfer?.getData('text/plain')
		if (!from) return
		const fromPath = from.split('/').slice(1).join('/')
		let toDirPath = toPath
		let fromDirPath = fromPath

		try {
			const [fromInfo, targetInfo] = await Promise.all([
				fileSystem.info(fromPath)!,
				fileSystem.info(toPath)!
			])

			const isFromDir = fromInfo.type === 'directory'
			const isTargetDir = targetInfo.type === 'directory'

			if (!isTargetDir) {
				toDirPath = toPath.substring(0, toPath.lastIndexOf('/'))
			}
			if (!isFromDir) {
				fromDirPath = fromPath.substring(0, fromPath.lastIndexOf('/'))
			}

			if (fromDirPath === toDirPath) {
				console.warn('Cannot move a file or directory to the same directory.')
				return
			}

			if (isFromDir) {
				await fileSystem.moveDirectory(fromPath, toDirPath)
			} else {
				await fileSystem.moveFile(fromPath, toDirPath)
			}

			const fromNode = fileMap.get('/' + fromPath)

			if (fromNode) {
				const fromP = '/' + fromPath
				const newPath = '/' + toDirPath + '/' + fromPath.split('/').pop()
				batch(() => {
					fileMap.delete(fromP)
					fileMap.set(newPath, fromNode)
					if (fromP === filePath()) {
						setCurrentPath(newPath)
					}
				})
			}
		} catch (error) {
			console.error('Move operation failed:', error)
		}
	}

	return { setDropzone, setDraggable, localIsOpen, setLocalIsOpen }
}

interface UseDnDProps {
	onDragStart?: (event: DragEvent) => void
	onDrop?: (event: DragEvent) => void
	onDragOver?: (event: DragEvent) => void
	onDragEnter?: (event: DragEvent) => void
	onDragLeave?: (event: DragEvent) => void
}

export function useDnD(props: UseDnDProps) {
	const [draggable, setDraggable] = createSignal<HTMLElement>(null!)
	const [dropzone, setDropzone] = createSignal<HTMLElement>(null!)

	const handleDragStart = (event: DragEvent) => {
		if (props.onDragStart) {
			props.onDragStart(event)
		}
	}

	const handleDrop = (event: DragEvent) => {
		if (props.onDrop) {
			event.preventDefault()
			event.stopPropagation()
			props.onDrop(event)
		}
	}

	const handleDragOver = (event: DragEvent) => {
		if (props.onDragOver) {
			event.preventDefault()
			props.onDragOver(event)
		}
	}

	const handleDragEnter = (event: DragEvent) => {
		if (props.onDragEnter) {
			event.preventDefault()
			props.onDragEnter(event)
		}
	}

	const handleDragLeave = (event: DragEvent) => {
		if (props.onDragLeave) {
			props.onDragLeave(event)
		}
	}

	onMount(() => {
		const [listenDropzone] = makeEventListenerStack(dropzone(), {})
		listenDropzone('drop', handleDrop)
		listenDropzone('dragover', handleDragOver)
		listenDropzone('dragenter', handleDragEnter)
		listenDropzone('dragleave', handleDragLeave)
		if (!draggable()) return
		const [listenSpan] = makeEventListenerStack(draggable(), {})
		listenSpan('dragstart', handleDragStart)
	})

	return { setDraggable, setDropzone, dropzone }
}

export function useFileDrop() {
	const { fs } = currentEditorFs()
	const { setDropzone, setDraggable, dropzone } = useDnD({
		onDrop: async (event: DragEvent) => {
			console.log('DROP DROP DROP DROP DROP DROP DROP DROP DROP DROP DROP DROP')
			console.log('DROP DROP DROP DROP DROP DROP DROP DROP DROP DROP DROP DROP')
			console.log('DROP DROP DROP DROP DROP DROP DROP DROP DROP DROP DROP DROP')
			console.log('DROP DROP DROP DROP DROP DROP DROP DROP DROP DROP DROP DROP')
			const fileSystem = fs()
			if (!fileSystem) return
			const to = (event.target as HTMLElement)?.id
			let toPath = to.split('/').slice(1).join('/')
			event.preventDefault()
			const items = event.dataTransfer?.items

			if (items && items.length > 0) {
				for (const item of items) {
					const entry = item.webkitGetAsEntry()
					if (entry?.isFile) {
						await handleFileEntry(
							entry as FileSystemFileEntry,
							fileSystem,
							toPath
						)
					} else if (entry?.isDirectory) {
						await handleDirectoryEntry(
							entry as FileSystemDirectoryEntry,
							fileSystem,
							toPath
						)
					}
				}
			}
		},
		onDragOver: (event: DragEvent) => {
			event.preventDefault()
		}
	})

	return { setDropzone, setDraggable, dropzone }
}
