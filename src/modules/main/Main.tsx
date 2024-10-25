import { useColorMode } from '@kobalte/core'
import { createElementSize } from '@solid-primitives/resize-observer'
import { WorkerShape } from '@valtown/codemirror-ts/worker'
import { Remote } from 'comlink'
import hotkeys from 'hotkeys-js'
import {
	batch,
	children,
	createEffect,
	createSignal,
	on,
	onMount,
	type Component
} from 'solid-js'
import { Dynamic } from 'solid-js/web'
import ts from 'typescript'
import { CmdK } from '~/components/CmdK'
import { StatusBar } from '~/components/StatusBar'
import {
	Resizable,
	ResizableHandle,
	ResizablePanel
} from '~/components/ui/resizable'
import { runOncePerTick } from '~/lib/utils'
import { initTsWorker, TypeScriptWorker } from '~/lib/worker'
import { PrimarySideBar } from '~/modules/PrimarySideBar/PrimarySideBar'
import {
	currentEditorFs,
	horizontalPanelSize,
	lastKnownLeftSideBarSize,
	lastKnownRightSideBarSize,
	mainSideBarPosition,
	setHorizontalPanelSize,
	setLastKnownLeftSideBarSize,
	setLastKnownRightSideBarSize
} from '~/stores/appStateStore'
import { setIsTsLoading } from '~/stores/editorStore'
import {
	currentBackground,
	currentColor,
	dragHandleColor,
	isDark
} from '~/stores/themeStore'
import '~/xterm.css'
import { MainContent } from './MainContent'
import { CompletionContext } from '@codemirror/autocomplete'
import { EditorState } from '@codemirror/state'
import { setFontSelection } from '~/stores/fontStore'

export let worker: TypeScriptWorker = null!

export const Main: Component = () => {
	const { code, setCode, refetchNodes, filePath, isTs, fs } = currentEditorFs()

	const [isWorkerReady, setIsWorkerReady] = createSignal(false)
	initTsWorker(async tsWorker => {
		worker = tsWorker
		// await worker.createFile(filePath()!, code()!)
		// console.log(await worker.getSourceFile(filePath()!))
		setIsWorkerReady(true)
	}, setIsTsLoading)

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

	async function getNerdFontLinks(): Promise<{ [fontName: string]: string }> {
		const response = await fetch('https://www.nerdfonts.com/font-downloads')
		const html = await response.text()
		const parser = new DOMParser()
		const doc = parser.parseFromString(html, 'text/html')

		return [...doc.querySelectorAll('a')]
			.filter(link => link?.textContent?.trim().toLowerCase() === 'download')
			.reduce(
				(acc, link) => {
					const fontName = link.href.split('/').pop()?.replace('.zip', '')
					if (fontName) {
						acc[fontName] = link.href
					}
					return acc
				},
				{} as { [fontName: string]: string }
			)
	}

	let hasLoadedFontSelection = false
	createEffect(
		on(fs, async fileSystem => {
			if (!fileSystem || hasLoadedFontSelection) return

			const fileName = 'fontLinks.json'
			let fontLinks: Record<string, string> = {}
			try {
				//we get the fontLinks from cache if it exists
				//TODO add revalidation strategy
				if (await fileSystem.exists(fileName)) {
					const currentData = await (await fileSystem.read(fileName)).text()
					if (currentData && currentData.trim().length > 0) {
						fontLinks = JSON.parse(currentData)
					}
				}

				fontLinks = await getNerdFontLinks()
				await fileSystem.write(fileName, JSON.stringify(fontLinks, null, 2))
			} catch (error) {
				console.error('Error handling fontLinks file:', error)
			}
			hasLoadedFontSelection = true
			setFontSelection(fontLinks)
			// document.fonts.ready.then(fontFaceSet => {
			// 	Array.from(fontFaceSet).forEach(fontFace => {
			// 		console.log(fontFace.family)
			// 	})
			// })
		})
	)

	const { setColorMode } = useColorMode()
	createEffect(() => {
		setColorMode(isDark() ? 'dark' : 'light')
	})

	const toggleSideBar = runOncePerTick(() => {
		const position = mainSideBarPosition()
		const currentSize = horizontalPanelSize()
		const isLeft = position === 'left'

		batch(() => {
			if (currentSize[isLeft ? 0 : 1] === 0) {
				const restoredSize = isLeft
					? lastKnownLeftSideBarSize()
					: lastKnownRightSideBarSize()

				if (restoredSize[isLeft ? 0 : 1] !== 0) {
					setHorizontalPanelSize(restoredSize)
				} else {
					setHorizontalPanelSize(isLeft ? [0.3, 0.7] : [0.7, 0.3])
				}
			} else {
				if (isLeft) {
					setLastKnownLeftSideBarSize(currentSize as [number, number])
				} else {
					setLastKnownRightSideBarSize(currentSize as [number, number])
				}

				setHorizontalPanelSize(isLeft ? [0, 1] : [1, 0])
			}
		})

		return true
	})

	hotkeys('ctrl+b', toggleSideBar)

	const mainContent = children(() => (
		<MainContent
			editorSize={editorSize}
			terminalContainerSize={terminalContainerSize}
			isWorkerReady={isWorkerReady}
			setEditorContainer={setEditorContainer}
			setTerminalContainer={setTerminalContainer}
			extraKeyBindings={{ 'Ctrl-b': toggleSideBar }}
		/>
	))
	const primarySideBar = children(() => <PrimarySideBar />)

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
						id="left-sidebar"
					>
						<Dynamic
							component={
								mainSideBarPosition() === 'left' ? primarySideBar : mainContent
							}
						/>
					</ResizablePanel>
					<ResizableHandle
						style={{
							'background-color': dragHandleColor(),
							width: '0.5px'
						}}
					/>
					<ResizablePanel
						class="overflow-hidden"
						initialSize={horizontalPanelSize()?.[1]}
						id="right-sidebar"
					>
						<Dynamic
							component={
								mainSideBarPosition() === 'right' ? primarySideBar : mainContent
							}
						/>
					</ResizablePanel>
				</Resizable>

				<StatusBar ref={setStatusBarRef} isTs={isTs} />
			</main>
		</>
	)
}
