import { VsFile, VsFolder, VsChevronRight } from 'solid-icons/vs'
import {
	Accessor,
	For,
	Setter,
	Show,
	batch,
	createSignal,
	onMount
} from 'solid-js'
import { Node, isFile, isFolder } from './FileSystem'

interface FilesystemItemProps {
	node: Node
	fullPath?: string
	currentPath: Accessor<string>
	setCurrentPath: Setter<string>
	setCurrentNode: Setter<Node>
}

export function FilesystemItem({
	node,
	fullPath = '',
	currentPath,
	setCurrentPath,
	setCurrentNode
}: FilesystemItemProps) {
	const [isOpen, setIsOpen] = createSignal(isFolder(node) ? node.isOpen : false)
	const thisPath = `${fullPath}/${node.name}`

	const handleClick = () =>
		batch(() => {
			if (isFolder(node) && node.nodes.length > 0) {
				setIsOpen(!isOpen())
				return
			}
			setCurrentPath(thisPath)
			setCurrentNode(node)
		})

	onMount(() => {
		if (thisPath === currentPath()) {
			handleClick()
		}
	})
	return (
		<li>
			<span
				class={`flex items-center gap-1.5 py-1 px-2 rounded ${
					currentPath() === thisPath
						? 'bg-blue-100 text-black font-bold'
						: 'text-gray-600'
				} hover:bg-blue-100 hover:text-black hover:font-bold cursor-pointer`}
				onClick={handleClick}
			>
				{isFolder(node) && node.nodes.length > 0 && (
					<button class="p-1 -m-1">
						<VsChevronRight
							class={`size-4 text-gray-500 ${isOpen() ? 'rotate-90' : ''}`}
						/>
					</button>
				)}

				{isFolder(node) ? (
					<VsFolder
						class={`size-6 ${
							node.nodes.length === 0 ? 'ml-[22px]' : 'text-sky-500'
						}`}
					/>
				) : (
					<VsFile class={`ml-[22px] size-6`} />
				)}
				{node.name}
			</span>
			<Show when={isOpen()}>
				<ul class="pl-6">
					<For each={isFolder(node) ? node.nodes : undefined}>
						{childNode => (
							<FilesystemItem
								node={childNode}
								fullPath={thisPath}
								currentPath={currentPath}
								setCurrentPath={setCurrentPath}
								setCurrentNode={setCurrentNode}
							/>
						)}
					</For>
				</ul>
			</Show>
		</li>
	)
}
