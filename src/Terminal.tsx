import { ClipboardAddon } from '@xterm/addon-clipboard'
import { FitAddon } from '@xterm/addon-fit'
import { SearchAddon } from '@xterm/addon-search'
import { Terminal as Xterm } from '@xterm/xterm'
import minimist from 'minimist'
import {
	Accessor,
	createEffect,
	createSignal,
	on,
	onMount,
	type Component,
	createResource,
	Resource
} from 'solid-js'
import { Readline } from 'xterm-readline'
import { Node } from './fileSystem/fileSystem.service'
import { terminalFS } from './stores/fsStore'
import { xTermTheme } from './stores/themeStore'
import './xterm.css'
import { Buffer } from 'buffer'
window.Buffer = Buffer
import git from 'isomorphic-git'
import http from 'isomorphic-git/http/web'
import NodeFs, { NodeFsAdapter } from './fileSystem/nodeFs'
const { setCurrentPath, currentPath, fs } = terminalFS

import { configure, InMemory, fs as bFs } from '@zenfs/core'
import { IndexedDB } from '@zenfs/dom'
import { setIsGitLoading } from './stores/editorStore'
import { createInnerZoom } from './hooks/createInnerZoom'
import {
	NullableSize,
	createElementSize
} from '@solid-primitives/resize-observer'
import { size } from '@floating-ui/core'

const createBrowserFS = async () => {
	await configure({
		mounts: {
			'/git': IndexedDB
		}
	})
	return bFs.promises
}

async function cd(filesystem: any, path: string): Promise<void> {
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

	if (await filesystem.isDirectory(newPath)) {
		setCurrentPath(newPath)
	} else {
		throw new Error(`cd: ${path}: No such directory`)
	}
}
async function ls(path: string = currentPath()): Promise<string> {
	const directoryContents = await fs.readDirectory(resolvePath(path))

	const filesAndDirectories = [
		...directoryContents.directories.map(dir => `${dir.name}/`),
		...directoryContents.files.map(file => file.name)
	]

	const maxLength = Math.max(...filesAndDirectories.map(item => item.length), 0)

	const terminalWidth = 80
	const columnWidth = maxLength + 2
	const numColumns = Math.floor(terminalWidth / columnWidth)

	// Format the output
	let formattedOutput = ''
	filesAndDirectories.forEach((item, index) => {
		formattedOutput += item.padEnd(columnWidth)
		if ((index + 1) % numColumns === 0) {
			formattedOutput += '\n'
		}
	})

	return formattedOutput.trimEnd()
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
	if (await filesystem.isDirectory(fullPath)) {
		await filesystem.removeDirectory(fullPath)
	} else if (await filesystem.isFile(fullPath)) {
		await filesystem.removeFile(fullPath)
	} else {
		throw new Error(`rm: ${path}: No such file or directory`)
	}
}

async function mv(source: string, destination: string): Promise<void> {
	const sourcePath = resolvePath(source)
	const destinationPath = resolvePath(destination)
	await fs.moveFile(sourcePath, destinationPath)
}

async function cp(source: string, destination: string): Promise<void> {
	const sourcePath = resolvePath(source)
	const destinationPath = resolvePath(destination)
	await fs.copyFile(sourcePath, destinationPath)
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

async function typeEffect(rl: any, text: string, delay: number = 100) {
	for (let i = 0; i < text.length; i++) {
		rl.write(text.charAt(i))
		const randomDelay = delay + Math.floor(Math.random() * 50 - 25) // Adding randomness to the delay
		await new Promise(resolve => setTimeout(resolve, randomDelay))
	}
	rl.write('\r\n')
}
async function clone(gitFs: Resource<typeof bFs.promises>) {
	if (gitFs.loading) return
	try {
		await git.clone({
			fs: gitFs()!,
			http,
			dir: '/',
			corsProxy: 'https://cors.isomorphic-git.org',
			url: 'https://github.com/ShaulLavo/Code-Editor.git',
			ref: 'main',
			singleBranch: true,
			depth: 1
		})
	} catch (e) {
		console.log(e)
	}
}
async function log(gitFs: Resource<typeof bFs.promises>) {
	if (gitFs.loading) return
	try {
		const commits = await git.log({ fs: gitFs()!, dir: '/' })
		console.log(commits)
	} catch (e) {
		console.log(e)
	}
}
async function init(gitFs: Resource<typeof bFs.promises>) {
	await git.init({ fs: gitFs()!, dir: '/' })
}

interface XtermProps {
	size: Readonly<NullableSize>
}

export const Terminal: Component<XtermProps> = props => {
	const [gitFs] = createResource(createBrowserFS)

	const [ref, setRef] = createSignal<HTMLDivElement>(null!)
	const term = new Xterm({
		cursorBlink: true,
		allowProposedApi: true,
		convertEol: true
	})

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

		async function readLine() {
			const text = (await rl.read(promptText())).split(' ')
			const command = text.shift()!
			const args = minimist(text)
			if (command === 'clear') {
				term.clear()
				await typeEffect(rl, 'Cleared terminal')
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
				await typeEffect(rl, 'Hello from xterm.js')
				isInit = false
			}
			readLine()
		})
	})
	createEffect(() => {
		term.options.theme = xTermTheme()
	})
	createEffect(() => {
		fontSize()
		props.size.height
		const propsed = fitAddon.proposeDimensions()
		term.resize(propsed?.cols ?? term.cols, (propsed?.rows ?? 30) - 6)
	})
	return (
		<div
			style={{ height: props.size.height + 'px' }}
			id="terminal"
			ref={setRef}
		/>
	)
}
