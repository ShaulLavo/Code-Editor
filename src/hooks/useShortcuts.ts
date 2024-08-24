import { createShortcut, useKeyDownList } from '@solid-primitives/keyboard'
import { Accessor, Resource, Setter, createEffect } from 'solid-js'
import { formatter } from '../format'

export const useShortcuts = (
	code: Accessor<string> | Resource<string | undefined>,
	setCode: Setter<string | undefined>
) => {
	createShortcut(
		['Alt', 'Shift', 'F'],
		async () => {
			const formatted = await formatter()(code()!)
			setCode(formatted)
		},
		{ preventDefault: true }
	)
	createShortcut(
		['Alt', 'Shift', 'Ï'],
		async () => {
			const formatted = await formatter()(code()!)
			setCode(formatted)
		},
		{ preventDefault: true }
	)

	const pressed = useKeyDownList()
	createEffect(() => {
		console.log('pressed', pressed())
	})
}
