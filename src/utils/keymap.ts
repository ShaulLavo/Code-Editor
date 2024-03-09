import { insertTab } from '@codemirror/commands'
import { vscodeKeymap } from '@replit/codemirror-vscode-keymap'

export const defaultKeymap = vscodeKeymap.map(obj =>
	obj.key === 'Tab' && obj.preventDefault
		? { key: 'Tab', run: insertTab, preventDefault: true }
		: obj
)
