import { createSignal, type Component } from 'solid-js'
import { Editor } from './Editor'
import { AppTsx, sampleClass, sampleFunc } from './constants'

const App: Component = () => {
	const [code, setCode] = createSignal(AppTsx + '\n' + sampleClass + '\n\n' + sampleFunc)
	return <Editor code={code} setCode={setCode} />
}

export default App
