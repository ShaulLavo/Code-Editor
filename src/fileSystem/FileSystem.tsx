import {
	Accessor,
	For,
	Setter,
	Suspense,
	createSignal,
	on,
	onMount,
	useContext,
	type Component
} from 'solid-js'

import { FilesystemItem } from './FilesystemItem'
import { Node } from './fileSystem.service'
import { AutoAnimeListContainer } from '~/components/AutoAnimatedList'
import { EditorFSContext } from '~/context/FsContext'
import { createInnerZoom } from '~/hooks/createInnerZoom'

interface FileSystemProps {
	traversedNodes: () => Node[]
}

export const FileSystem: Component<FileSystemProps> = ({ traversedNodes }) => {
	let list: HTMLUListElement = null!
	const [container, setContainer] = createSignal<HTMLDivElement>(null!)
	const { fontSize } = createInnerZoom({
		ref: container,
		key: 'explorer'
	})

	return (
		<div ref={setContainer} class="h-screen">
			<h5 class="pl-8 text-sm">EXPLORER</h5>
			<div class="flex flex-row">
				<Suspense fallback={'loading...'}>
					<AutoAnimeListContainer ref={list}>
						<For each={traversedNodes()}>
							{node => <FilesystemItem node={node} fontSize={fontSize()} />}
						</For>
					</AutoAnimeListContainer>
				</Suspense>
			</div>
		</div>
	)
}
