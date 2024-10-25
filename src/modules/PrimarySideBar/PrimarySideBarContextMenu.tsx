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

interface PrimarySideBarContextMenuProps {
	children: JSX.Element
}
export function PrimarySideBarContextMenu(
	props: PrimarySideBarContextMenuProps
) {
	return (
		<ContextMenu>
			<ContextMenuTrigger>{props.children}</ContextMenuTrigger>
			<ContextMenuPortal>
				<ContextMenuContent class="p-2 capitalize">
					<ContextMenuCheckboxItem class="text-xs" checked={true} disabled>
						Folders
					</ContextMenuCheckboxItem>

					<ContextMenuSeparator />

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
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenuPortal>
		</ContextMenu>
	)
}
