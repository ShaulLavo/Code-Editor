import { insertTab } from '@codemirror/commands'
import { Command, KeyBinding } from '@codemirror/view'
import { vscodeKeymap } from '@replit/codemirror-vscode-keymap'
import { FileSystemCtx } from '~/context/FsContext'
import { formatCode, getConfigFromExt } from '~/format'
// import { code, setCode } from '~/stores/editorStore'

const overrideMap = {
	Tab: { key: 'Tab', run: insertTab, preventDefault: true },
	'Mod-f': {
		key: 'Mod-f',
		run: (_ => console.log('search')) as Command,
		preventDefault: true
	}
} as Record<string, KeyBinding>

export function createKeymap(fsCtx: FileSystemCtx) {
	const { fileMap, filePath, currentExtension, code, setCode, fs } = fsCtx
	const additonalKeymap = [
		{
			key: 'Shift-Alt-f',
			run: () => {
				console.log('format')
				formatCode(getConfigFromExt(currentExtension()), code, setCode)
				return true
			},
			preventDefault: true
		},
		{
			key: 'Mod-s',
			run: () => {
				console.log('saving', filePath())
				if (!fileMap.has(filePath()!)) {
					console.log('no file')
					return false
				}
				const currentCode = code()
				if (currentCode == undefined) {
					console.log('no code')
					return false
				}
				fileMap.set(filePath()!, currentCode)
				fs()
					?.write(filePath()!, currentCode)
					.then(() => {
						console.log('saved', filePath())
					})
				return true
			},
			preventDefault: true
		}
	] as KeyBinding[]

	return vscodeKeymap
		.map(binding => {
			if (binding.key && overrideMap[binding.key])
				return overrideMap[binding.key]
			return binding
		})
		.concat(additonalKeymap)
}
