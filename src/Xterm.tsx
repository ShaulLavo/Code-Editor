import { createElementSize } from '@solid-primitives/resize-observer'
import { FitAddon } from '@xterm/addon-fit'
import { Terminal } from '@xterm/xterm'
import { createEffect, createSignal, onMount, type Component } from 'solid-js'
import { currentBackground, currentColor } from './stores/themeStore'
import './xterm.css'
import { SearchAddon } from '@xterm/addon-search'
import { LigaturesAddon } from '@xterm/addon-ligatures'
import { ClipboardAddon } from '@xterm/addon-clipboard'

export const Xterm: Component = () => {
	const [ref, setRef] = createSignal<HTMLDivElement>(null!)
	const term = new Terminal({
		cursorBlink: true,
		allowProposedApi: true
	})

	const fitAddon = new FitAddon()
	const searchAddon = new SearchAddon()
	const clipboardAddon = new ClipboardAddon()

	// const ligaturesAddon = new LigaturesAddon()
	onMount(() => {
		// searchAddon.findNext('foo')

		term.open(ref())

		term.loadAddon(fitAddon)
		term.loadAddon(searchAddon)
		term.loadAddon(clipboardAddon)

		term.write('Hello from xterm.js\r\n')
		term.onData(e => {
			switch (e) {
				case '\u0003': // Ctrl+C
					term.write('^C')
					break
				case '\r': // Enter
					// runCommand(term, command);
					// command = '';
					break
				case '\u007F': // Backspace (DEL)
					term.write('\b \b')
					break
				default:
					// Print all other characters for demo
					if (
						(e >= String.fromCharCode(0x20) &&
							e <= String.fromCharCode(0x7e)) ||
						e >= '\u00a0'
					) {
						// command += e;
						term.write(e)
					}
			}
		})
		createEffect(() => {
			term.options.theme = {
				background: currentBackground(),
				foreground: currentColor(),
				cursor: currentColor()
			}
		})
	})
	return <div id="terminal" class="h-full w-full" ref={setRef} />
}
