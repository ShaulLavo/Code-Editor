import { createEffect, createSignal, type Component } from 'solid-js'
import { Editor } from './Editor'
import { AppTsx, sampleClass, sampleFunc } from './utils/samples'
import { setTheme } from './themes/themes'

const App: Component = () => {
	const [code, setCode] = createSignal(sampleClass + '\n\n' + sampleFunc + '\n' + AppTsx)
	const [showLineNumber, setShowLineNumber] = createSignal(true)
	const [showTopBar, setShowTopBar] = createSignal(true)
	// changeTheme()
	createEffect(() => {
		console.log(showTopBar())
	})
	return (
		<div>
			<div class='justify-evenly flex'>
				<button onClick={() => setTheme('dracula')}>dracula</button>
				<button onClick={() => setShowLineNumber(!showLineNumber())}>LineNumber</button>
				<button onClick={() => setShowTopBar(!showTopBar())}>TopBar</button>
			</div>
			<Editor
				code={code}
				setCode={setCode}
				showLineNumber={showLineNumber}
				showTopBar={showTopBar}
				// defaultTheme='ayuLight'
			/>
		</div>
	)
}

export default App
