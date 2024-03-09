import { createCodeMirror } from 'solid-codemirror'
import { Accessor, Setter, Signal, createSignal, type Component } from 'solid-js'
import { AppTsx, sampleClass, sampleFunc } from './constants'
import { createExtensions } from './extensions'
import { ThemeKey, ThemeSetting, themeSettings } from './themes'

export const Editor = ({ code, setCode }: { code: Accessor<string>; setCode: Setter<string> }) => {
	const [showLineNumber, setShowLineNumber] = createSignal(true)

	const [currentThemeSetting, setCurrentThemeSetting] = createSignal<ThemeSetting>(
		themeSettings.poimandres
	)

	const changeTheme = (themeKey: keyof typeof themeSettings) => {
		setCurrentThemeSetting(themeSettings[themeKey])
	}

	const currentTheme = () => currentThemeSetting().theme
	const currentBackground = () => currentThemeSetting().background
	const currentColor = () => currentThemeSetting().color

	const { ref: EditorRef, createExtension } = createCodeMirror({
		onValueChange: setCode,
		value: code()
	})
	let wrapperRef: HTMLElement = null!

	createExtensions(createExtension)
	createExtension(currentTheme)

	return (
		<main
			ref={wrapperRef}
			class='bg-background-dark h-max'
			style={{ 'background-color': currentBackground() }}>
			<select
				style={{ 'background-color': currentBackground(), color: currentColor() }}
				onChange={e => {
					changeTheme(e.currentTarget.value as ThemeKey)
				}}>
				<option value='poimandres'>Poimandres</option>
				<option value='barf'>Barf</option>
				<option value='dracula'>Dracula</option>
				<option value='ayuLight'>Ayu Light</option>
			</select>
			<div ref={EditorRef} />
		</main>
	)
}
