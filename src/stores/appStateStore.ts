import { makePersisted } from '@solid-primitives/storage'
import { createSignal } from 'solid-js'

export const [mainSideBarPostion, setMainSideBarPostion] = makePersisted(
	createSignal<'left' | 'right'>('left')
)
export const [horizontalPanelSize, setHorizontalPanelSize] = makePersisted(
	createSignal<number[]>([0.25, 0.75]),
	{ name: 'horizontalPanelSize' }
)
export const [verticalPanelSize, setVerticalPanelSize] = makePersisted(
	createSignal<number[]>([0.7, 0.3]),
	{ name: 'verticalPanelSize' }
)
