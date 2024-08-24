import { For, Setter, batch, type Component } from 'solid-js'
import { Node } from '../fileSystem/fileSystem.service'
import { setCurrentPath } from '../stores/fsStore'
interface EditorTabsProps {
	fileMap: Map<string, string>
	currentNode: () => Node | undefined
	setCurrentPath: Setter<string>
}
export const EditorTabs: Component<EditorTabsProps> = ({
	fileMap,
	currentNode,
	setCurrentPath
}) => {
	return (
		<For each={Array.from(fileMap.keys())}>
			{file => {
				const isSelected = () => currentNode()?.name === file.split('/').pop()
				return (
					<button
						onClick={() => {
							batch(() => {
								setCurrentPath(file)
							})
						}}
						class={`px-4 py-2 focus:outline-none ${
							isSelected() ? 'bg-white  bg-opacity-50' : ''
						}`}
						data-value={file}
					>
						{file.split('/').pop()}
					</button>
				)
			}}
		</For>
	)
}
