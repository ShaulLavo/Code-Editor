import { BuiltInParserName, Options } from 'prettier'
import babel from 'prettier/plugins/babel.js'
import prettierPluginEstree from 'prettier/plugins/estree'
import prettierPluginTypescript from 'prettier/plugins/typescript'
import { format as prettier } from 'prettier/standalone'
import { Accessor, createSignal, Resource, Setter } from 'solid-js'
import init, { format } from '@wasm-fmt/ruff_fmt/vite'

try {
	await init()
} catch (e) {
	console.log(e)
}

const defaultConfig = {
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
	},
	javascript: {
		parser: 'typescript',
		allowJs: true,
		plugins: [prettierPluginTypescript, prettierPluginEstree]
	},
	python: {}
} satisfies Partial<
	Record<BuiltInParserName | 'python' | 'javascript', Options>
>

export const extensionMap = {
	ts: 'typescript',
	tsx: 'typescript',
	dts: 'typescript', // TypeScript declaration file
	js: 'javascript',
	mjs: 'javascript', // ES6 module in JavaScript
	cjs: 'javascript', // CommonJS module in JavaScript
	jsx: 'javascript',
	json: 'json',
	jsonc: 'json', // JSON with comments
	json5: 'json', // JSON5 format
	geojson: 'json', // GeoJSON format
	topojson: 'json', // TopoJSON format,
	py: 'python',
	pyc: 'python',
	pyd: 'python',
	pyo: 'python',
	pyw: 'python',
	pyz: 'python',
	pyx: 'python'
} as const

export const getConfigFromExt = (extension?: string) => {
	const parser = extensionMap[extension as keyof typeof extensionMap]

	return defaultConfig[parser]
}

export const Formatter = {
	async prettier(code: string, config: Options) {
		try {
			if (!code || !config) return code
			return await prettier(code, config)
		} catch (e) {
			return code
		}
	},
	python(code: string) {
		try {
			if (!code) return code
			return format(code)
		} catch (e) {
			return code
		}
	}
	// beautify(code: string) {
	//   return js_beautify(code);
	// }
}

export const [formatterName, setFormatter] =
	createSignal<keyof typeof Formatter>('prettier')
export const formatter = () => Formatter[formatterName()]

export const formatCode = async (
	config: Options,
	code: Accessor<string | undefined> | Resource<string | undefined>,
	setCode: (code: string | undefined) => void
) => {
	const formatted = await formatter()(code()!, config)
	setCode(formatted)
}
