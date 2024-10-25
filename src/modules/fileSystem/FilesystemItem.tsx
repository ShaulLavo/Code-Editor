import { VsChevronRight } from 'solid-icons/vs'
import {
	batch,
	createEffect,
	createSignal,
	For,
	onCleanup,
	onMount,
	Show
} from 'solid-js'

import { AutoAnimeListContainer } from '~/components/AutoAnimatedList'
import { pathsToOpen, setPathsToOpen } from '~/context/FsContext'
import { useFsDnd } from '~/hooks/usFsDnd'
import { getLighterRgbColor } from '~/lib/color'
import { isFolder, Node } from '~/modules/fileSystem/fileSystem.service'
import { currentEditorFs } from '~/stores/appStateStore'
import { bracketColors, isDark } from '~/stores/themeStore'
import { FileContextMenu } from './fileContextMenu'
import { dirNameIconMap, fileExtIconMap } from './fileSystemIcons'
import hotkeys from 'hotkeys-js'
import { runOncePerTick } from '~/lib/utils'

// declare module 'solid-js' {
// 	namespace JSX {
// 		interface Directives {
// 			sortable: boolean
// 		}
// 	}
// }

interface FilesystemItemProps {
	node: Node
	fullPath?: string
	fontSize?: number
}

export function FilesystemItem(props: FilesystemItemProps) {
	const { currentPath, setCurrentPath, fs, refetchNodes } = currentEditorFs()
	let [_isOpen, _setIsOpen] = createSignal(
		(() => {
			if (!isFolder(props.node)) return false
			const fullPath = `${props.fullPath ?? ''}/${props.node.name}`
			return props.node.isOpen || pathsToOpen().includes(fullPath)
		})()
	)

	const [newName, setNewName] = createSignal('')
	const thisPath = `${props.fullPath ?? ''}/${props.node.name}`
	const ext = () =>
		props.node.name.split('.').pop() as keyof typeof fileExtIconMap

	const fileIconPath = () => fileExtIconMap[ext()]
	const isMissingName = () => props.node.name === fs()!.NO_NAME_PLACEHOLDER
	const fileIcon = () => (
		<img
			src={fileIconPath() ? fileIconPath() : fileExtIconMap['documentIcon']}
			width={props.fontSize}
			height={props.fontSize}
		/>
	)

	const folderIcon = () => (
		<img
			src={isOpen() ? dirNameIconMap['base-open'] : dirNameIconMap['base']}
			width={props.fontSize}
			height={props.fontSize}
		/>
	)
	const Icon = () => (isFolder(props.node) ? folderIcon() : fileIcon())

	const handleClick = () => {
		if (isMissingName()) return
		batch(() => {
			if (isFolder(props.node) && props.node.children.length > 0) {
				const open = isOpen()
				if (!open) {
					setPathsToOpen(current => current.filter(path => path !== thisPath))
				}
				setIsOpen(!open)
			}
			setCurrentPath(thisPath)
		})
	}

	createEffect(() => {
		if (currentPath().startsWith(thisPath)) {
			setIsOpen(true)
		}
	})

	const { setDropzone, setDraggable, localIsOpen, setLocalIsOpen } = useFsDnd({
		isOpen: _isOpen,
		setIsOpen: _setIsOpen,
		thisPath,
		node: props.node
	})
	const isOpen = () => localIsOpen() || _isOpen()
	const setIsOpen = (open: boolean) => {
		_setIsOpen(open)
		setLocalIsOpen(open)
	}
	const getLineColor = () => {
		const colorByDepth =
			Object.values(bracketColors())[(thisPath.split('/').length - 1) % 7]
		const alpha = isDark() ? 0.25 : 0.5
		return getLighterRgbColor(colorByDepth, alpha)
	}
	const handleRename = runOncePerTick((e: FocusEvent | KeyboardEvent) => {
		if (!isMissingName()) return
		;(async () => {
			try {
				if (newName() !== '') {
					try {
						await fs()!.rename(thisPath, newName())
						// console.log('Renamed:', thisPath, 'to', newName())
						await refetchNodes()
					} catch (renameError) {
						console.error('Error renaming:', renameError)
					}
				} else {
					try {
						await fs()!.delete(thisPath)
						await refetchNodes()
					} catch (deleteError) {
						console.error('Error deleting:', deleteError)
					}
				}
			} catch (error) {
				console.error('Unexpected error in handleRename:', error)
			}
		})()

		return true
	})

	return (
		<FileContextMenu path={thisPath} node={props.node}>
			<AutoAnimeListContainer
				as="li"
				id={'drop' + thisPath}
				setRef={setDropzone}
				class={`transition-colors border-l ${isDark() ? 'border-opacity-20' : 'border-opacity-40'}`}
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
					}}
					class={`flex items-center gap-1.5  rounded select-none ${
						currentPath() === thisPath
							? `${isDark() ? 'bg-white' : 'bg-blue-300'} 
							bg-opacity-20 font-bold text-xs`
							: 'text-gray-600 text-xs'
					} ${isDark() ? 'hover:bg-white' : 'hover:bg-gray-500'} 
					hover:bg-opacity-20  hover:font-bold cursor-pointer`}
					onClick={handleClick}
				>
					{isFolder(props.node) && props.node.children.length > 0 && (
						<button class="p-1 -m-1">
							<VsChevronRight
								class={`size-4 text-gray-500 ${isOpen() ? 'rotate-90' : ''}`}
							/>
						</button>
					)}
					<Icon />
					<Show when={isMissingName()} fallback={props.node.name}>
						<input
							ref={ref =>
								onMount(() => {
									ref.focus()
									ref.addEventListener('keydown', e => {
										if (e.key === 'Enter') {
											handleRename(e)
										}
									})
								})
							}
							onBlur={handleRename}
							onInput={({ currentTarget: { value } }) => setNewName(value)}
							style={{ color: 'black' }}
							class={`${isDark() ? 'bg-white' : 'bg-blue-300'} 
							 px-1 w-full rounded bg-opacity-20`}
						/>
					</Show>
				</span>
				<Show when={isOpen()}>
					<ul class="pl-4">
						<For each={isFolder(props.node) && props.node.children}>
							{childNode => (
								<FilesystemItem
									{...props}
									node={childNode}
									fullPath={thisPath}
								/>
							)}
						</For>
					</ul>
				</Show>
			</AutoAnimeListContainer>
		</FileContextMenu>
	)
}
