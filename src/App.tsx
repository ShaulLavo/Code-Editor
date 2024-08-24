//TODO: connect FS to editor )
//TODO: do not reinstentiate worker on editor change
//TODO: use OPFS as FS (maybe make the same wrapper for both idxDB and OPFS)
//TODO: add a tetminal connect it to FS with basic commands (ls, cd, mkdir, touch, rm, cat, echo, clear, pwd, help)
//TODO: add npm https://github.com/naruaway/npm-in-browser
//TODO: add bundler in browser ??
//TODO: run the code (quickjs? but polyfill the enterie DOM, just eval?)
//TODO: ??
//TODO: proft
import { For, type Component } from 'solid-js'
import ts from 'typescript'
import { Editor } from './Editor'
import { StatusBar } from './StatusBar'
import { code, setCode, setShowLineNumber, showLineNumber } from './editorStore'
import { Formmater } from './format'
import {
	ThemeKey,
	currentBackground,
	currentColor,
	currentThemeName,
	setTheme,
	themeSettings
} from './themeStore'
import { compilerOptions } from './worker'
import { FileSystem } from './fileSystem/FileSystem'
function capitalizeFirstLetter(word: string): string {
	return word.charAt(0).toUpperCase() + word.slice(1)
}
const App: Component = () => {
	let hasTitle = false

	return (
		<main
			style={{
				'font-family': 'JetBrains Mono, monospace',
				height: '100vh',
				'background-color': currentBackground()
			}}
		>
			<div
				class="bg-background-dark h-max absolute top-0 w-full p-2 z-50"
				style={{
					'background-color': currentBackground(),
					color: currentColor()
				}}
			>
				<select
					style={{
						'background-color': currentBackground(),
						color: currentColor()
					}}
					onChange={e => {
						setTheme(e.currentTarget.value as ThemeKey)
					}}
				>
					<For each={Object.keys(themeSettings)}>
						{theme => (
							<option selected={theme === currentThemeName()} value={theme}>
								{capitalizeFirstLetter(theme)}
							</option>
						)}
					</For>
				</select>{' '}
				|{' '}
				<button
					style={{
						color: currentColor()
					}}
					onMouseDown={async () => setCode(await Formmater.prettier(code()))}
				>
					prettier
				</button>{' '}
				|{' '}
				<button
					style={{
						color: currentColor()
					}}
					onMouseDown={() => setShowLineNumber(!showLineNumber())}
				>
					Toggle Line Number
				</button>{' '}
				|{' '}
				<button
					style={{
						color: currentColor()
					}}
					onMouseDown={() => {
						hasTitle = !hasTitle
					}}
				>
					Toggle status
				</button>{' '}
				|
				<button
					style={{
						color: currentColor()
					}}
					onMouseDown={() =>
						setCode(ts.transpileModule(code(), { compilerOptions }).outputText)
					}
				>
					Transpile
				</button>
			</div>
			<FileSystem />
			<StatusBar />
		</main>
	)
}

export default App
