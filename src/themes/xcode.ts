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
	// Default colors
	foreground: '#3D3D3D', // Mapped to foreground color
	background: '#fff', // Mapped to background color
	cursor: '#327A9E', // Cursor color (use a suitable variable color)
	cursorAccent: '#fff', // Cursor accent (background color)
	selectionBackground: '#BBDFFF', // Selection background color
	selectionForeground: '#3D3D3D', // Foreground color on selection for visibility
	selectionInactiveBackground: '#BBDFFF', // Inactive selection background

	// ANSI colors (mapped based on usage in styles)
	black: '#292A30', // A dark background-like color
	red: '#D23423', // Strings and meta
	green: '#23575C', // Variable names
	yellow: '#707F8D', // Comments and quotes
	blue: '#032f62', // Names and general code
	magenta: '#aa0d91', // Keywords and type names
	cyan: '#327A9E', // Variable definitions
	white: '#fff', // Brightest color (background)

	brightBlack: '#AFAFAF', // Gutter foreground
	brightRed: '#D23423', // Brighter strings and meta
	brightGreen: '#23575C', // Brighter variable names
	brightYellow: '#707F8D', // Brighter comments
	brightBlue: '#032f62', // Brighter name tags
	brightMagenta: '#522BB2', // Brighter type names
	brightCyan: '#327A9E', // Brighter variable definitions
	brightWhite: '#fff', // Bright white for high contrast

	// Optional extended ANSI colors (16-255)
	extendedAnsi: [
		'#d5e6ff69' // Line highlight
		// Add more if needed
	]
}

export const xTermXcodeDarkTheme = {
	// Default colors
	foreground: '#CECFD0', // Mapped to foreground color
	background: '#292A30', // Mapped to background color
	cursor: '#6BDFFF', // Cursor color (use a suitable variable color)
	cursorAccent: '#292A30', // Cursor accent (background color)
	selectionBackground: '#727377', // Selection background color
	selectionForeground: '#CECFD0', // Foreground color on selection for visibility
	selectionInactiveBackground: '#727377', // Inactive selection background

	// ANSI colors (mapped based on usage in styles)
	black: '#292A30', // Background-like color
	red: '#FF8170', // Strings and meta
	green: '#6BAA9F', // Variable names
	yellow: '#7F8C98', // Comments and quotes
	blue: '#6BDFFF', // Variable definitions
	magenta: '#FF7AB2', // Keywords and type names
	cyan: '#ACF2E4', // Variable names
	white: '#fff', // Brightest color

	brightBlack: '#7F8C98', // Brighter comments
	brightRed: '#FF8170', // Brighter strings and meta
	brightGreen: '#6BAA9F', // Brighter variable names
	brightYellow: '#7F8C98', // Brighter comments
	brightBlue: '#DABAFF', // Brighter type names
	brightMagenta: '#FF7AB2', // Brighter keywords
	brightCyan: '#6BDFFF', // Brighter variable definitions
	brightWhite: '#CECFD0', // Bright white for high contrast

	// Optional extended ANSI colors (16-255)
	extendedAnsi: [
		'#ffffff0f' // Line highlight
		// Add more if needed
	]
}
