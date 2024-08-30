/**
 * @name duotone
 * @author Bram de Haan
 * by Bram de Haan, adapted from DuoTone themes by Simurai (http://simurai.com/projects/2016/01/01/duotone-themes)
 */
import { tags as t } from '@lezer/highlight'
import { createTheme, type CreateThemeOptions } from '@uiw/codemirror-themes'

export const defaultSettingsDuotoneLight: CreateThemeOptions['settings'] = {
	background: '#faf8f5',
	foreground: '#b29762',
	caret: '#93abdc',
	selection: '#e3dcce',
	selectionMatch: '#e3dcce',
	gutterBackground: '#faf8f5',
	gutterForeground: '#cdc4b1',
	gutterBorder: 'transparent',
	lineHighlight: '#ddceb154'
}

export const douToneLightStyle: CreateThemeOptions['styles'] = [
	{ tag: [t.comment, t.bracket], color: '#b6ad9a' },
	{
		tag: [t.atom, t.number, t.keyword, t.link, t.attributeName, t.quote],
		color: '#063289'
	},
	{
		tag: [t.emphasis, t.heading, t.tagName, t.propertyName, t.variableName],
		color: '#2d2006'
	},
	{ tag: [t.typeName, t.url, t.string], color: '#896724' },
	{ tag: [t.operator, t.string], color: '#1659df' },
	{ tag: [t.propertyName], color: '#b29762' },
	{ tag: [t.unit, t.punctuation], color: '#063289' }
]

export const duotoneLightInit = (options?: Partial<CreateThemeOptions>) => {
	const { theme = 'light', settings = {}, styles = [] } = options || {}
	return createTheme({
		theme: theme,
		settings: {
			...defaultSettingsDuotoneLight,
			...settings
		},
		styles: [...douToneLightStyle, ...styles]
	})
}

export const duotoneLight = duotoneLightInit()

export const defaultSettingsDuotoneDark: CreateThemeOptions['settings'] = {
	background: '#2a2734',
	foreground: '#6c6783',
	caret: '#ffad5c',
	selection: '#91ff6c26',
	selectionMatch: '#91ff6c26',
	gutterBackground: '#2a2734',
	gutterForeground: '#545167',
	lineHighlight: '#36334280'
}

export const duotoneDarkStyle: CreateThemeOptions['styles'] = [
	{ tag: [t.comment, t.bracket], color: '#6c6783' },
	{
		tag: [t.atom, t.number, t.keyword, t.link, t.attributeName, t.quote],
		color: '#ffcc99'
	},
	{
		tag: [
			t.emphasis,
			t.heading,
			t.tagName,
			t.propertyName,
			t.className,
			t.variableName
		],
		color: '#eeebff'
	},
	{ tag: [t.typeName, t.url], color: '#7a63ee' },
	{ tag: t.operator, color: '#ffad5c' },
	{ tag: t.string, color: '#ffb870' },
	{ tag: [t.propertyName], color: '#9a86fd' },
	{ tag: [t.unit, t.punctuation], color: '#e09142' }
]

export const duotoneDarkInit = (options?: Partial<CreateThemeOptions>) => {
	const { theme = 'dark', settings = {}, styles = [] } = options || {}
	return createTheme({
		theme: theme,
		settings: {
			...defaultSettingsDuotoneDark,
			...settings
		},
		styles: [...duotoneDarkStyle, ...styles]
	})
}

export const duotoneDark = duotoneDarkInit()

export const xTermDuotoneLightTheme = {
	// Default colors
	foreground: '#b29762', // Map to a suitable foreground color
	background: '#faf8f5', // Map to your background color
	cursor: '#93abdc', // Cursor color (caret)
	cursorAccent: '#faf8f5', // Cursor accent (matching background)
	selectionBackground: '#e3dcce', // Selection background color
	selectionForeground: '#2d2006', // Selection foreground color (chosen for visibility)
	selectionInactiveBackground: '#e3dcce', // Inactive selection background color

	// ANSI colors (mapped based on usage in styles)
	black: '#2d2006', // Default for dark elements
	red: '#063289', // Important keywords, atoms
	green: '#896724', // Type names, strings
	yellow: '#b29762', // Property names
	blue: '#1659df', // Operators and strings
	magenta: '#b6ad9a', // Comments
	cyan: '#cdc4b1', // Gutter foreground color
	white: '#faf8f5', // Background color for bright contrast

	brightBlack: '#b6ad9a', // Bracket and comment color
	brightRed: '#063289', // More pronounced keywords, links
	brightGreen: '#896724', // Important strings
	brightYellow: '#b29762', // Properties that need visibility
	brightBlue: '#1659df', // Operators
	brightMagenta: '#2d2006', // Emphasis tags
	brightCyan: '#93abdc', // Caret color
	brightWhite: '#ffffff', // Pure white (often default)

	// Optional extended ANSI colors (16-255)
	extendedAnsi: [
		'#ddceb154' // Line highlight, example extended color
		// Add more if needed
	]
}

export const xTermDuotoneDarkTheme = {
	// Default colors
	foreground: '#6c6783', // Foreground color
	background: '#2a2734', // Background color
	cursor: '#ffad5c', // Cursor color (caret)
	cursorAccent: '#2a2734', // Cursor accent color
	selectionBackground: '#91ff6c26', // Selection background color
	selectionForeground: '#eeebff', // Selection foreground color (chosen for visibility)
	selectionInactiveBackground: '#91ff6c26', // Inactive selection background color

	// ANSI colors (mapped based on usage in styles)
	black: '#2a2734', // Default background color
	red: '#ffcc99', // Keywords, atoms
	green: '#ffb870', // Strings
	yellow: '#ffad5c', // Operators
	blue: '#7a63ee', // Type names, URLs
	magenta: '#9a86fd', // Property names
	cyan: '#6c6783', // Comments
	white: '#eeebff', // Bright contrast elements

	brightBlack: '#545167', // Gutter foreground
	brightRed: '#ffcc99', // Important keywords
	brightGreen: '#ffb870', // Important strings
	brightYellow: '#ffad5c', // Operators
	brightBlue: '#7a63ee', // More emphasized types
	brightMagenta: '#9a86fd', // Important properties
	brightCyan: '#e09142', // Units, punctuation
	brightWhite: '#ffffff', // Pure white for high contrast

	// Optional extended ANSI colors (16-255)
	extendedAnsi: [
		'#36334280' // Line highlight, example extended color
		// Add more if needed
	]
}
