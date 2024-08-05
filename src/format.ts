import prettierPluginEstree from 'prettier/plugins/estree'
import prettierPluginTypescript from 'prettier/plugins/typescript'
import { format as prettier } from 'prettier/standalone'

import { js_beautify } from 'js-beautify'
import { createSignal } from 'solid-js'

export const Formmater = {
	async prettier(code: string) {
		try {
			return await prettier(code, {
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
			})
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
