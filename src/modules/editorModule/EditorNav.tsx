import { Component, For } from 'solid-js'
import { useEditorFS } from '~/context/FsContext'

export const EditorNav: Component = () => {
	const { filePath } = useEditorFS()
	// useShortcuts(code, setCode
	const buttons = () =>
		filePath()
			?.split('/')
			.filter(part => part !== '')

	return (
		<div class="text-xs overflow-x-auto whitespace-nowrap">
			<For each={buttons()}>
				{(part, index) => (
					<span>
						{' '}
						<button
							class="text-xs"
							onClick={() => {
								/* noop */
							}}
						>
							{part + (index() === buttons?.()!.length - 1 ? '' : ' >')}
						</button>{' '}
					</span>
				)}
			</For>
		</div>
	)
}
