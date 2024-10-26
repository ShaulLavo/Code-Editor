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
import {
	fontFamilyWithFallback,
	setAvailableFonts,
	setFontFamily,
	setFontSelection
} from '~/stores/fontStore'
import { doc } from 'prettier'
import { OPFS } from '~/FS/OPFS'
import { getNerdFontLinks } from '~/lib/fonts'
export let worker: TypeScriptWorker = null!

export const Main: Component = () => {
	const { code, setCode, refetchNodes, filePath, isTs, fs } = currentEditorFs()

	const [isWorkerReady, setIsWorkerReady] = createSignal(false)
	initTsWorker(async tsWorker => {
		worker = tsWorker
		// await worker.createFile(filePath()!, code()!)
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

	let hasLoadedFontSelection = false
	createEffect(
		on(fs, async fileSystem => {
			if (!fileSystem || hasLoadedFontSelection) return

			const fileName = 'fontLinks.json'
			const fontLinks = await getNerdFontLinks(fs()!)
			let fontFaces = Array.from(await document.fonts.ready)

			hasLoadedFontSelection = true
			const availableFonts = fontFaces.reduce<Record<string, FontFace>>(
				(acc, font) => {
					acc[font.family] = font
					return acc
				},
				{}
			)
			const fonts = await fileSystem.list('root/fonts')
			const savedFonts = await Promise.all(
				fonts.map(async font => {
					if (font.name === 'fontLinks.json') return
					return fileSystem.read(font.path)
				})
			)
			await Promise.all(
				savedFonts
					.filter(f => !!f)
					.map(async (font: File) => {
						const fontBuffer = await font.arrayBuffer()

						const fontFace = new FontFace(font.name, fontBuffer)

						availableFonts[font.name] = fontFace
						document.fonts.add(fontFace)
						try {
							await fontFace.load()
							document.fonts.add(fontFace)
							await document.fonts.ready
							if (!document.fonts.check('italic bold 16px ' + font.name)) {
								console.log('bad font', font.name)
							}
						} catch (e) {
							console.error('font load error', e)
						}
						return fontFace
							.load()
							.then(() => {
								console.log('font loaded', font.name)
								const isFontAvailable = Array.from(document.fonts.values())
								console.log(`Font ${font.name} available:`, isFontAvailable)
							})
							.catch(e => {
								console.error('font load error', e)
							})
					})
			)

			const fontNames = Object.keys(availableFonts).map(font =>
				font.split(' ').join('')
			)

			console.log('fontNames', fontNames)
			fontNames.forEach(fontName => {
				delete fontLinks[fontName]
			})

			setFontSelection(fontLinks)
			setAvailableFonts(availableFonts)
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
					'font-family': fontFamilyWithFallback(),
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
