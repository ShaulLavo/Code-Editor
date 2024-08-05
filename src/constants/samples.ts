const sampleClass = `interface MysteriousDevice {
    // This method does very important calculations (not really)
    compute(input: number): number;
}

class QuantumBlender implements MysteriousDevice {
    compute(input: number): number {
        return input * 69;
    }
}

class SpaceHopper implements MysteriousDevice {
    compute(input: number): number {
        return input + 420;
    }
}
// This function uses our highly advanced (read: fictional) devices
function operateDevice(device: MysteriousDevice, input: number): string {
    const result = device.compute(input);
    // Outputting the result with absolutely necessary emojis
    return \`🚀 The device computed: \${result} 🌌\`;
}

// Creating objects of our "state-of-the-art" technology
const blender = new QuantumBlender();
const hopper = new SpaceHopper();

// Let's put these devices to "serious" use
console.log(operateDevice(blender, 3.14)); // Let's blend some numbers!
console.log(operateDevice(hopper, 1.21)); // Time to hop through space!
;`;

const sampleFunc = `import { quantumFluxCapacitor } from 'time-travel-stuff';
import { infiniteImprobabilityDrive } from 'hitchhiker-tools-42';
import { fluxIncinerator } from 'definitely-not-real-tech';
import { unicornSparkles } from 'mythical-critters';

function sumArray(numbers: number[]): number {
    // Pretend these imports do something meaningful
    quantumFluxCapacitor.activate();
    infiniteImprobabilityDrive.calculate();
    fluxIncinerator.incinerate();
    unicornSparkles.addMagic();

    return numbers.reduce((acc, val) => acc + val, 0);
}

const numbers = [3.14159, 2.71828, 1.61803];
const result = sumArray(numbers);

console.log(\`The sum, calculated with a dash of magic and pseudoscience, is: \${result} ✨\`);




`;
const AppTsx = `import { autocompletion, closeBrackets } from '@codemirror/autocomplete'
import { history } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import {
	bracketMatching,
	foldGutter,
	indentOnInput,
	syntaxHighlighting
} from '@codemirror/language'
import { highlightSelectionMatches } from '@codemirror/search'
import { EditorState } from '@codemirror/state'
import {
	EditorView,
	drawSelection,
	gutter,
	highlightActiveLine,
	highlightActiveLineGutter,
	highlightSpecialChars,
	keymap,
	lineNumbers,
	rectangularSelection
} from '@codemirror/view'
import { createCodeMirror } from 'solid-codemirror'
import { createSignal, type Component } from 'solid-js'
import { sampleClass, sampleFunc } from './constants'
import { defaultKeymap } from './keymap'
import { highlightStyle } from './syntaxHighlight'

const App: Component = () => {
	const [code, setCode] = createSignal(sampleClass + '\\n\\n' + sampleFunc)
	const [showLineNumber, setShowLineNumber] = createSignal(true)
	const { ref: EditorRef, createExtension } = createCodeMirror({
		onValueChange: setCode,
		value: code()
	})
	let wrapperRef: HTMLElement = null!

	const theme = EditorView.theme(
		{
			'&': {
				color: '#e4f0fb',
				backgroundColor: '#1b1e28'
			},
			'.cm-content': {
				caretColor: '#a6accd'
			},

			'.cm-gutter': {
				backgroundColor: '#1b1e28',
				color: '#383b4d'
			},
			'cm-activeLineGutter': {
				//changed in css
			}
			// '.cm-cursor': {
			// 	backgroundColor: '#e4f0fb',
			// 	color: '#e4f0fb'
			// }
		},
		{ dark: true }
	)

	createExtension(lineNumbers())
	createExtension(gutter({ class: 'cm-gutter' }))
	createExtension(theme)
	createExtension(highlightActiveLineGutter())
	createExtension(highlightSpecialChars())
	createExtension(history())
	createExtension(foldGutter())
	createExtension(drawSelection())
	// createExtension(dropCursor())
	createExtension(EditorState.allowMultipleSelections.of(true))
	createExtension(indentOnInput())
	createExtension(bracketMatching())
	createExtension(closeBrackets())
	createExtension(autocompletion())
	createExtension(rectangularSelection())
	createExtension(highlightActiveLine())
	createExtension(highlightSelectionMatches())
	createExtension(keymap.of(defaultKeymap))
	createExtension(syntaxHighlighting(highlightStyle, { fallback: true }))
	createExtension(javascript({ jsx: true, typescript: true }))

	return (
		<main ref={wrapperRef} class='bg-background-dark h-screen'>
			<div class='pt-4' ref={EditorRef} />
		</main>
	)
}

export default App
`;
const all = sampleClass + '\n' + 'sampleFunc' + '\n' + AppTsx;


export { sampleClass, sampleFunc, AppTsx, all };
