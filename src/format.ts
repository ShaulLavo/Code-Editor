import prettierPluginEstree from 'prettier/plugins/estree'
import prettierPluginTypescript from 'prettier/plugins/typescript'
import { format as prettier } from 'prettier/standalone'
import babel from 'prettier/plugins/babel.js'
import prettierPluginJson from 'prettier-plugin-json-formats'
import { js_beautify } from 'js-beautify'
import { createSignal } from 'solid-js'
import { BuiltInParserName, Options } from 'prettier'
import ts from 'typescript'
import { currentExtension } from './stores/fsStore'
const deafultConfig = {
	typescript: {
		parser: 'typescript',
		plugins: [prettierPluginTypescript, prettierPluginEstree],
		semi: true,
		trailingComma: 'es5',
		singleQuote: true,
		printWidth: 80,
		tabWidth: 2,
		useTabs: false,
		jsxSingleQuote: false,
		bracketSpacing: true,
		jsxBracketSameLine: false,
		arrowParens: 'always'
	},
	json: {
		parser: 'json',
		plugins: [babel, prettierPluginEstree]
	}
} satisfies Partial<Record<BuiltInParserName, Options>>

const extensionMap = {
	ts: 'typescript',
	tsx: 'typescript',
	js: 'typescript',
	json: 'json',
	jsx: 'typescript'
} as const

const getConfigFromExt = (extension?: string) => {
	console.log(extension)
	const parser =
		extensionMap[extension as keyof typeof extensionMap] ?? 'typescript'
	console.log({ parser })
	return deafultConfig[parser]
}

const currentConfig = () => getConfigFromExt(currentExtension())

export const Formmater = {
	async prettier(code: string, config: Options = currentConfig()) {
		try {
			if (!code) return code
			return await prettier(code, config)
		} catch (e) {
			console.log(e)
			return code
		}
	}
	// beautify(code: string) {
	//   return js_beautify(code);
	// }
}

export const [formmaterName, setFormmater] =
	createSignal<keyof typeof Formmater>('prettier')
export const formatter = () => Formmater[formmaterName()]
// currentFileExtension()
