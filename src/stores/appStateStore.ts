import { makePersisted } from '@solid-primitives/storage'
import { createSignal } from 'solid-js'
import { useFs } from '~/context/FsContext'
import { dualStorage } from '~/lib/DualStorage'

export const [mainSideBarPosition, setMainSideBarPosition] = makePersisted(
	createSignal<'left' | 'right'>('left'),
	{ name: 'mainSideBarPosition', storage: dualStorage }
)
if (mainSideBarPosition() !== 'left' && mainSideBarPosition() !== 'right') {
	setMainSideBarPosition('left')
}
export const [horizontalPanelSize, setHorizontalPanelSize] = makePersisted(
	createSignal<number[]>([0.25, 0.75]),
	{ name: 'horizontalPanelSize', storage: dualStorage }
)
export const [verticalPanelSize, setVerticalPanelSize] = makePersisted(
	createSignal<number[]>([0.7, 0.3]),
	{ name: 'verticalPanelSize', storage: dualStorage }
)
export const [editorPanelSizes, setEditorPanelSizes] = makePersisted(
	createSignal<number[][]>([]),
	{ name: 'editorPanelSizes', storage: dualStorage }
)
export const updateEditorPanelSize = (index: number, newSize: number[]) => {
	setEditorPanelSizes(sizes => {
		const updatedSizes = [...sizes]
		updatedSizes[index] = newSize
		return updatedSizes
	})
}

export const [lastKnownLeftSideBarSize, setLastKnownLeftSideBarSize] =
	makePersisted(createSignal<[number, number]>([0.3, 0.7]), {
		name: 'lastKnownLeftSideBarSize',
		storage: dualStorage
	})

export const [lastKnownRightSideBarSize, setLastKnownRightSideBarSize] =
	makePersisted(createSignal<[number, number]>([0.7, 0.3]), {
		name: 'lastKnownRightSideBarSize',
		storage: dualStorage
	})
export const [currentEditorIndex, setCurrentEditorIndex] = createSignal(0)
export const [currentTerminalIndex, setCurrentTerminalIndex] = createSignal(0)
export const currentEditorId = () => 'editor-' + currentEditorIndex()
export const currentTerminalId = () => 'terminal-' + currentEditorIndex()
export const currentEditorFs = () => useFs(currentEditorId())
export const currentTerminalFs = () => useFs(currentTerminalId())
