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
			<Editor code={code} setCode={setCode} />
			<StatusBar />
		</main>
	)
}

export default App
