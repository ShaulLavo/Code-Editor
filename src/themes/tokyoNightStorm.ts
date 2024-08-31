import { tags as t } from '@lezer/highlight'
import { createTheme, type CreateThemeOptions } from '@uiw/codemirror-themes'

export const defaultSettingsTokyoNightStorm: CreateThemeOptions['settings'] = {
	background: '#24283b',
	foreground: '#7982a9',
	caret: '#c0caf5',
	selection: '#6f7bb630',
	selectionMatch: '#343b5f',
	gutterBackground: '#24283b',
	gutterForeground: '#7982a9',
	gutterBorder: 'transparent',
	lineHighlight: '#292e427a'
}

export const tokyoNightStormStyle: CreateThemeOptions['styles'] = [
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
	{ tag: [t.typeName], color: '#2ac3de', fontStyle: '#2ac3de' },
	{ tag: [t.operator, t.operatorKeyword], color: '#bb9af7' },
	{ tag: [t.url, t.escape, t.regexp, t.link], color: '#b4f9f8' },
	{ tag: [t.meta, t.comment], color: '#565f89' },
	{ tag: t.strong, fontWeight: 'bold' },
	{ tag: t.emphasis, fontStyle: 'italic' },
	{ tag: t.link, textDecoration: 'underline' },
	{ tag: t.heading, fontWeight: 'bold', color: '#89ddff' },
	{ tag: [t.atom, t.bool, t.special(t.variableName)], color: '#c0caf5' },
	{ tag: t.invalid, color: '#ff5370' },
	{ tag: t.strikethrough, textDecoration: 'line-through' }
]

export const tokyoNightStormInit = (options?: Partial<CreateThemeOptions>) => {
	const { theme = 'dark', settings = {}, styles = [] } = options || {}
	return createTheme({
		theme: theme,
		settings: {
			...defaultSettingsTokyoNightStorm,
			...settings
		},
		styles: [...tokyoNightStormStyle, ...styles]
	})
}

export const tokyoNightStorm = tokyoNightStormInit()

export const xTermTokyoNightStormTheme = {
	foreground: '#7982a9',
	background: '#24283b',
	cursor: '#c0caf5',
	cursorAccent: '#24283b',
	selectionBackground: '#6f7bb630',
	selectionForeground: '#7982a9',
	selectionInactiveBackground: '#343b5f',
	black: '#24283b',
	red: '#ff5370',
	green: '#9ece6a',
	yellow: '#ff9e64',
	blue: '#7aa2f7',
	magenta: '#bb9af7',
	cyan: '#2ac3de',
	white: '#c0caf5',
	brightBlack: '#565f89',
	brightRed: '#ff5370',
	brightGreen: '#9ece6a',
	brightYellow: '#ff9e64',
	brightBlue: '#7aa2f7',
	brightMagenta: '#bb9af7',
	brightCyan: '#b4f9f8',
	brightWhite: '#c0caf5',
	extendedAnsi: ['#292e427a']
}
export const tokyoNightStormBracketColors = {
	red: xTermTokyoNightStormTheme.red,
	orange: xTermTokyoNightStormTheme.yellow,
	yellow: xTermTokyoNightStormTheme.brightYellow,
	green: xTermTokyoNightStormTheme.green,
	blue: xTermTokyoNightStormTheme.blue,
	indigo: xTermTokyoNightStormTheme.brightBlue,
	violet: xTermTokyoNightStormTheme.magenta
}
