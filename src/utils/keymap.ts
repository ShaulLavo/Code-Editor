import { insertTab } from '@codemirror/commands'
import { StateCommand } from '@codemirror/state'
import { Command, EditorView, KeyBinding } from '@codemirror/view'
import { vscodeKeymap } from '@replit/codemirror-vscode-keymap'
import { useContext } from 'solid-js'
import { EditorFSContext } from '~/context/FsContext'
import { formatCode, formatter, getConfigFromExt } from '~/format'
import { code, setCode } from '~/stores/editorStore'

const { currentExtension } = useContext(EditorFSContext)

const overrideMap = {
	Tab: { key: 'Tab', run: insertTab, preventDefault: true },
	'Mod-f': {
		key: 'Mod-f',
		run: (_ => console.log('search')) as Command,
		preventDefault: true
	}
} as Record<string, KeyBinding>
const additonalKeymap = [
	{
		key: 'Shift-Alt-f',
		run: () => {
			console.log('format')
			formatCode(getConfigFromExt(currentExtension()))
			return true
		},
		preventDefault: true
	}
] as KeyBinding[]

export const defaultKeymap = vscodeKeymap
	.map(binding => {
		if (binding.key && overrideMap[binding.key]) return overrideMap[binding.key]
		return binding
	})
	.concat(additonalKeymap)
