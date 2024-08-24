import { VsFile, VsFolder, VsChevronRight } from 'solid-icons/vs'
import {
	Accessor,
	For,
	Setter,
	Show,
	batch,
	createSignal,
	createUniqueId,
	onMount
} from 'solid-js'
import { Node, isFile, isFolder } from './fileSystem.service'
import { currentPath, setCurrentPath } from '~/stores/fsStore'
import { currentColor, isDark } from '~/stores/themeStore'

interface FilesystemItemProps {
	node: Node
	fullPath?: string
}

export function FilesystemItem({ node, fullPath = '' }: FilesystemItemProps) {
	const [isOpen, setIsOpen] = createSignal(isFolder(node) ? node.isOpen : false)
	const thisPath = `${fullPath}/${node.name}`

	const handleClick = () =>
		batch(() => {
			if (isFolder(node) && node.nodes.length > 0) {
				setIsOpen(!isOpen())
				return
			}
			setCurrentPath(thisPath)
		})

	onMount(() => {
		if (thisPath === currentPath()) {
			handleClick()
		}
	})

	return (
		<li class="">
			<span>
				<span
					class={`flex items-center gap-1.5 py-1 px-2 rounded ${
						currentPath() === thisPath
							? `${isDark() ? 'bg-white' : 'bg-gray-500'} bg-opacity-20 font-bold text-xs`
							: 'text-gray-600 text-xs'
					} ${isDark() ? 'hover:bg-white' : 'hover:bg-gray-500'} hover:bg-opacity-20  hover:font-bold cursor-pointer`}
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
							class={`size-4 ${
								node.nodes.length === 0 ? 'ml-[22px]' : currentColor()
							}`}
						/>
					) : (
						<VsFile class={`ml-[22px] size-4`} />
					)}
					{node.name}
				</span>
			</span>
			<Show when={isOpen()}>
				<ul class="pl-6">
					<For each={isFolder(node) && node.nodes}>
						{childNode => (
							<FilesystemItem node={childNode} fullPath={thisPath} />
						)}
					</For>
				</ul>
			</Show>
		</li>
	)
}
