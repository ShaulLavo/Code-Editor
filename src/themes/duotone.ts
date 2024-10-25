/**
 * @name duotone
 * @author Bram de Haan
 * by Bram de Haan, adapted from DuoTone themes by Simurai (http:
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
	lineHighlight: '#ddceb14c'
} as const

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
	lineHighlight: '#3633424c'
} as const

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
	foreground: '#b29762',
	background: '#faf8f5',
	cursor: '#93abdc',
	cursorAccent: '#faf8f5',
	selectionBackground: '#e3dcce',
	selectionForeground: '#2d2006',
	selectionInactiveBackground: '#e3dcce',

	black: '#2d2006',
	red: '#063289',
	green: '#896724',
	yellow: '#b29762',
	blue: '#1659df',
	magenta: '#b6ad9a',
	cyan: '#cdc4b1',
	white: '#faf8f5',

	brightBlack: '#b6ad9a',
	brightRed: '#063289',
	brightGreen: '#896724',
	brightYellow: '#b29762',
	brightBlue: '#1659df',
	brightMagenta: '#2d2006',
	brightCyan: '#93abdc',
	brightWhite: '#ffffff',

	extendedAnsi: ['#ddceb154']
} as const

export const xTermDuotoneDarkTheme = {
	foreground: '#6c6783',
	background: '#2a2734',
	cursor: '#ffad5c',
	cursorAccent: '#2a2734',
	selectionBackground: '#91ff6c26',
	selectionForeground: '#eeebff',
	selectionInactiveBackground: '#91ff6c26',

	black: '#2a2734',
	red: '#ffcc99',
	green: '#ffb870',
	yellow: '#ffad5c',
	blue: '#7a63ee',
	magenta: '#9a86fd',
	cyan: '#6c6783',
	white: '#eeebff',

	brightBlack: '#545167',
	brightRed: '#ffcc99',
	brightGreen: '#ffb870',
	brightYellow: '#ffad5c',
	brightBlue: '#7a63ee',
	brightMagenta: '#9a86fd',
	brightCyan: '#e09142',
	brightWhite: '#ffffff',

	extendedAnsi: ['#36334280']
} as const
export const duotoneLightBracketColors = {
	red: xTermDuotoneLightTheme.red,
	orange: xTermDuotoneLightTheme.yellow,
	yellow: xTermDuotoneLightTheme.brightYellow,
	green: xTermDuotoneLightTheme.green,
	blue: xTermDuotoneLightTheme.blue,
	indigo: xTermDuotoneLightTheme.brightBlue,
	violet: xTermDuotoneLightTheme.magenta
}
export const duotoneDarkBracketColors = {
	red: xTermDuotoneDarkTheme.red,
	orange: xTermDuotoneDarkTheme.yellow,
	yellow: xTermDuotoneDarkTheme.brightYellow,
	green: xTermDuotoneDarkTheme.green,
	blue: xTermDuotoneDarkTheme.blue,
	indigo: xTermDuotoneDarkTheme.brightBlue,
	violet: xTermDuotoneDarkTheme.magenta
}
