import { createSignal } from 'solid-js'

export const [fontFamily, setFontFamily] =
	createSignal<string>('JetBrains Mono')

export const fontFamilyWithFallback = () => fontFamily() + ', monospace'
export const [fontSelection, setFontSelection] = createSignal<
	Record<string, string>
>({})

export const [availableFonts, setAvailableFonts] = createSignal<
	Record<string, FontFace>
>({})
