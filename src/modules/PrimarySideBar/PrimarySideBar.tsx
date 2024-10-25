import { FsContext } from '~/context/FsContext'
import { FileSystem } from '../fileSystem/FileSystem'
import { PrimarySideBarContextMenu } from './PrimarySideBarContextMenu'
import { For, Match, Show, Switch, useContext } from 'solid-js'
import { currentEditorId } from '~/stores/appStateStore'

export function PrimarySideBar() {
	const isSelfReactive = true
	return (
		<PrimarySideBarContextMenu>
			<Show when={!isSelfReactive} fallback={<FileSystem />}>
				<Switch>
					<For each={Object.entries(useContext(FsContext)!.fsContexts)}>
						{([id, fs]) => (
							<Match when={id === currentEditorId()}>
								<FileSystem nodes={fs.nodes()} />
							</Match>
						)}
					</For>
				</Switch>
			</Show>
		</PrimarySideBarContextMenu>
	)
}
