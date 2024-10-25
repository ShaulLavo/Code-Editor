//TODO: add drag And drop to tabs
//TODO: add a terminal connect it to FS with basic commands (ls, cd, mkdir, touch, rm, cat, echo, clear, pwd, help)
//TODO: add npm https://github.com/naruaway/npm-in-browser
//TODO: add bundler in browser ??
//TODO: run the code (quickjs? but polyfill the enterie DOM, just eval?)
//TODO: ??
//TODO: proft

import {
	ColorModeProvider,
	ColorModeScript,
	createLocalStorageManager
} from '@kobalte/core'
import { createEffect, type Component } from 'solid-js'
import { FsProvider } from '~/context/FsContext'
import {
	baseFontSize,
	bracketColors,
	currentBackground,
	currentColor
} from '~/stores/themeStore'
import '~/xterm.css'
import { Main } from './modules/main/Main'
import { setCSSVariable } from './lib/dom'

const App: Component = () => {
	const storageManager = createLocalStorageManager('vite-ui-theme')

	createEffect(() => {
		setCSSVariable('--current-color', currentColor())
		setCSSVariable('--current-background', currentBackground())

		if (bracketColors()) {
			for (const [key, color] of Object.entries(bracketColors())) {
				setCSSVariable('--rainbow-bracket-' + key, color as string)
			}
			1
		}
	})

	createEffect(() => {
		const fontSize = `${baseFontSize()}px`
		document.documentElement.style.fontSize = fontSize
	})

	return (
		<FsProvider>
			<ColorModeScript storageType={storageManager.type} />
			<ColorModeProvider storageManager={storageManager}>
				<Main />
			</ColorModeProvider>
		</FsProvider>
	)
}

export default App
