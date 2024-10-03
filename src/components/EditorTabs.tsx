import { VsClose } from 'solid-icons/vs'
import {
	Accessor,
	For,
	batch,
	createEffect,
	createSignal,
	onMount,
	useContext,
	type Component
} from 'solid-js'
import { currentColor, isDark } from '~/stores/themeStore'
import { AutoAnimeListContainer } from './AutoAnimatedList'
import { gsap } from 'gsap'

import { Draggable } from 'gsap/Draggable'
import { useEditorFS } from '~/context/FsContext'

gsap.registerPlugin(Draggable)
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
	const { openPaths, setCurrentPath, fileMap, saveTabs, currentPath } =
		useEditorFS()
	let tabRef: HTMLDivElement = null!

	onMount(() => {
		Draggable.create(tabRef, {
			// type: 'y',
			bounds: document.getElementById('root'),

			// inertia: true,
			onClick: function () {
				console.log('clicked')
			},
			onDragEnd: function () {
				console.log('drag ended')
			}
		})
	})

	createEffect(() => {
		if (isSelected()) {
			tabRef.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
				inline: 'nearest'
			})
		}
	})
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
