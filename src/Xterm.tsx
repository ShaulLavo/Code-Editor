import { createElementSize } from '@solid-primitives/resize-observer'
import { FitAddon } from '@xterm/addon-fit'
import { Terminal } from '@xterm/xterm'
import {
	Accessor,
	createEffect,
	createSignal,
	onMount,
	type Component
} from 'solid-js'
import {
	currentBackground,
	currentColor,
	xTermTheme
} from './stores/themeStore'
import './xterm.css'
import { SearchAddon } from '@xterm/addon-search'
import { LigaturesAddon } from '@xterm/addon-ligatures'
import { ClipboardAddon } from '@xterm/addon-clipboard'
import { Readline } from 'xterm-readline'
import { Neofetch } from './utils/neoFetch'
import { Node } from './fileSystem/fileSystem.service'
import { fs } from './stores/fsStore'
import minimist from 'minimist'
const [currentDirectory, setCurrentDirectory] = createSignal('root')

export async function cd(filesystem: any, path: string): Promise<void> {
	const newPath = resolvePath(path)
	if (await filesystem.isDirectory(newPath)) {
		setCurrentDirectory(newPath)
	} else {
		throw new Error(`cd: ${path}: No such directory`)
	}
}

export async function ls(
	filesystem: any,
	path: string = currentDirectory()
): Promise<void> {
	const directoryContents = await filesystem.readDirectory(resolvePath(path))
	directoryContents.entries.forEach((entry: { name: string }) => {
		console.log(entry.name)
	})
}

export function pwd(): string {
	return currentDirectory()
}

export async function mkdir(filesystem: any, path: string): Promise<void> {
	const fullPath = resolvePath(path)
	await filesystem.createDirectory(fullPath)
}

export async function touch(filesystem: any, path: string): Promise<void> {
	const fullPath = resolvePath(path)
	await filesystem.writeFile(fullPath, '')
}

export async function rm(filesystem: any, path: string): Promise<void> {
	const fullPath = resolvePath(path)
	if (await filesystem.isDirectory(fullPath)) {
		await filesystem.removeDirectory(fullPath)
	} else if (await filesystem.isFile(fullPath)) {
		await filesystem.removeFile(fullPath)
	} else {
		throw new Error(`rm: ${path}: No such file or directory`)
	}
}

export async function mv(
	filesystem: any,
	source: string,
	destination: string
): Promise<void> {
	const sourcePath = resolvePath(source)
	const destinationPath = resolvePath(destination)
	await filesystem.moveFile(sourcePath, destinationPath)
}

export async function cp(
	filesystem: any,
	source: string,
	destination: string
): Promise<void> {
	const sourcePath = resolvePath(source)
	const destinationPath = resolvePath(destination)
	await filesystem.copyFile(sourcePath, destinationPath)
}

function resolvePath(path: string): string {
	if (path.startsWith('/')) {
		return path
	}
	return `${currentDirectory()}/${path}`.replace(/\/+/g, '/')
}

interface XtermProps {
	dirPath: Accessor<Node | undefined>
}

async function typeEffect(rl: any, text: string, delay: number = 100) {
	for (let i = 0; i < text.length; i++) {
		rl.write(text.charAt(i))
		await new Promise(resolve => setTimeout(resolve, delay))
	}
	rl.write('\r\n')
}

export const Xterm: Component<XtermProps> = ({ dirPath }) => {
	const [ref, setRef] = createSignal<HTMLDivElement>(null!)
	const term = new Terminal({
		cursorBlink: true,
		allowProposedApi: true,
		convertEol: true
	})

	const rl = new Readline()
	const fitAddon = new FitAddon()
	const searchAddon = new SearchAddon()
	const clipboardAddon = new ClipboardAddon()

	// const ligaturesAddon = new LigaturesAddon()
	onMount(() => {
		// searchAddon.findNext('foo')
		let currentLineText = ''
		term.open(ref())
		term.loadAddon(rl)
		rl.setCheckHandler(text => {
			let trimmedText = text.trimEnd()
			if (trimmedText.endsWith('&&')) {
				return false
			}
			return true
		})

		console.log('text', Neofetch.getData())
		const arrow = '\x1b[36m➜\x1b[0m' // Cyan arrow
		const dir = () => `\x1b[33m${currentDirectory()}\x1b[0m` // Yellow directory name
		const promptText = () => `${arrow}  ${dir()} `

		async function readLine() {
			console.log(currentDirectory())
			const text = await rl.read(promptText())
			setTimeout(readLine)
			console.log('text', minimist(text.split(' ')))

			// if (text === 'neofetch') return rl.println(Neofetch.getData())
			// if (text === 'clear') {
			// 	term.clear()
			// 	return readLine()
			// }
			// if (text === 'ls') return ls(fs, currentDirectory())

			// rl.println('you entered: ' + text)
		}

		term.loadAddon(fitAddon)
		term.loadAddon(searchAddon)
		term.loadAddon(clipboardAddon)
		createEffect(async () => {
			if (!dirPath()) return
			await typeEffect(rl, 'Hello from xterm.js')
			readLine()
		})
		// term.onData(async e => {
		// 	switch (e) {
		// 		case 'neofetch':
		// 			const neofetchOutput = await Neofetch.getData()
		// 			term.write(neofetchOutput + '\r\n')
		// 			break
		// 		// case '\u0003': // Ctrl+C
		// 		// 	term.write('^C')
		// 		// 	break

		// 	}
		// })
		createEffect(() => {
			term.options.theme = {
				// background: currentBackground(),
				// foreground: currentColor(),
				// cursor: currentColor(),
				...xTermTheme()
			}
		})
	})
	return <div id="terminal" class="h-full w-full" ref={setRef} />
}
