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
	mainSideBarPostion,
	setHorizontalPanelSize,
	setMainSideBarPostion
} from '~/stores/appStateStore'

interface PrimarySideBarCtxMenuProps {
	children: JSX.Element
}
export function PrimarySideBarCtxMenu(props: PrimarySideBarCtxMenuProps) {
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
							setMainSideBarPostion(
								mainSideBarPostion() === 'left' ? 'right' : 'left'
							)
							setHorizontalPanelSize(size => [size[1], size[0]])
						}}
						class="text-xs"
					>
						Move Primary Side Bar{' '}
						{mainSideBarPostion() === 'left' ? 'right' : 'left'}
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenuPortal>
		</ContextMenu>
	)
}
