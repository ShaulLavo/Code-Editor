import { For, Suspense, createSignal, type Component } from 'solid-js'

import { AutoAnimeListContainer } from '~/components/AutoAnimatedList'
import { useEditorFS } from '~/context/FsContext'
import { createInnerZoom } from '~/hooks/createInnerZoom'
import { FilesystemItem } from './FilesystemItem'

interface FileSystemProps {}

export const FileSystem: Component<FileSystemProps> = () => {
	let list: HTMLUListElement = null!
	const { traversedNodes } = useEditorFS()
	const [container, setContainer] = createSignal<HTMLDivElement>(null!)
	const { fontSize } = createInnerZoom({
		ref: container,
		key: 'explorer'
	})

	return (
		<div ref={setContainer} class="h-screen relative z-50">
			<h5 class="pl-0.5 text-sm">EXPLORER</h5>
			<Suspense fallback={'loading...'}>
				<AutoAnimeListContainer ref={list} class="pb-10 ">
					{/* <For each={(traversedNodes()?.[0] as Folder | undefined)?.children}> */}
					<For each={traversedNodes()}>
						{node => <FilesystemItem node={node} fontSize={fontSize()} />}
					</For>
				</AutoAnimeListContainer>
			</Suspense>
		</div>
	)
}
