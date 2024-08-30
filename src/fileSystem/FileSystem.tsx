import { Accessor, For, Setter, Suspense, type Component } from 'solid-js'

import { FilesystemItem } from './FilesystemItem'
import { Node } from './fileSystem.service'
import { AutoAnimeListContainer } from '~/components/AutoAnimatedList'

interface FileSystemProps {
	traversedNodes: () => Node[]
	currentPath: Accessor<string>
	setCurrentPath: Setter<string>
}

export const FileSystem: Component<FileSystemProps> = ({
	traversedNodes,
	currentPath,
	setCurrentPath
}) => {
	let container: HTMLUListElement = null!
	return (
		<div class="h-screen">
			<h5 class="pl-8 text-sm">EXPLORER</h5>
			<div class="flex flex-row">
				<Suspense fallback={'loading...'}>
					<AutoAnimeListContainer ref={container}>
						<For each={traversedNodes()}>
							{node => (
								<FilesystemItem
									node={node}
									currentPath={currentPath}
									setCurrentPath={setCurrentPath}
								/>
							)}
						</For>
					</AutoAnimeListContainer>
				</Suspense>
			</div>
		</div>
	)
}
