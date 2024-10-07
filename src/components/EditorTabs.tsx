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

import { useEditorFS } from '~/context/FsContext'
import { saveTabs } from '~/modules/fileSystem/fileSystem.service'
import { EDITOR_TAB_KEY } from '~/constants/constants'
import { createEventListener } from '@solid-primitives/event-listener'

interface EditorTabsProps {
	filePath: Accessor<string | undefined>
}

export const EditorTabs: Component<EditorTabsProps> = ({ filePath }) => {
	const { openPaths } = useEditorFS()
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
			<For each={openPaths()}>
				{(path, index) => <Tab file={path} filePath={filePath} index={index} />}
			</For>
		</div>
	)
}

const Tab = ({
	file,
	filePath,
	index
}: {
	file: string
	filePath: Accessor<string | undefined>
	index: Accessor<number>
}) => {
	const [isHovered, setIsHovered] = createSignal(false)
	const isSelected = () => filePath() === file
	const { openPaths, setCurrentPath, fileMap, setPathsToOpen, fs } =
		useEditorFS()
	let tabRef: HTMLDivElement = null!

	createEffect(() => {
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
				const currentIndex = index()
				if (openPaths().length === 1) {
					setCurrentPath('')
				} else if (currentIndex > 0) {
					setCurrentPath(openPaths()[currentIndex - 1])
				} else {
					setCurrentPath(openPaths()[1])
				}
			}
			fileMap.delete(file)
			setPathsToOpen(current => current.filter(path => path !== file))
			await saveTabs(fileMap.keys(), fs()!, EDITOR_TAB_KEY)
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
					setCurrentPath(file)
				})
			}}
			class={`px-1.5 py-1.5 focus:outline-none text-xs items-center flex cursor-pointer relative z-50 ${
				isSelected()
					? 'border-t-2'
					: `${isDark() ? 'bg-gray-200' : 'bg-gray-600'} bg-opacity-5`
			}`}
			style={{
				'border-color': currentColor()
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
