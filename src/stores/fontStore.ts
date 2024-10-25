import { createSignal } from 'solid-js'

export const [fontSelection, setFontSelection] = createSignal<
	Record<string, string>
>({})
