import hotkeys from 'hotkeys-js'
import { Accessor, Resource, Setter } from 'solid-js'
import { formatter, getConfigFromExt } from '../format'

export const useShortcuts = (
	code:
		| Accessor<string>
		| Resource<string | undefined>
		| (() => string | undefined),
	setCode: Setter<string | undefined> | ((code: string) => void),
	extension: Accessor<string | undefined>
) => {
	const handleFormat = (key: string) => {
		return () => {
			const asyncFormat = async () => {
				const formatted = await formatter()(
					code()!,
					getConfigFromExt(extension())
				)
				setCode(formatted)
			}
			asyncFormat().catch(error => {
				console.error(`Error formatting code with key ${key}:`, error)
			})
		}
	}
	hotkeys('u', function (event, handler) {
		event.preventDefault()
		alert('you pressed u!')
	})

	hotkeys('alt+shift+f', event => {
		event.preventDefault()
		handleFormat('alt+shift+f')()
	})

	hotkeys('alt+shift+i', event => {
		event.preventDefault()
		handleFormat('alt+shift+Ï')()
	})
}
