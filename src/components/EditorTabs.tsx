import { VsClose } from 'solid-icons/vs'
import {
	Accessor,
	For,
	batch,
	createEffect,
	createSignal,
	type Component
} from 'solid-js'
import { currentColor, isDark } from '~/stores/themeStore'

import { useEditorFS } from '~/context/FsContext'
import { saveTabs } from '~/fileSystem/fileSystem.service'
import { EDITOR_TAB_KEY } from '~/constants/constants'

interface EditorTabsProps {
	filePath: Accessor<string | undefined>
}

export const EditorTabs: Component<EditorTabsProps> = ({ filePath }) => {
	const { openPaths } = useEditorFS()

	return (
		<div class="flex overflow-x-auto whitespace-nowrap z-50 relative">
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
			class={`px-4 py-2 focus:outline-none text-sm items-center flex cursor-pointer relative z-50 ${
				isSelected()
					? `${isDark() ? 'bg-white' : 'bg-blue-300'} bg-opacity-20`
					: ''
			}`}
			data-value={file}
			role="button"
		>
			{file.split('/').pop()}

			<button
				onClick={onFileClose}
				style={{ visibility: isHovered() ? 'visible' : 'hidden' }}
			>
				<VsClose color={currentColor()} />
			</button>
		</div>
	)
}
