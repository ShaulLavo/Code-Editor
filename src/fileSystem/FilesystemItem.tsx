import { VsChevronRight, VsFile, VsFolder } from 'solid-icons/vs'
import {
	Accessor,
	For,
	JSX,
	Setter,
	Show,
	batch,
	createEffect,
	createResource,
	createSignal,
	lazy,
	on,
	onMount,
	useContext
} from 'solid-js'
import { currentColor, isDark } from '~/stores/themeStore'
import { Node, findItem, isFile, isFolder } from './fileSystem.service'
import { AutoAnimeListContainer } from '~/components/AutoAnimatedList'
import { useEditorFS } from '~/context/FsContext'
import react_ts from '~/assets/icons/react_ts.svg'
import react from '~/assets/icons/react.svg'
import typescript from '~/assets/icons/typescript.svg'
import javascript from '~/assets/icons/javascript.svg'
import python from '~/assets/icons/python.svg'
import ruby from '~/assets/icons/ruby.svg'
import java from '~/assets/icons/java.svg'
import php from '~/assets/icons/php.svg'
import html from '~/assets/icons/html.svg'
import css from '~/assets/icons/css.svg'
import sass from '~/assets/icons/sass.svg'
import json from '~/assets/icons/json.svg'
import xml from '~/assets/icons/xml.svg'
import yaml from '~/assets/icons/yaml.svg'
import docker from '~/assets/icons/docker.svg'
// import shell from '~/assets/icons/shell.svg'
import typescript_def from '~/assets/icons/typescript-def.svg'
import cpp from '~/assets/icons/cpp.svg'
import csharp from '~/assets/icons/csharp.svg'
import go from '~/assets/icons/go.svg'
import rust from '~/assets/icons/rust.svg'
import perl from '~/assets/icons/perl.svg'
import markdown from '~/assets/icons/markdown.svg'
import swift from '~/assets/icons/swift.svg'
import git from '~/assets/icons/git.svg'
import image from '~/assets/icons/image.svg'
import documentIcon from '~/assets/icons/document.svg'
import folder_base from '~/assets/icons/folder-base.svg'
import folder_base_open from '~/assets/icons/folder-base-open.svg'
import {
	makeEventListener,
	makeEventListenerStack
} from '@solid-primitives/event-listener'
import { createSwapy } from 'swapy'

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
	const [isOpen, setIsOpen] = createSignal(
		isFolder(props.node) ? props.node.isOpen : false
	)
	const thisPath = `${props.fullPath ?? 'root'}/${props.node.name}`
	const { nodes, currentPath, setCurrentPath, fs } = useEditorFS()
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
			if (isFolder(props.node) && props.node.nodes.length > 0) {
				setIsOpen(!isOpen())
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
		if (!event.dataTransfer) return

		//@ts-ignore
		const to = event.target?.id
		const from = event.dataTransfer?.getData('text/plain')

		if (from) {
			const fromSplit = from.split('/')
			fromSplit.shift()
			const fromPath = 'root/' + fromSplit.join('/')
			const toSplit = to.split('/')
			toSplit.shift()
			const toPath = 'root/' + toSplit.join('/')

			const [isFromDir, isTargetDir] = await Promise.all([
				fs.isDirectory(fromPath),
				fs.isDirectory(toPath)
			])
			const fromName = !isFromDir ? '/' + fromSplit.pop() : ''
			const toName = !isTargetDir ? '/' + toSplit.pop() : ''
			// fs.moveFile(fromPath, toPath)
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
	onMount(async () => {
		const [listenSpan] = makeEventListenerStack(draggable, {})
		listenSpan('dragstart', handleDragStart)

		if (isFile(props.node)) return
		if (!(await fs.isDirectory(thisPath))) return

		const [listenLi] = makeEventListenerStack(dropzone, {})
		listenLi('drop', handleDrop)
		listenLi('dragenter', dragOver)
		listenLi('dragover', dragEnter)
		listenLi('dragleave', async e => {
			if (dropzone.style.backgroundColor === '') return
			dropzone.style.backgroundColor = ''
		})
	})

	return (
		<li id={'drop' + thisPath} ref={dropzone} class="transition-colors">
			<span
				id={'drag' + thisPath}
				draggable="true"
				ref={draggable}
				style={{ 'font-size': `${props.fontSize}px` }}
				class={`flex items-center gap-1.5 py-1 px-2 rounded select-none ${
					currentPath() === thisPath
						? `${isDark() ? 'bg-white' : 'bg-blue-300'} bg-opacity-20 font-bold text-xs`
						: 'text-gray-600 text-xs'
				} ${isDark() ? 'hover:bg-white' : 'hover:bg-gray-500'} hover:bg-opacity-20  hover:font-bold cursor-pointer`}
				onClick={handleClick}
			>
				{isFolder(props.node) && props.node.nodes.length > 0 && (
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
				<ul class="pl-6">
					<For each={isFolder(props.node) && props.node.nodes}>
						{childNode => (
							<FilesystemItem {...props} node={childNode} fullPath={thisPath} />
						)}
					</For>
				</ul>
			</Show>
		</li>
	)
}
