import { VsChevronRight, VsFile, VsFolder } from 'solid-icons/vs'
import {
	Accessor,
	For,
	Setter,
	Show,
	batch,
	createEffect,
	createSignal
} from 'solid-js'
import { currentColor, isDark } from '~/stores/themeStore'
import { Node, isFolder } from './fileSystem.service'
import { AutoAnimeListContainer } from '~/components/AutoAnimatedList'

declare module 'solid-js' {
	namespace JSX {
		interface Directives {
			sortable: boolean
		}
	}
}

interface FilesystemItemProps {
	node: Node
	fullPath?: string
	currentPath: Accessor<string>
	setCurrentPath: Setter<string>
}

export function FilesystemItem({
	node,
	fullPath = '',
	currentPath,
	setCurrentPath
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
		})

	createEffect(() => {
		if (currentPath().startsWith(thisPath)) {
			setIsOpen(true)
		}
	})
	return (
		<li class="">
			<span>
				<span
					class={`flex items-center gap-1.5 py-1 px-2 rounded ${
						currentPath() === thisPath
							? `${isDark() ? 'bg-white' : 'bg-blue-300'} bg-opacity-20 font-bold text-xs`
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
				<AutoAnimeListContainer class="pl-6">
					<For each={isFolder(node) && node.nodes}>
						{childNode => (
							<FilesystemItem
								node={childNode}
								fullPath={thisPath}
								setCurrentPath={setCurrentPath}
								currentPath={currentPath}
							/>
						)}
					</For>
				</AutoAnimeListContainer>
			</Show>
		</li>
	)
}
