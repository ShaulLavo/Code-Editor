import { For, Suspense, children, createSignal, type Component } from 'solid-js'

import { AutoAnimeListContainer } from '~/components/AutoAnimatedList'
import { createInnerZoom } from '~/hooks/createInnerZoom'
import { currentEditorFs } from '~/stores/appStateStore'
import { FilesystemItem } from './FilesystemItem'
import { getFirstDirectory, Node } from './fileSystem.service'
import { VsNewFile, VsNewFolder } from 'solid-icons/vs'
import { useFileDrop, useFsDnd } from '~/hooks/usFsDnd'

interface FileSystemProps {
	nodes?: Node[]
}

export const FileSystem: Component<FileSystemProps> = props => {
	let list: HTMLUListElement = null!
	const { currentPath, nodes, fs, refetchNodes } = currentEditorFs()
	const [container, setContainer] = createSignal<HTMLDivElement>(null!)
	const { fontSize } = createInnerZoom({
		ref: container,
		key: 'explorer'
	})
	const { setDropzone } = useFileDrop(async () => void (await refetchNodes()))
	return (
		<div
			ref={ref => {
				setContainer(ref)
				setDropzone(ref)
			}}
			class="h-screen relative z-50 "
		>
			<div class="flex justify-between items-center">
				<h5 class="pl-0.5 text-sm">EXPLORER</h5>
				<div class="flex items-center">
					<span
						class="p-1 hover:bg-gray-200 hover:bg-opacity-10 transition duration-200 ease-in-out"
						onClick={async () => {
							await fs()!.createFile('')
							await refetchNodes()
						}}
					>
						<VsNewFile />
					</span>
					<span
						class="p-1 hover:bg-gray-200 hover:bg-opacity-10 transition duration-200 ease-in-out"
						onClick={async () => {
							const dir = await fs()!.createDirectory('')
							await refetchNodes()
						}}
					>
						<VsNewFolder />
					</span>
				</div>
			</div>

			<Suspense fallback={'loading...'}>
				<AutoAnimeListContainer ref={list} class="pb-10 ">
					{/* <For each={(traversedNodes()?.[0] as Folder | undefined)?.children}> */}
					<For
						each={
							Array.isArray(props.nodes)
								? props.nodes
								: currentEditorFs().traversedNodes()
						}
					>
						{node => <FilesystemItem node={node} fontSize={fontSize()} />}
					</For>
				</AutoAnimeListContainer>
			</Suspense>
		</div>
	)
}
