import { tags as t } from '@lezer/highlight'
import { createTheme, type CreateThemeOptions } from '@uiw/codemirror-themes'
const cl = {
	background: '#fff',
	foreground: '#000',
	selection: '#0064ff26',
	selectionMatch: '#0064ff4c',
	cursor: '#004bff',
	dropdownBackground: '#f4f6fc',
	dropdownBorder: '#e7ecf2',
	activeLine: '#0064ff0c',
	matchingBracket: '#0064ff4c',
	keyword: null,
	storage: null,
	variable: null,
	parameter: null,
	function: null,
	string: '#6b7a88',
	constant: null,
	type: null,
	class: null,
	number: null,
	comment: '#bec9d3',
	heading: null,
	invalid: null,
	regexp: '#6b7a88',
	tag: null
}

export const defaultSettingsWhiteLight: CreateThemeOptions['settings'] = {
	background: cl.background,
	foreground: cl.foreground,
	caret: cl.cursor,
	selection: cl.selection,
	selectionMatch: cl.selectionMatch,
	gutterBackground: cl.background,
	gutterForeground: cl.foreground,
	lineHighlight: cl.activeLine
}

export const whiteLightStyle: CreateThemeOptions['styles'] = [
	{ tag: t.keyword, color: cl.keyword, fontWeight: 'bold' },
	{ tag: [t.name, t.deleted, t.character, t.macroName], color: cl.variable },
	{ tag: [t.propertyName], color: cl.function },
	{
		tag: [t.processingInstruction, t.string, t.inserted, t.special(t.string)],
		color: cl.string
	},
	{ tag: [t.function(t.variableName), t.labelName], color: cl.function },
	{
		tag: [t.color, t.constant(t.name), t.standard(t.name)],
		color: cl.constant
	},
	{ tag: [t.definition(t.name), t.separator], color: cl.variable },
	{ tag: [t.className], color: cl.class },
	{ tag: [t.typeName], color: cl.type, fontStyle: cl.type },
	{ tag: [t.url, t.escape, t.regexp, t.link], color: cl.regexp },
	{ tag: [t.meta, t.comment], color: cl.comment },
	{ tag: t.tagName, color: cl.tag },
	{ tag: t.strong, fontWeight: 'bold' },
	{ tag: t.emphasis, fontStyle: 'italic' },
	{ tag: t.link, textDecoration: 'underline' },
	{ tag: t.heading, fontWeight: 'bold', color: cl.heading },
	{ tag: [t.atom, t.special(t.variableName)], color: cl.variable },
	{ tag: t.invalid, color: cl.invalid },
	{ tag: t.strikethrough, textDecoration: 'line-through' },
	{
		tag: [t.operatorKeyword, t.bool, t.null, t.variableName],
		color: cl.constant
	},
	{ tag: [t.operator], color: '#0431fa' },
	{ tag: [t.number], color: '#a8a8b1' },
	{ tag: [t.bracket], color: '#0431fa' }
]

export const whiteLightInit = (options?: Partial<CreateThemeOptions>) => {
	const { theme = 'light', settings = {}, styles = [] } = options || {}
	return createTheme({
		theme: theme,
		settings: {
			...defaultSettingsWhiteLight,
			...settings
		},
		styles: [...whiteLightStyle, ...styles]
	})
}

export const whiteLight = whiteLightInit()
export const cd = {
	background: '#000',
	foreground: '#fff',
	selection: '#7d46fc3f',
	selectionMatch: '#7d46fc7f',
	cursor: '#7d46fc',
	dropdownBackground: '#0a0b0f',
	dropdownBorder: '#1e1d27',
	activeLine: '#00346eb0',
	matchingBracket: '#7d46fc7f',
	keyword: null,
	storage: null,
	variable: null,
	parameter: null,
	function: null,
	string: '#a8a8b1',
	constant: null,
	type: null,
	class: null,
	number: null,
	comment: '#2e2e37',
	heading: null,
	invalid: null,
	regexp: '#a8a8b1',
	tag: null
}
export const defaultSettingsWhiteDark: CreateThemeOptions['settings'] = {
	background: cd.background,
	foreground: cd.foreground,
	caret: cd.cursor,
	selection: cd.selection,
	selectionMatch: cd.selectionMatch,
	gutterBackground: cd.background,
	gutterForeground: cd.foreground,
	lineHighlight: cd.activeLine
}

export const whiteDarkStyle: CreateThemeOptions['styles'] = [
	{ tag: t.keyword, color: cd.keyword, fontWeight: 'bold' },
	{ tag: [t.name, t.deleted, t.character, t.macroName], color: cd.variable },
	{ tag: [t.propertyName], color: cd.function },
	{
		tag: [t.processingInstruction, t.string, t.inserted, t.special(t.string)],
		color: cd.string
	},
	{ tag: [t.function(t.variableName), t.labelName], color: cd.function },
	{
		tag: [t.color, t.constant(t.name), t.standard(t.name)],
		color: cd.constant
	},
	{ tag: [t.definition(t.name), t.separator], color: cd.variable },
	{ tag: [t.className], color: cd.class },
	{ tag: [t.typeName], color: cd.type, fontStyle: cd.type },
	{ tag: [t.url, t.escape, t.regexp, t.link], color: cd.regexp },
	{ tag: [t.meta, t.comment], color: cd.comment },
	{ tag: t.tagName, color: cd.tag },
	{ tag: t.strong, fontWeight: 'bold' },
	{ tag: t.emphasis, fontStyle: 'italic' },
	{ tag: t.link, textDecoration: 'underline' },
	{ tag: t.heading, fontWeight: 'bold', color: cd.heading },
	{ tag: [t.atom, t.special(t.variableName)], color: cd.variable },
	{ tag: t.invalid, color: cd.invalid },
	{ tag: t.strikethrough, textDecoration: 'line-through' },
	{
		tag: [t.operatorKeyword, t.bool, t.null, t.variableName],
		color: cd.constant
	},
	{ tag: [t.operator], color: '#bb9af7' },
	{ tag: [t.number], color: '#a8a8b1' },
	{ tag: [t.bracket], color: '#bb9af7' }
]

export const whiteDarkInit = (options?: Partial<CreateThemeOptions>) => {
	const { theme = 'dark', settings = {}, styles = [] } = options || {}
	return createTheme({
		theme: theme,
		settings: {
			...defaultSettingsWhiteDark,
			...settings
		},
		styles: [...whiteDarkStyle, ...styles]
	})
}

export const whiteDark = whiteDarkInit()
