import { createCodeMirror } from 'solid-codemirror'
import { Accessor, Setter, Show, createEffect } from 'solid-js'
import { createExtensions } from './utils/extensions'
import {
	ThemeKey,
	currentBackground,
	currentColor,
	currentThemeName,
	setTheme,
	themeSettings
} from './themes/themes'

export interface EditorProps {
	code: Accessor<string>
	setCode: Setter<string>
	showTopBar?: Accessor<boolean>
	defaultTheme?: ThemeKey
	showLineNumber?: Accessor<boolean>
}
function capitalizeFirstLetter(word: string): string {
	return word.charAt(0).toUpperCase() + word.slice(1)
}
export const Editor = ({
	code,
	setCode,
	showTopBar,
	defaultTheme,
	showLineNumber
}: EditorProps) => {
	const { ref: EditorRef, createExtension } = createCodeMirror({
		onValueChange: setCode,
		value: code()
	})
	let header: HTMLDivElement = null!
	createEffect(() => {
		console.log(showTopBar!())
	})
	createExtensions(createExtension, showLineNumber)
	defaultTheme && setTheme(defaultTheme)

	return (
		<main style={{ 'font-family': 'JetBrains Mono, monospace' }}>
			<Show when={showTopBar?.()}>
				<div
					ref={header}
					class='bg-background-dark h-max'
					style={{ 'background-color': currentBackground() }}>
					<select
						style={{ 'background-color': currentBackground(), color: currentColor() }}
						onChange={e => {
							setTheme(e.currentTarget.value as ThemeKey)
						}}>
						{Object.keys(themeSettings).map(theme => {
							return (
								<option selected={theme === currentThemeName()} value={theme}>
									{capitalizeFirstLetter(theme)}
								</option>
							)
						})}
					</select>
				</div>
			</Show>

			<div ref={EditorRef} />
		</main>
	)
}
