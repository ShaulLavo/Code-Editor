import { tags as t } from '@lezer/highlight'
import { createTheme, type CreateThemeOptions } from '@uiw/codemirror-themes'

export const defaultSettingsTokyoNightDay: CreateThemeOptions['settings'] = {
	background: '#e1e2e7',
	foreground: '#3760bf',
	caret: '#3760bf',
	selection: '#99a7df',
	selectionMatch: '#99a7df',
	gutterBackground: '#e1e2e7',
	gutterForeground: '#3760bf',
	gutterBorder: 'transparent',
	lineHighlight: '#5f5faf11'
}

export const tokyoNightDayStyle: CreateThemeOptions['styles'] = [
	{ tag: t.keyword, color: '#007197' },
	{ tag: [t.name, t.deleted, t.character, t.macroName], color: '#3760bf' },
	{ tag: [t.propertyName], color: '#3760bf' },
	{
		tag: [t.processingInstruction, t.string, t.inserted, t.special(t.string)],
		color: '#587539'
	},
	{ tag: [t.function(t.variableName), t.labelName], color: '#3760bf' },
	{ tag: [t.color, t.constant(t.name), t.standard(t.name)], color: '#3760bf' },
	{ tag: [t.definition(t.name), t.separator], color: '#3760bf' },
	{ tag: [t.className], color: '#3760bf' },
	{
		tag: [t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
		color: '#b15c00'
	},
	{ tag: [t.typeName], color: '#007197', fontStyle: '#007197' },
	{ tag: [t.operator, t.operatorKeyword], color: '#007197' },
	{ tag: [t.url, t.escape, t.regexp, t.link], color: '#587539' },
	{ tag: [t.meta, t.comment], color: '#848cb5' },
	{ tag: t.strong, fontWeight: 'bold' },
	{ tag: t.emphasis, fontStyle: 'italic' },
	{ tag: t.link, textDecoration: 'underline' },
	{ tag: t.heading, fontWeight: 'bold', color: '#b15c00' },
	{ tag: [t.atom, t.bool, t.special(t.variableName)], color: '#3760bf' },
	{ tag: t.invalid, color: '#f52a65' },
	{ tag: t.strikethrough, textDecoration: 'line-through' }
]

export const tokyoNightDayInit = (options?: Partial<CreateThemeOptions>) => {
	const { theme = 'light', settings = {}, styles = [] } = options || {}
	return createTheme({
		theme: theme,
		settings: {
			...defaultSettingsTokyoNightDay,
			...settings
		},
		styles: [...tokyoNightDayStyle, ...styles]
	})
}

export const tokyoNightDay = tokyoNightDayInit()
export const xTermTokyoNightDayTheme = {
	foreground: '#3760bf',
	background: '#e1e2e7',
	cursor: '#3760bf',
	cursorAccent: '#e1e2e7',
	selectionBackground: '#99a7df',
	selectionForeground: '#3760bf',
	selectionInactiveBackground: '#99a7df',
	black: '#e1e2e7',
	red: '#f52a65',
	green: '#587539',
	yellow: '#b15c00',
	blue: '#3760bf',
	magenta: '#007197',
	cyan: '#587539',
	white: '#3760bf',
	brightBlack: '#848cb5',
	brightRed: '#f52a65',
	brightGreen: '#587539',
	brightYellow: '#b15c00',
	brightBlue: '#3760bf',
	brightMagenta: '#007197',
	brightCyan: '#587539',
	brightWhite: '#3760bf',
	extendedAnsi: ['#5f5faf11']
}
