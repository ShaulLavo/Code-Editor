import { VsChevronRight } from 'solid-icons/vs'
import {
	Accessor,
	batch,
	createEffect,
	createSignal,
	For,
	onMount,
	Setter,
	Show
} from 'solid-js'

import { makeEventListenerStack } from '@solid-primitives/event-listener'
import { AutoAnimeListContainer } from '~/components/AutoAnimatedList'
import { useEditorFS } from '~/context/FsContext'
import { getLighterRgbColor } from '~/lib/utils'
import { isFile, isFolder, Node } from '~/modules/fileSystem/fileSystem.service'
import { bracketColors, isDark } from '~/stores/themeStore'
import { dirNameIconMap, fileExtIconMap } from './fileSystemIcons'

declare module 'solid-js' {
	namespace JSX {
		interface Directives {
			sortable: boolean
		}
	}
}

interface FilesystemItemProps {
	node: Node
	fullPath?: string
	fontSize?: number
}

interface fsDndProps {
	isOpen: Accessor<boolean>
	setIsOpen: Setter<boolean>
	thisPath: string
	node: Node
}
const useFsDnd = (props: fsDndProps) => {
	const { isOpen, setIsOpen } = props
	const {
		setCurrentPath,
		fs,
		refetchNodes,
		setPathsToOpen,
		fileMap,
		filePath
	} = useEditorFS()

	const [dropzone, setDropzone] = createSignal<HTMLLIElement>(null!)
	const [draggable, setDraggable] = createSignal<HTMLSpanElement>(null!)
	function handleDragStart(event: DragEvent) {
		if (!event.dataTransfer) return
		event.dataTransfer.setData('text/plain', draggable().id)
	}

	async function handleDrop(event: DragEvent) {
		event.preventDefault()
		event.stopPropagation()

		if (!event.dataTransfer) return

		const to = (event.target as HTMLElement)?.id
		const from = event.dataTransfer.getData('text/plain')
		const fileSystem = fs()

		if (!fileSystem || !from || !to) return

		const fromPath = from.split('/').slice(1).join('/')
		let toPath = to.split('/').slice(1).join('/')
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

			// setNodes(produce(nodes => moveNode(unwrap(nodes!), fromPath, toDirPath)))

			if (isFromDir) {
				await fileSystem.moveDirectory(fromPath, toDirPath)
			} else {
				await fileSystem.moveFile(fromPath, toDirPath)
			}

			// non-optimistic refetch
			await refetchNodes()
			const from = fileMap.get('/' + fromPath)

			if (from) {
				const fromP = '/' + fromPath
				const newPath = '/' + toDirPath + '/' + fromPath.split('/').pop()
				batch(() => {
					fileMap.delete(fromP)
					fileMap.set(newPath, from)
					if (fromP === filePath()) {
						setCurrentPath(newPath)
					}
				})
			}
		} catch (error) {
			console.error('Move operation failed:', error)
			// setNodes(produce(nodes => moveNode(unwrap(nodes!), toPath, fromDirPath)))
		}
	}

	function dragOver(event: DragEvent) {
		event.preventDefault()
		event.stopPropagation()

		if (!event.dataTransfer) return
		event.dataTransfer.dropEffect = 'move'

		setTimeout(() => {
			if (!isOpen()) {
				setIsOpen(true)
				setPathsToOpen(current => [...current, props.thisPath])
			}
		}, 300)

		if (!dropzone().style.backgroundColor) {
			dropzone().style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
		}
	}

	function dragEnter(event: DragEvent) {
		event.preventDefault()
		if (isFolder(props.node)) event.stopPropagation()
		if (isFile(props.node)) return
		if (!event.dataTransfer) return

		event.dataTransfer.dropEffect = 'move'

		if (!dropzone().style.backgroundColor) {
			dropzone().style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
		}
	}
	onMount(() => {
		const [listenSpan] = makeEventListenerStack(draggable(), {})
		listenSpan('dragstart', handleDragStart)
		const fileSystem = fs()
		if (!fileSystem) return
		if (isFile(props.node)) return
		const [listenLi] = makeEventListenerStack(dropzone(), {})
		listenLi('drop', handleDrop)
		listenLi('dragenter', dragOver)
		listenLi('dragover', dragEnter)
		listenLi('dragleave', async e => {
			if (dropzone().style.backgroundColor === '') return
			dropzone().style.backgroundColor = ''
		})
	})

	return { setDropzone, setDraggable }
}

export function FilesystemItem(props: FilesystemItemProps) {
	const { currentPath, setCurrentPath, setPathsToOpen, pathsToOpen } =
		useEditorFS()
	const [isOpen, setIsOpen] = createSignal(
		(() => {
			if (!isFolder(props.node)) return false
			const fullPath = `${props.fullPath ?? ''}/${props.node.name}`
			return props.node.isOpen || pathsToOpen().includes(fullPath)
		})()
	)

	const thisPath = `${props.fullPath ?? ''}/${props.node.name}`
	const ext = () =>
		props.node.name.split('.').pop() as keyof typeof fileExtIconMap

	const fileIconPath = () => fileExtIconMap[ext()]
	const fileIcon = () => {
		return fileIconPath() ? (
			<img
				src={fileIconPath()}
				width={props.fontSize}
				height={props.fontSize}
			/>
		) : (
			<img
				src={fileExtIconMap['documentIcon']}
				width={props.fontSize}
				height={props.fontSize}
			/>
		)
	}
	const folderIcon = () =>
		isOpen() ? (
			<img
				src={dirNameIconMap['base-open']}
				width={props.fontSize}
				height={props.fontSize}
			/>
		) : (
			<img
				src={dirNameIconMap['base']}
				width={props.fontSize}
				height={props.fontSize}
			/>
		)
	const handleClick = () => {
		batch(() => {
			if (isFolder(props.node) && props.node.children.length > 0) {
				const open = isOpen()
				if (!open) {
					setPathsToOpen(current => current.filter(path => path !== thisPath))
				}
				setIsOpen(!open)
				// return
			}
			setCurrentPath(thisPath)
		})
	}

	createEffect(() => {
		if (currentPath().startsWith(thisPath)) {
			setIsOpen(true)
		}
	})

	const { setDropzone, setDraggable } = useFsDnd({
		isOpen,
		setIsOpen,
		thisPath,
		node: props.node
	})

	const getLineColor = () => {
		const colorByDepth =
			Object.values(bracketColors())[(thisPath.split('/').length - 1) % 7]
		const alpha = isDark() ? 0.25 : 0.5
		return getLighterRgbColor(colorByDepth, alpha)
	}

	return (
		<AutoAnimeListContainer
			as="li"
			id={'drop' + thisPath}
			setRef={setDropzone}
			class={`transition-colors border-l  ${isDark() ? 'border-opacity-20' : 'border-opacity-40'}`}
			style={{
				'border-color': getLineColor(),
				'margin-left': '-0.5rem',
				'padding-left': '0.5rem'
			}}
		>
			<span
				id={'drag' + thisPath}
				draggable="true"
				ref={setDraggable}
				style={{
					'font-size': `${props.fontSize}px`,
					'padding-bottom': '0.1rem'
					// 'padding-right': '1rem'
				}}
				class={`flex items-center gap-1.5  rounded select-none ${
					currentPath() === thisPath
						? `${isDark() ? 'bg-white' : 'bg-blue-300'} bg-opacity-20 font-bold text-xs`
						: 'text-gray-600 text-xs'
				} ${isDark() ? 'hover:bg-white' : 'hover:bg-gray-500'} hover:bg-opacity-20  hover:font-bold cursor-pointer`}
				onClick={handleClick}
			>
				{isFolder(props.node) && props.node.children.length > 0 && (
					<button class="p-1 -m-1">
						<VsChevronRight
							class={`size-4 text-gray-500 ${isOpen() ? 'rotate-90' : ''}`}
						/>
					</button>
				)}
				{isFolder(props.node) ? folderIcon() : fileIcon()}
				{props.node.name}
			</span>
			<Show when={isOpen()}>
				<ul class="pl-4">
					<For each={isFolder(props.node) && props.node.children}>
						{childNode => (
							<FilesystemItem {...props} node={childNode} fullPath={thisPath} />
						)}
					</For>
				</ul>
			</Show>
		</AutoAnimeListContainer>
	)
}
