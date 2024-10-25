import { NullableSize } from '@solid-primitives/resize-observer'
import {
	Accessor,
	createSignal,
	For,
	Setter,
	Show,
	type Component
} from 'solid-js'
import { EditorTabs } from '~/components/EditorTabs'
import {
	Resizable,
	ResizableHandle,
	ResizablePanel
} from '~/components/ui/resizable'
import { Editor } from '~/modules/editorModule/Editor'
import {
	setVerticalPanelSize,
	updateEditorPanelSize,
	verticalPanelSize
} from '~/stores/appStateStore'
import {
	currentBackground,
	currentColor,
	dragHandleColor
} from '~/stores/themeStore'
import { Terminal } from '~/Terminal'
import '~/xterm.css'

interface MainContentProps {
	setEditorContainer: Setter<HTMLDivElement>
	setTerminalContainer: Setter<HTMLDivElement>
	editorSize: Readonly<NullableSize>
	terminalContainerSize: Readonly<NullableSize>
	isWorkerReady: Accessor<boolean>
	extraKeyBindings?: Record<string, () => boolean>
}

export const MainContent: Component<MainContentProps> = props => {
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
				<EditorLayout
					extraKeyBindings={props.extraKeyBindings}
					editorSize={props.editorSize}
					isWorkerReady={props.isWorkerReady}
				/>
			</ResizablePanel>
			<ResizableHandle
				style={{
					'background-color': dragHandleColor()
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
interface EditorLayoutProps {
	editorSize: Readonly<NullableSize>
	isWorkerReady: Accessor<boolean>
	extraKeyBindings?: Record<string, () => boolean>
}
const EditorLayout = (props: EditorLayoutProps) => {
	const [editorPanels, setEditorPanels] = createSignal([
		{ id: 1, content: 'Editor 1' }
		// { id: 2, content: 'Editor 2' }
	])
	const [editorSizes, setEditorSizes] = createSignal([1, 1])

	const addEditorPanel = () => {
		const newPanelId = editorPanels().length + 1
		setEditorPanels([
			...editorPanels(),
			{ id: newPanelId, content: `Editor ${newPanelId}` }
		])
		const newSize = 1 / (editorPanels().length + 1)
		setEditorSizes([...Array(editorPanels().length + 1).fill(newSize)])
	}

	return (
		<Resizable
			class="w-full"
			onSizesChange={newSizes => {
				if (newSizes.length === editorPanels().length) {
					setEditorSizes(newSizes)
					updateEditorPanelSize(0, newSizes)
				}
			}}
			style={{
				'background-color': currentBackground(),
				color: currentColor()
			}}
			orientation="horizontal"
			accessKey="horizontal"
		>
			<For each={editorPanels()}>
				{(panel, index) => (
					<>
						<ResizablePanel
							class="overflow-hidden"
							initialSize={editorSizes()[index()]}
							// initialSize={editorSizes()[index()]}
						>
							<EditorTabs index={index()} />
							<Editor
								extraKeyBindings={props.extraKeyBindings}
								size={props.editorSize}
								isWorkerReady={props.isWorkerReady}
								index={index()}
							/>
						</ResizablePanel>
						{index() < editorPanels().length - 1 && (
							<ResizableHandle
								style={{ 'background-color': dragHandleColor() }}
							/>
						)}
					</>
				)}
			</For>
		</Resizable>
	)
}
