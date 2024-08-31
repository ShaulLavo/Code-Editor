import { VsClose } from 'solid-icons/vs'
import {
	Accessor,
	For,
	batch,
	createEffect,
	createSignal,
	useContext,
	type Component
} from 'solid-js'
import { EditorFSContext } from '~/context/FsContext'
import { currentColor, isDark } from '~/stores/themeStore'
import { AutoAnimeListContainer } from './AutoAnimatedList'

interface EditorTabsProps {
	filePath: Accessor<string | undefined>
}

export const EditorTabs: Component<EditorTabsProps> = ({ filePath }) => {
	const { openPaths } = useContext(EditorFSContext)

	return (
		<AutoAnimeListContainer
			component="div"
			class="flex overflow-x-auto whitespace-nowrap"
		>
			<For each={openPaths()}>
				{(path, index) => <Tab file={path} filePath={filePath} index={index} />}
			</For>
		</AutoAnimeListContainer>
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
	const { openPaths, setCurrentPath, fileMap, saveTabs, currentPath } =
		useContext(EditorFSContext)
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

	return (
		<div
			title={currentPath()}
			ref={tabRef}
			onMouseOver={() => setIsHovered(true)}
			onMouseOut={() => setIsHovered(false)}
			onClick={() => {
				batch(() => {
					setCurrentPath(file)
				})
			}}
			class={`px-4 py-2 focus:outline-none text-sm items-center flex cursor-pointer ${
				isSelected()
					? `${isDark() ? 'bg-white' : 'bg-blue-300'} bg-opacity-20`
					: ''
			}`}
			data-value={file}
			role="button"
		>
			{file.split('/').pop()}

			<button
				onClick={e => {
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
						await saveTabs(fileMap.keys())
					})
				}}
				style={{ visibility: isHovered() ? 'visible' : 'hidden' }}
			>
				<VsClose color={currentColor()} />
			</button>
		</div>
	)
}
