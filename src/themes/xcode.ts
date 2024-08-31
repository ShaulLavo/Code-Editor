/**
 * @name Xcode
 */
import { tags as t } from '@lezer/highlight'
import { createTheme, type CreateThemeOptions } from '@uiw/codemirror-themes'

export const defaultSettingsXcodeLight: CreateThemeOptions['settings'] = {
	background: '#fff',
	foreground: '#3D3D3D',
	selection: '#BBDFFF',
	selectionMatch: '#BBDFFF',
	gutterBackground: '#fff',
	gutterForeground: '#AFAFAF',
	lineHighlight: '#d5e6ff69'
}

export const xcodeLightStyle: CreateThemeOptions['styles'] = [
	{ tag: [t.comment, t.quote], color: '#707F8D' },
	{ tag: [t.typeName, t.typeOperator], color: '#aa0d91' },
	{ tag: [t.keyword], color: '#aa0d91', fontWeight: 'bold' },
	{ tag: [t.string, t.meta], color: '#D23423' },
	{ tag: [t.name], color: '#032f62' },
	{ tag: [t.typeName], color: '#522BB2' },
	{ tag: [t.variableName], color: '#23575C' },
	{ tag: [t.definition(t.variableName)], color: '#327A9E' },
	{ tag: [t.regexp, t.link], color: '#0e0eff' }
]

export function xcodeLightInit(options?: Partial<CreateThemeOptions>) {
	const { theme = 'light', settings = {}, styles = [] } = options || {}
	return createTheme({
		theme: theme,
		settings: {
			...defaultSettingsXcodeLight,
			...settings
		},
		styles: [...xcodeLightStyle, ...styles]
	})
}

export const xcodeLight = xcodeLightInit()

export const defaultSettingsXcodeDark: CreateThemeOptions['settings'] = {
	background: '#292A30',
	foreground: '#CECFD0',
	caret: '#fff',
	selection: '#727377',
	selectionMatch: '#727377',
	lineHighlight: '#ffffff0f'
}

export const xcodeDarkStyle: CreateThemeOptions['styles'] = [
	{ tag: [t.comment, t.quote], color: '#7F8C98' },
	{ tag: [t.keyword], color: '#FF7AB2', fontWeight: 'bold' },
	{ tag: [t.string, t.meta], color: '#FF8170' },
	{ tag: [t.typeName], color: '#DABAFF' },
	{ tag: [t.definition(t.variableName)], color: '#6BDFFF' },
	{ tag: [t.name], color: '#6BAA9F' },
	{ tag: [t.variableName], color: '#ACF2E4' },
	{ tag: [t.regexp, t.link], color: '#FF8170' }
]

export const xcodeDarkInit = (options?: Partial<CreateThemeOptions>) => {
	const { theme = 'dark', settings = {}, styles = [] } = options || {}
	return createTheme({
		theme: theme,
		settings: {
			...defaultSettingsXcodeDark,
			...settings
		},
		styles: [...xcodeDarkStyle, ...styles]
	})
}

export const xcodeDark = xcodeDarkInit()

export const xTermXcodeLightTheme = {
	foreground: '#3D3D3D',
	background: '#fff',
	cursor: '#327A9E',
	cursorAccent: '#fff',
	selectionBackground: '#BBDFFF',
	selectionForeground: '#3D3D3D',
	selectionInactiveBackground: '#BBDFFF',

	black: '#292A30',
	red: '#D23423',
	green: '#23575C',
	yellow: '#707F8D',
	blue: '#032f62',
	magenta: '#aa0d91',
	cyan: '#327A9E',
	white: '#fff',

	brightBlack: '#AFAFAF',
	brightRed: '#D23423',
	brightGreen: '#23575C',
	brightYellow: '#707F8D',
	brightBlue: '#032f62',
	brightMagenta: '#522BB2',
	brightCyan: '#327A9E',
	brightWhite: '#fff',

	extendedAnsi: ['#d5e6ff69']
}

export const xTermXcodeDarkTheme = {
	foreground: '#CECFD0',
	background: '#292A30',
	cursor: '#6BDFFF',
	cursorAccent: '#292A30',
	selectionBackground: '#727377',
	selectionForeground: '#CECFD0',
	selectionInactiveBackground: '#727377',

	black: '#292A30',
	red: '#FF8170',
	green: '#6BAA9F',
	yellow: '#7F8C98',
	blue: '#6BDFFF',
	magenta: '#FF7AB2',
	cyan: '#ACF2E4',
	white: '#fff',

	brightBlack: '#7F8C98',
	brightRed: '#FF8170',
	brightGreen: '#6BAA9F',
	brightYellow: '#7F8C98',
	brightBlue: '#DABAFF',
	brightMagenta: '#FF7AB2',
	brightCyan: '#6BDFFF',
	brightWhite: '#CECFD0',

	extendedAnsi: ['#ffffff0f']
}
export const xCodeLightBracketColors = {
	red: xTermXcodeLightTheme.red,
	orange: xTermXcodeLightTheme.yellow,
	yellow: xTermXcodeLightTheme.brightYellow,
	green: xTermXcodeLightTheme.green,
	blue: xTermXcodeLightTheme.blue,
	indigo: xTermXcodeLightTheme.brightBlue,
	violet: xTermXcodeLightTheme.magenta
}

export const xCodeDarkBracketColors = {
	red: xTermXcodeDarkTheme.red,
	orange: xTermXcodeDarkTheme.yellow,
	yellow: xTermXcodeDarkTheme.brightYellow,
	green: xTermXcodeDarkTheme.green,
	blue: xTermXcodeDarkTheme.blue,
	indigo: xTermXcodeDarkTheme.brightBlue,
	violet: xTermXcodeDarkTheme.magenta
}
