import { size } from '@floating-ui/core'
import { Component, createSignal, JSX } from 'solid-js'

import {
	ContextMenu,
	ContextMenuCheckboxItem,
	ContextMenuContent,
	ContextMenuGroup,
	ContextMenuGroupLabel,
	ContextMenuItem,
	ContextMenuPortal,
	ContextMenuRadioGroup,
	ContextMenuRadioItem,
	ContextMenuSeparator,
	ContextMenuShortcut,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger
} from '~/components/ui/context-menu'
import {
	mainSideBarPosition,
	setHorizontalPanelSize,
	setMainSideBarPosition
} from '~/stores/appStateStore'
import { Node } from './fileSystem.service'

interface FileContextMenuProps {
	children: JSX.Element
	node: Node
	path: string
}
export function FileContextMenu(props: FileContextMenuProps) {
	return (
		<ContextMenu>
			<ContextMenuTrigger>{props.children}</ContextMenuTrigger>
			<ContextMenuPortal>
				<ContextMenuContent
					oncontextmenu={(e: MouseEvent) => {
						e.preventDefault()
						const clickEvent = new MouseEvent('click', {
							bubbles: true,
							cancelable: true,
							button: 0
						})
						e.currentTarget?.dispatchEvent(clickEvent)
					}}
					class="p-2 capitalize"
				>
					<ContextMenuItem class="text-xs">{props.path}</ContextMenuItem>

					<ContextMenuSeparator />
					{/* 
					<ContextMenuSub overlap>
						<ContextMenuSubTrigger class="text-xs">
							Activty Bar Position
						</ContextMenuSubTrigger>
						<ContextMenuPortal>
							<ContextMenuSubContent>
								<ContextMenuCheckboxItem checked disabled class="text-xs">
									Top
								</ContextMenuCheckboxItem>
								<ContextMenuCheckboxItem disabled class="text-xs">
									Bottom
								</ContextMenuCheckboxItem>
								<ContextMenuCheckboxItem disabled class="text-xs">
									Side
								</ContextMenuCheckboxItem>
								<ContextMenuCheckboxItem disabled class="text-xs">
									Hidden
								</ContextMenuCheckboxItem>
							</ContextMenuSubContent>
						</ContextMenuPortal>
					</ContextMenuSub>
					<ContextMenuItem
						onClick={() => {
							setMainSideBarPosition(
								mainSideBarPosition() === 'left' ? 'right' : 'left'
							)
							setHorizontalPanelSize(size => [size[1], size[0]])
						}}
						class="text-xs"
					>
						Move Primary Side Bar{' '}
						{mainSideBarPosition() === 'left' ? 'right' : 'left'}
					</ContextMenuItem>
					<ContextMenuItem
						onClick={() => {
							setMainSideBarPosition(
								mainSideBarPosition() === 'left' ? 'right' : 'left'
							)
							setHorizontalPanelSize(size => [size[1], size[0]])
						}}
						class="text-xs"
					>
						fold all folders
					</ContextMenuItem>
					<ContextMenuItem
						onClick={() => {
							setMainSideBarPosition(
								mainSideBarPosition() === 'left' ? 'right' : 'left'
							)
							setHorizontalPanelSize(size => [size[1], size[0]])
						}}
						class="text-xs"
					>
						open all folders
					</ContextMenuItem> */}
				</ContextMenuContent>
			</ContextMenuPortal>
		</ContextMenu>
	)
}
