import { For, Setter, batch, type Component } from 'solid-js'
import { Node } from '../fileSystem/fileSystem.service'
import { setCurrentPath } from '../stores/fsStore'
import { isDark } from '~/stores/themeStore'
import { AutoAnimeListContainer } from './AutoAnimatedList'

interface EditorTabsProps {
	fileMap: Map<string, string>
	filePath: () => string | undefined
	setCurrentPath: Setter<string>
}

export const EditorTabs: Component<EditorTabsProps> = ({
	fileMap,
	filePath,
	setCurrentPath
}) => {
	return (
		<AutoAnimeListContainer
			component="div"
			class="flex overflow-x-auto whitespace-nowrap"
		>
			<For each={Array.from(fileMap.keys())}>
				{file => {
					const isSelected = () => filePath() === file
					return (
						<button
							onClick={() => {
								batch(() => {
									setCurrentPath(file)
								})
							}}
							class={`px-4 py-2 focus:outline-none text-sm ${
								isSelected()
									? `${isDark() ? 'bg-white' : 'bg-blue-300'} bg-opacity-20`
									: ''
							}`}
							data-value={file}
						>
							{file.split('/').pop()}
						</button>
					)
				}}
			</For>
		</AutoAnimeListContainer>
	)
}
