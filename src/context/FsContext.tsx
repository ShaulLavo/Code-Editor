import { JSX, createContext } from 'solid-js'
import { editorFS, terminalFS } from '~/stores/fsStore'

export const EditorFSContext = createContext<typeof editorFS>(editorFS)
export const TerminalFSContext = createContext<typeof terminalFS>(terminalFS)

export function EditorFSProvider(props: { children: JSX.Element }) {
	return (
		<EditorFSContext.Provider value={editorFS}>
			{props.children}
		</EditorFSContext.Provider>
	)
}

export function TerminalFSProvider(props: { children: JSX.Element }) {
	return (
		<TerminalFSContext.Provider value={terminalFS}>
			{props.children}
		</TerminalFSContext.Provider>
	)
}
