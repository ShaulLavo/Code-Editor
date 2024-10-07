import { usePanelContext } from '@corvu/resizable'
import { onMount } from 'solid-js'
import { FileSystem } from '../fileSystem/FileSystem'
import { PrimarySideBarCtxMenu } from './PrimarySideBarCtxMenu'
import { Portal } from 'solid-js/web'

export function PrimarySideBar() {
	const { panelId, collapse } = usePanelContext()
	onMount(() => {
		console.log(panelId())
		collapse()
	})
	return (
		// <Portal>
		<PrimarySideBarCtxMenu>
			<FileSystem />
		</PrimarySideBarCtxMenu>
		// </Portal>
	)
}
