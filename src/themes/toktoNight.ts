import { tags as t } from '@lezer/highlight'
import { createTheme, type CreateThemeOptions } from '@uiw/codemirror-themes'

export const defaultSettingsTokyoNight: CreateThemeOptions['settings'] = {
	background: '#1a1b26',
	foreground: '#787c99',
	caret: '#c0caf5',
	selection: '#515c7e40',
	selectionMatch: '#16161e',
	gutterBackground: '#1a1b26',
	gutterForeground: '#787c99',
	gutterBorder: 'transparent',
	lineHighlight: '#474b6611'
}

export const tokyoNightStyle: CreateThemeOptions['styles'] = [
	{ tag: t.keyword, color: '#bb9af7' },
	{ tag: [t.name, t.deleted, t.character, t.macroName], color: '#c0caf5' },
	{ tag: [t.propertyName], color: '#7aa2f7' },
	{
		tag: [t.processingInstruction, t.string, t.inserted, t.special(t.string)],
		color: '#9ece6a'
	},
	{ tag: [t.function(t.variableName), t.labelName], color: '#7aa2f7' },
	{ tag: [t.color, t.constant(t.name), t.standard(t.name)], color: '#bb9af7' },
	{ tag: [t.definition(t.name), t.separator], color: '#c0caf5' },
	{ tag: [t.className], color: '#c0caf5' },
	{
		tag: [t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
		color: '#ff9e64'
	},
	{ tag: [t.typeName], color: '#0db9d7' },
	{ tag: [t.operator, t.operatorKeyword], color: '#bb9af7' },
	{ tag: [t.url, t.escape, t.regexp, t.link], color: '#b4f9f8' },
	{ tag: [t.meta, t.comment], color: '#444b6a' },
	{ tag: t.strong, fontWeight: 'bold' },
	{ tag: t.emphasis, fontStyle: 'italic' },
	{ tag: t.link, textDecoration: 'underline' },
	{ tag: t.heading, fontWeight: 'bold', color: '#89ddff' },
	{ tag: [t.atom, t.bool, t.special(t.variableName)], color: '#c0caf5' },
	{ tag: t.invalid, color: '#ff5370' },
	{ tag: t.strikethrough, textDecoration: 'line-through' }
]

export const tokyoNightInit = (options?: Partial<CreateThemeOptions>) => {
	const { theme = 'dark', settings = {}, styles = [] } = options || {}
	return createTheme({
		theme: theme,
		settings: {
			...defaultSettingsTokyoNight,
			...settings
		},
		styles: [...tokyoNightStyle, ...styles]
	})
}

export const tokyoNight = tokyoNightInit()

export const xTermTokyoNightTheme = {
	foreground: '#787c99',
	background: '#1a1b26',
	cursor: '#c0caf5',
	cursorAccent: '#1a1b26',
	selectionBackground: '#515c7e40',
	selectionForeground: '#c0caf5',
	selectionInactiveBackground: '#16161e',
	black: '#1a1b26',
	red: '#ff5370',
	green: '#9ece6a',
	yellow: '#ff9e64',
	blue: '#7aa2f7',
	magenta: '#bb9af7',
	cyan: '#0db9d7',
	white: '#c0caf5',
	brightBlack: '#444b6a',
	brightRed: '#ff5370',
	brightGreen: '#9ece6a',
	brightYellow: '#ff9e64',
	brightBlue: '#7aa2f7',
	brightMagenta: '#bb9af7',
	brightCyan: '#b4f9f8',
	brightWhite: '#c0caf5',
	extendedAnsi: ['#474b6611']
}
