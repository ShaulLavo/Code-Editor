import { VsClose } from 'solid-icons/vs'
import {
	Accessor,
	For,
	batch,
	createEffect,
	createSignal,
	onMount,
	type Component
} from 'solid-js'
import { currentColor, isDark } from '~/stores/themeStore'

import { createEventListener } from '@solid-primitives/event-listener'
import { pathsToOpen, setPathsToOpen, useFs } from '~/context/FsContext'
import { saveTabs } from '~/modules/fileSystem/fileSystem.service'
import {
	currentEditorIndex,
	setCurrentEditorIndex
} from '~/stores/appStateStore'

interface EditorTabsProps {
	index: number
}

export const EditorTabs: Component<EditorTabsProps> = ({ index }) => {
	const { openFiles, filePath } = useFs('editor-' + index)

	let tabContainer: HTMLDivElement = null!
	onMount(() => {
		createEventListener(tabContainer, 'wheel', (e: WheelEvent) => {
			e.preventDefault()

			tabContainer.scrollLeft += e.deltaY
		})
	})

	return (
		<div
			ref={tabContainer}
			class="flex overflow-x-auto whitespace-nowrap z-50 relative"
		>
			<For each={openFiles()}>
				{(path, tabIndex) => (
					<Tab
						file={path}
						filePath={filePath}
						tabIndex={tabIndex}
						index={index}
					/>
				)}
			</For>
		</div>
	)
}

const Tab = ({
	file,
	filePath,
	index,
	tabIndex
}: {
	file: string
	filePath: Accessor<string | undefined>
	tabIndex: Accessor<number>
	index: number
}) => {
	const [isHovered, setIsHovered] = createSignal(false)
	const isSelected = () => filePath() === file
	const {
		openFiles,
		setCurrentPath,
		fileMap,
		setLastKnownFile,
		fs,
		currentPath
	} = useFs('editor-' + index)

	let tabRef: HTMLDivElement = null!

	createEffect(() => {
		// if (isSelected() && currentEditorIndex() === index) {
		if (isSelected()) {
			tabRef.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
				inline: 'nearest'
			})
		}
	})

	const onFileClose = (e: Event) => {
		e.stopPropagation()
		batch(async () => {
			if (isSelected()) {
				const currentIndex = tabIndex()
				if (openFiles().length === 1) {
					setLastKnownFile('')
					setCurrentPath('')
				} else if (currentIndex > 0) {
					setLastKnownFile(openFiles()[currentIndex - 1])
					setCurrentPath(openFiles()[currentIndex - 1])
				} else {
					setLastKnownFile(openFiles()[1])
					setCurrentPath(openFiles()[1])
				}
			}
			fileMap.delete(file)
			setPathsToOpen(current => current.filter(path => path !== file))
			console.log('fileMap', fileMap, pathsToOpen())
			await saveTabs(fileMap.keys(), fs()!, 'editor-' + index + '-tab')
		})
	}

	//  EditorState.toJSON/fromJSON save with tab data
	return (
		<div
			title={filePath()}
			ref={tabRef}
			onMouseOver={() => setIsHovered(true)}
			onMouseOut={() => setIsHovered(false)}
			onClick={() => {
				batch(() => {
					setCurrentEditorIndex(index)
					setCurrentPath(file)
				})
			}}
			class={`px-1.5 py-1.5 focus:outline-none text-xs items-center flex cursor-pointer relative z-50 box-border ${
				isSelected()
					? 'border-t-2'
					: `${isDark() ? 'bg-gray-200' : 'bg-gray-600'} bg-opacity-5`
			}`}
			style={{
				'border-color': currentEditorIndex() === index ? currentColor() : ''
			}}
			data-value={file}
			role="button"
		>
			{file.split('/').pop()}

			<button
				onClick={onFileClose}
				class="pl-2 flex items-center justify-center"
				style={{
					visibility: isHovered() || isSelected() ? 'visible' : 'hidden',
					'padding-top': '1.5px'
				}}
			>
				<VsClose size={16} color={currentColor()} />
			</button>
		</div>
	)
}
