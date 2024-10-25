import { Component, createEffect, For } from 'solid-js'
import { useFs } from '~/context/FsContext'
import { currentEditorFs } from '~/stores/appStateStore'

interface EditorNavProps {
	index: number
}
export const EditorNav: Component<EditorNavProps> = ({ index }) => {
	const ctx = useFs('editor-' + index)
	createEffect(() => {
		ctx.filePath()
	})
	const buttons = () =>
		ctx
			.filePath()
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
