import { useColorMode } from '@kobalte/core'
import { createElementSize } from '@solid-primitives/resize-observer'
import { createEffect, createSignal, onMount, type Component } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { CmdK } from '~/components/CmdK'
import { StatusBar } from '~/components/StatusBar'
import {
	Resizable,
	ResizableHandle,
	ResizablePanel
} from '~/components/ui/resizable'
import { useEditorFS } from '~/context/FsContext'
import { currentBackground, currentColor, isDark } from '~/stores/themeStore'
import { initTsWorker } from '~/utils/worker'
import '~/xterm.css'
import { getLighterRgbColor } from '~/lib/utils'
import { PrimarySideBar } from '~/modules/PrimarySideBar/PrimarySideBar'
import {
	horizontalPanelSize,
	mainSideBarPostion,
	setHorizontalPanelSize
} from '~/stores/appStateStore'
import { WorkerShape } from '@valtown/codemirror-ts/worker'
import { Remote } from 'comlink'
import ts from 'typescript'
import { MainContent } from './MainContent'

export let worker: WorkerShape & Remote<ts.System> & { close: () => void } =
	null!

export const Main: Component = () => {
	const { code, setCode, refetchNodes, filePath, isTs } = useEditorFS()

	const [isWorkerReady, setIsWorkerReady] = createSignal(false)
	initTsWorker(async tsWorker => {
		worker = tsWorker
		setIsWorkerReady(true)
	})

	let container: HTMLElement = null!
	const [editorContainer, setEditorContainer] = createSignal<HTMLDivElement>(
		null!
	)
	const [terminalContainer, setTerminalContainer] =
		createSignal<HTMLDivElement>(null!)
	const [statusBarRef, setStatusBarRef] = createSignal<HTMLDivElement>(null!)
	const editorSize = createElementSize(editorContainer)
	const terminalContainerSize = createElementSize(terminalContainer)
	const statusBarSize = createElementSize(statusBarRef)

	onMount(async () => {
		document.fonts.ready.then(fontFaceSet => {
			const fontFaces = [...fontFaceSet]
		})
	})

	const { setColorMode } = useColorMode()
	createEffect(() => {
		setColorMode(isDark() ? 'dark' : 'light')
	})
	const MainContentWithProps = () => (
		<MainContent
			editorSize={editorSize}
			terminalContainerSize={terminalContainerSize}
			isWorkerReady={isWorkerReady}
			setEditorContainer={setEditorContainer}
			setTerminalContainer={setTerminalContainer}
		/>
	)

	return (
		<>
			<CmdK code={code} setCode={setCode} refetch={refetchNodes} />

			<main
				ref={container}
				class="dockview-theme-dark"
				style={{
					'font-family': 'JetBrains Mono, monospace',
					height: '100vh',
					overflow: 'hidden',
					'background-color': currentBackground()
				}}
			>
				<Resizable
					sizes={horizontalPanelSize()}
					onSizesChange={size => {
						if (size.length !== 2) return
						if (size[0] === 0.5 && size[1] === 0.5) return

						setHorizontalPanelSize(size)
					}}
					class="w-full flex"
					style={{
						'background-color': currentBackground(),
						color: currentColor()
					}}
					orientation="horizontal"
					accessKey="horizontal"
				>
					<ResizablePanel
						class="overflow-x-hidden border-none"
						initialSize={horizontalPanelSize()?.[0]}
					>
						<Dynamic
							component={
								mainSideBarPostion() === 'left'
									? PrimarySideBar
									: MainContentWithProps
							}
						/>
					</ResizablePanel>
					<ResizableHandle
						style={{
							'background-color': getLighterRgbColor(
								currentColor(),
								isDark() ? 0.25 : 0.5
							),
							width: '0.5px'
						}}
					/>
					<ResizablePanel
						class="overflow-hidden"
						initialSize={horizontalPanelSize()?.[1]}
					>
						<Dynamic
							component={
								mainSideBarPostion() === 'right'
									? PrimarySideBar
									: MainContentWithProps
							}
						/>
					</ResizablePanel>
				</Resizable>

				<StatusBar ref={setStatusBarRef} isTs={isTs} />
			</main>
		</>
	)
}
