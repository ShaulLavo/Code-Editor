import { Accessor, For, Setter, Suspense, type Component } from 'solid-js'

import { FilesystemItem } from './FilesystemItem'
import { Node } from './fileSystem.service'

interface FileSystemProps {
	traversedNodes: () => Node[]
}

export const FileSystem: Component<FileSystemProps> = ({ traversedNodes }) => {
	let container: HTMLUListElement = null!
	return (
		<div class="h-screen">
			<h5 class="pl-8 text-sm">EXPLORER</h5>
			<div class="flex flex-row">
				<Suspense fallback={'loading...'}>
					<ul ref={container}>
						<For each={traversedNodes()}>
							{node => <FilesystemItem node={node} />}
						</For>
					</ul>
				</Suspense>
			</div>
		</div>
	)
}
