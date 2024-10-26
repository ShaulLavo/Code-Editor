import { makePersisted } from '@solid-primitives/storage'
import { createEffect, createSignal } from 'solid-js'
import { setCSSVariable } from '~/lib/dom'

export const [fontFamily, setFontFamily] = makePersisted(
	createSignal<string>('JetBrains Mono'),
	{
		name: 'fontFamily'
	}
)
createEffect(() => {
	setCSSVariable('--font-family', fontFamily())
})
export const fontFamilyWithFallback = () => fontFamily() + ', monospace'
export const [fontSelection, setFontSelection] = createSignal<
	Record<string, string>
>({})

export const [availableFonts, setAvailableFonts] = createSignal<
	Record<string, FontFace>
>({})
