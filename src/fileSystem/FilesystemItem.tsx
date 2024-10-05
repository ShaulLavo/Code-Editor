import { VsChevronRight } from 'solid-icons/vs'
import {
	For,
	Show,
	batch,
	createEffect,
	createSignal,
	onCleanup,
	onMount
} from 'solid-js'
import css from '~/assets/icons/css.svg'
import docker from '~/assets/icons/docker.svg'
import html from '~/assets/icons/html.svg'
import java from '~/assets/icons/java.svg'
import javascript from '~/assets/icons/javascript.svg'
import json from '~/assets/icons/json.svg'
import php from '~/assets/icons/php.svg'
import python from '~/assets/icons/python.svg'
import react from '~/assets/icons/react.svg'
import react_ts from '~/assets/icons/react_ts.svg'
import ruby from '~/assets/icons/ruby.svg'
import sass from '~/assets/icons/sass.svg'
import typescript from '~/assets/icons/typescript.svg'
import xml from '~/assets/icons/xml.svg'
import yaml from '~/assets/icons/yaml.svg'
import { useEditorFS } from '~/context/FsContext'
import { bracketColors, isDark } from '~/stores/themeStore'
import { Node, isFile, isFolder, moveNode } from './fileSystem.service'
// import shell from '~/assets/icons/shell.svg'
import { makeEventListenerStack } from '@solid-primitives/event-listener'
import cpp from '~/assets/icons/cpp.svg'
import csharp from '~/assets/icons/csharp.svg'
import documentIcon from '~/assets/icons/document.svg'
import folder_base_open from '~/assets/icons/folder-base-open.svg'
import folder_base from '~/assets/icons/folder-base.svg'
import git from '~/assets/icons/git.svg'
import go from '~/assets/icons/go.svg'
import image from '~/assets/icons/image.svg'
import markdown from '~/assets/icons/markdown.svg'
import perl from '~/assets/icons/perl.svg'
import rust from '~/assets/icons/rust.svg'
import swift from '~/assets/icons/swift.svg'
import typescript_def from '~/assets/icons/typescript-def.svg'
import { produce, unwrap } from 'solid-js/store'
import { themeSettings } from '~/main'
import { hexToRgb } from '~/lib/utils'

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
const fileExtIconMap = {
	tsx: react_ts,
	jsx: react,
	ts: typescript,
	js: javascript,
	py: python,
	rb: ruby,
	java: java,
	php: php,
	html: html,
	css: css,
	scss: sass,
	json: json,
	xml: xml,
	yaml: yaml,
	dockerfile: docker,
	// sh: shell,
	'd.ts': typescript_def,
	cpp: cpp,
	cs: csharp,
	go: go,
	rs: rust,
	pl: perl,
	md: markdown,
	swift: swift,
	gitignore: git,
	documentIcon,
	png: image,
	jpg: image,
	jpeg: image,
	svg: image,
	gif: image,
	webp: image,
	ico: image,
	bmp: image,
	tiff: image,
	tif: image,
	heic: image,
	heif: image
}

const dirNameIconMap = {
	base: folder_base,
	'base-open': folder_base_open
}

export function FilesystemItem(props: FilesystemItemProps) {
	const {
		nodes,
		currentPath,
		setCurrentPath,
		fs,
		setNodes,
		refetchNodes,
		setPathsToOpen,
		pathsToOpen
	} = useEditorFS()
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

	let dropzone: HTMLLIElement = null!
	let draggable: HTMLSpanElement = null!

	function handleDragStart(event: DragEvent) {
		if (!event.dataTransfer) return
		event.dataTransfer.setData('text/plain', draggable.id)
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
				setPathsToOpen(current => [...current, thisPath])
			}
		}, 300)

		if (!dropzone.style.backgroundColor) {
			dropzone.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
		}
	}

	function dragEnter(event: DragEvent) {
		event.preventDefault()
		if (isFolder(props.node)) event.stopPropagation()
		if (isFile(props.node)) return
		if (!event.dataTransfer) return

		event.dataTransfer.dropEffect = 'move'

		if (!dropzone.style.backgroundColor) {
			dropzone.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
		}
	}
	onMount(() => {
		const [listenSpan] = makeEventListenerStack(draggable, {})
		listenSpan('dragstart', handleDragStart)
		const fileSystem = fs()
		if (!fileSystem) return
		if (isFile(props.node)) return
		const [listenLi] = makeEventListenerStack(dropzone, {})
		listenLi('drop', handleDrop)
		listenLi('dragenter', dragOver)
		listenLi('dragover', dragEnter)
		listenLi('dragleave', async e => {
			if (dropzone.style.backgroundColor === '') return
			dropzone.style.backgroundColor = ''
		})
	})

	const getLineColor = () => {
		const colorByDepth =
			Object.values(bracketColors())[(thisPath.split('/').length - 1) % 7]
		const rgb = hexToRgb(colorByDepth)
		let rgba = ''
		if (rgb) {
			rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${isDark() ? 0.25 : 0.5})`
		}
		return rgba
	}

	return (
		<li
			id={'drop' + thisPath}
			ref={dropzone}
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
				ref={draggable}
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
		</li>
	)
}
