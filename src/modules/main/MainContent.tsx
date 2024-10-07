import { NullableSize } from '@solid-primitives/resize-observer'
import { Accessor, Setter, Show, type Component } from 'solid-js'
import { EditorTabs } from '~/components/EditorTabs'
import {
	Resizable,
	ResizableHandle,
	ResizablePanel
} from '~/components/ui/resizable'
import { useEditorFS } from '~/context/FsContext'
import { Editor } from '~/modules/editorModule/Editor'
import { currentBackground, currentColor, isDark } from '~/stores/themeStore'
import { Terminal } from '~/Terminal'
import '~/xterm.css'
import { getLighterRgbColor } from '~/lib/utils'
import { setVerticalPanelSize, verticalPanelSize } from '~/stores/appStateStore'

interface MainContentProps {
	setEditorContainer: Setter<HTMLDivElement>
	setTerminalContainer: Setter<HTMLDivElement>
	editorSize: Readonly<NullableSize>
	terminalContainerSize: Readonly<NullableSize>
	isWorkerReady: Accessor<boolean>
}
export const MainContent: Component<MainContentProps> = props => {
	const { code, setCode, filePath } = useEditorFS()

	return (
		<Resizable
			onSizesChange={size => {
				if (size.length !== 2) return
				if (size[0] === 0.5 && size[1] === 0.5) return
				setVerticalPanelSize(size)
			}}
			class="w-full"
			style={{
				'background-color': currentBackground(),
				color: currentColor()
			}}
			orientation="vertical"
			accessKey="vertical"
		>
			<ResizablePanel
				ref={props.setEditorContainer}
				class="overflow-hidden"
				initialSize={verticalPanelSize()[0]}
			>
				<Show when={filePath()}>
					<EditorTabs filePath={filePath} />

					<Editor
						code={code}
						setCode={setCode}
						size={props.editorSize}
						isWorkerReady={props.isWorkerReady}
					/>
				</Show>
			</ResizablePanel>
			<ResizableHandle
				style={{
					'background-color': getLighterRgbColor(
						currentColor(),
						isDark() ? 0.25 : 0.5
					)
				}}
			/>
			<ResizablePanel
				class="overflow-hidden p-2"
				initialSize={verticalPanelSize()[1]}
				ref={props.setTerminalContainer}
			>
				<Terminal size={props.terminalContainerSize} />
			</ResizablePanel>
		</Resizable>
	)
}
