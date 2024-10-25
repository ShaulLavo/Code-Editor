import { ClipboardAddon } from '@xterm/addon-clipboard'
import { FitAddon } from '@xterm/addon-fit'
import { SearchAddon } from '@xterm/addon-search'
import { ITheme, Terminal as Xterm } from '@xterm/xterm'
import git, { PromiseFsClient } from 'isomorphic-git'
import http from 'isomorphic-git/http/web'
import minimist from 'minimist'
import { createEffect, createSignal, onMount, type Component } from 'solid-js'
import { Readline } from 'xterm-readline'
import { xTermTheme } from './stores/themeStore'
import './xterm.css'

import { NullableSize } from '@solid-primitives/resize-observer'

import { createInnerZoom } from './hooks/createInnerZoom'
import { currentTerminalFs } from './stores/appStateStore'
import { ReadLine } from 'readline'

interface XtermProps {
	size: Readonly<NullableSize>
}

export const Terminal: Component<XtermProps> = props => {
	const { setCurrentPath, currentPath, fs } = currentTerminalFs()

	async function cd(filesystem: typeof fs, path: string): Promise<void> {
		let newPath: string

		if (path === '.') {
			newPath = currentPath()
		} else if (path === '..') {
			const segments = currentPath().split('/')
			if (segments.length > 1) {
				segments.pop()
				newPath = segments.join('/')
				if (newPath === '' || newPath === '/') {
					newPath = 'root'
				}
			} else {
				newPath = 'root'
			}
		} else {
			if (path.startsWith('/')) {
				newPath = `root${path}`
			} else if (!path.startsWith('root/')) {
				newPath = `${currentPath()}/${path}`
			} else {
				newPath = path
			}
			newPath = resolvePath(newPath)
		}

		if (await filesystem()?.exists(newPath)) {
			setCurrentPath(newPath)
		} else {
			// throw new Error(`cd: ${path}: No such directory`)
		}
	}
	async function ls(path: string = currentPath()): Promise<string> {
		const directoryContents = await fs()?.list(resolvePath(path))

		// const filesAndDirectories = [
		// 	...directoryContents.directories.map(dir => `${dir.name}/`),
		// 	...directoryContents.files.map(file => file.name)
		// ]

		// const maxLength = Math.max(
		// 	...filesAndDirectories.map(item => item.length),
		// 	0
		// )

		// const terminalWidth = 80
		// const columnWidth = maxLength + 2
		// const numColumns = Math.floor(terminalWidth / columnWidth)

		// // Format the output
		// let formattedOutput = ''
		// filesAndDirectories.forEach((item, index) => {
		// 	formattedOutput += item.padEnd(columnWidth)
		// 	if ((index + 1) % numColumns === 0) {
		// 		formattedOutput += '\n'
		// 	}
		// })

		// return formattedOutput.trimEnd()
		return ''
	}

	function pwd(): string {
		return currentPath()
	}

	async function mkdir(filesystem: any, path: string): Promise<void> {
		const fullPath = resolvePath(path)
		await filesystem.createDirectory(fullPath)
	}

	async function touch(filesystem: any, path: string): Promise<void> {
		const fullPath = resolvePath(path)
		await filesystem.writeFile(fullPath, '')
	}

	async function rm(filesystem: any, path: string): Promise<void> {
		const fullPath = resolvePath(path)
		if (await filesystem?.isDirectory(fullPath)) {
			await filesystem.removeDirectory(fullPath)
		} else if (await filesystem?.isFile(fullPath)) {
			await filesystem.removeFile(fullPath)
		} else {
			throw new Error(`rm: ${path}: No such file or directory`)
		}
	}

	async function mv(source: string, destination: string): Promise<void> {
		const sourcePath = resolvePath(source)
		const destinationPath = resolvePath(destination)
		await fs()?.moveFile(sourcePath, destinationPath)
	}

	async function cp(source: string, destination: string): Promise<void> {
		const sourcePath = resolvePath(source)
		const destinationPath = resolvePath(destination)
		await fs()?.copyFile(sourcePath, destinationPath)
	}

	function resolvePath(path: string): string {
		if (path === '/') {
			return 'root'
		}
		if (path.endsWith('/')) {
			path = path.slice(0, -1)
		}
		if (path.startsWith('/')) {
			path = path.slice(1)
		}
		return path
	}

	async function typeEffect(rl: Readline, text: string, delay: number = 100) {
		for (let i = 0; i < text.length; i++) {
			rl.write(text.charAt(i))
			const randomDelay = delay + Math.floor(Math.random() * 50 - 25) // Adding randomness to the delay
			await new Promise(resolve => setTimeout(resolve, randomDelay))
		}
		rl.write('\r\n')
	}
	async function loadingAnimation(
		rl: Readline,
		stopPromise: Promise<void>,
		delay: number = 300,
		type: string = 'arrow'
	) {
		const loadingStages = getLoadingStages(type)
		let stop = false

		stopPromise.then(() => (stop = true))

		while (!stop) {
			for (const stage of loadingStages) {
				if (stop) break
				rl.write('\x1b[2K\r')
				rl.write(`\r${stage}`)
				await new Promise(resolve => setTimeout(resolve, delay))
			}
		}
		rl.write('\x1b[2K\r')
	}

	function getLoadingStages(type: string): string[] {
		switch (type) {
			case 'dots':
				return ['.', '..', '...']
			case 'spinner':
				return ['|', '/', '-', '\\']
			case 'arrow':
				return ['←', '↖', '↑', '↗', '→', '↘', '↓', '↙']
			default:
				return ['.', '..', '...']
		}
	}
	function createSnakeSquareAnimation(size: number): string[] {
		const stages: string[] = []
		const grid = Array.from({ length: size }, () => Array(size).fill(' '))

		// Movement pattern (right, down, left, up)
		const moves = [
			[0, 1],
			[1, 0],
			[0, -1],
			[-1, 0]
		]

		let x = 0,
			y = 0,
			moveIndex = 0

		for (let i = 0; i < size * size; i++) {
			grid[x][y] = 'O'
			stages.push(grid.map(row => row.join(' ')).join('\n'))
			grid[x][y] = ' '
			let [dx, dy] = moves[moveIndex]

			// Calculate the next move
			if (
				x + dx >= size ||
				y + dy >= size ||
				x + dx < 0 ||
				y + dy < 0 ||
				grid[x + dx][y + dy] !== ' '
			) {
				moveIndex = (moveIndex + 1) % 4 // Change direction
				;[dx, dy] = moves[moveIndex]
			}

			x += dx
			y += dy
		}

		return stages
	}
	async function init() {
		await git.init({ fs: { promises: fs()?.NodeAPI! }, dir: 'root' })
	}

	const [ref, setRef] = createSignal<HTMLDivElement>(null!)
	const term = new Xterm({
		cursorBlink: true,
		allowProposedApi: true,
		convertEol: true
	})
	async function clone(gitFs: PromiseFsClient) {
		try {
			await git.clone({
				fs: gitFs,
				http,
				dir: '/',
				corsProxy: 'https://cors.isomorphic-git.org',
				url: 'https://github.com/ShaulLavo/Code-Editor.git',
				ref: 'main',
				singleBranch: true,
				depth: 1
			})
		} catch (e) {
			console.error(e)
		}
	}
	const rl = new Readline()
	const fitAddon = new FitAddon()
	const searchAddon = new SearchAddon()
	const clipboardAddon = new ClipboardAddon()
	const { fontSize, percentChange } = createInnerZoom({
		ref: ref,
		key: 'terminal',
		sync(fontSize) {
			term.options.fontSize = fontSize
			term.refresh(0, term.rows - 1)
		}
	})
	onMount(async () => {
		term.open(ref())

		term.loadAddon(rl)
		rl.setCheckHandler(text => {
			let trimmedText = text.trimEnd()
			if (trimmedText.endsWith('&&')) {
				return false
			}
			return true
		})

		const arrow = '\x1b[36m➜\x1b[0m' // Cyan arrow
		const dir = () => `\x1b[33m${currentPath()}\x1b[0m` // Yellow directory name
		const promptText = () => `${arrow}  ${dir()} `
		function wait(ms: number): Promise<void> {
			return new Promise(resolve => setTimeout(resolve, ms))
		}
		async function readLine() {
			const text = (await rl.read(promptText())).split(' ')
			const command = text.shift()!
			const args = minimist(text)
			if (command === 'clear') {
				term.clear()
				await typeEffect(rl, 'Cleared terminal')
			}
			if (command === 'clone') {
				await clone({ promises: fs()?.NodeAPI! })
			}
			if (command === 'init') {
				await init()
			}
			if (command === 'loading') {
				await loadingAnimation(rl, wait(5000))
			}
			setTimeout(readLine)
			term.scrollToBottom()
		}

		term.loadAddon(fitAddon)
		term.loadAddon(searchAddon)
		term.loadAddon(clipboardAddon)
		fitAddon.activate(term)
		if (!currentPath()) await cd(fs, 'root')
		let isInit = true
		createEffect(async () => {
			if (isInit) {
				await loadingAnimation(rl, wait(1000))
				await typeEffect(rl, 'Hello from xterm.js')
				isInit = false
			}
			readLine()
		})
	})
	createEffect(() => {
		term.options.theme = xTermTheme() as ITheme
	})
	createEffect(() => {
		fontSize()
		props.size.height
		const proposed = fitAddon.proposeDimensions()
		term.resize(proposed?.cols ?? term.cols, (proposed?.rows ?? 30) - 6)
	})
	return (
		<div
			style={{ height: props.size.height + 'px' }}
			id="terminal"
			ref={setRef}
		/>
	)
}
