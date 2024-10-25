import { tags as t } from '@lezer/highlight'
import { createTheme, type CreateThemeOptions } from '@uiw/codemirror-themes'

export const defaultSettingsMojo: CreateThemeOptions['settings'] = {
	background: '#1E1E1E', // editorPane.background
	foreground: '#A6A6A6', // activityBar.foreground
	caret: '#007ACC', // editor.selectionBackground (approximation for caret)
	selection: '#007ACC', // editor.selectionBackground (no transparency)
	selectionMatch: '#ADD6FF', // editor.selectionHighlightBackground
	gutterBackground: '#1E1E1E', // editor.lineHighlightBackground
	gutterForeground: '#444', // editorLineNumber.foreground
	gutterBorder: 'transparent', // editorGroup.border (not explicitly set)
	lineHighlight: '#2929294c' // editorRuler.foreground (approximation)
}

export const mojoStyle: CreateThemeOptions['styles'] = [
	{ tag: t.keyword, color: '#007ACC' }, // editor.selectionBackground
	{ tag: [t.name, t.deleted, t.character, t.macroName], color: '#c86464' }, // editorError.foreground
	{ tag: [t.propertyName], color: '#41a6d9' }, // editorLineNumber.activeForeground
	{
		tag: [t.processingInstruction, t.string, t.inserted, t.special(t.string)],
		color: '#9aefea' // gitDecoration.renamedResourceForeground
	},
	{ tag: [t.function(t.variableName), t.labelName], color: '#007ACC' }, // same as keyword
	{ tag: [t.color, t.constant(t.name), t.standard(t.name)], color: '#ADD6FF' }, // editor.selectionHighlightBackground
	{ tag: [t.definition(t.name), t.separator], color: '#A6A6A6' }, // sideBar.foreground
	{ tag: [t.className], color: '#A6A6A6' }, // sideBar.foreground
	{
		tag: [t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
		color: '#ffd7b1' // yellow is not in the provided colors, default from example
	},
	{ tag: [t.typeName], color: '#0db9d7' }, // cyan (approximation)
	{ tag: [t.operator, t.operatorKeyword], color: '#ADD6FF' }, // selectionHighlightBorder (approximation)
	{ tag: [t.url, t.escape, t.regexp, t.link], color: '#41a6d9' }, // editorLineNumber.activeForeground
	{ tag: [t.meta, t.comment], color: '#444' }, // editorLineNumber.foreground
	{ tag: t.strong, fontWeight: 'bold' },
	{ tag: t.emphasis, fontStyle: 'italic' },
	{ tag: t.link, textDecoration: 'underline' },
	{ tag: t.heading, fontWeight: 'bold', color: '#007ACC' }, // same as keyword
	{ tag: [t.atom, t.bool, t.special(t.variableName)], color: '#A6A6A6' }, // activityBar.foreground
	{ tag: t.invalid, color: '#c86464' }, // editorError.foreground
	{ tag: t.strikethrough, textDecoration: 'line-through' }
]

export const mojoInit = (options?: Partial<CreateThemeOptions>) => {
	const { theme = 'dark', settings = {}, styles = [] } = options || {}
	return createTheme({
		theme: theme,
		settings: {
			...defaultSettingsMojo,
			...settings
		},
		styles: [...mojoStyle, ...styles]
	})
}

export const mojo = mojoInit()

export const xTermMojoTheme = {
	foreground: '#A6A6A6', // activityBar.foreground
	background: '#1E1E1E', // editorPane.background
	cursor: '#007ACC', // editor.selectionBackground (used as caret)
	cursorAccent: '#1E1E1E4C', // editor.lineHighlightBackground
	selectionBackground: '#007ACC', // editor.selectionBackground
	selectionForeground: '#A6A6A6', // activityBar.foreground
	selectionInactiveBackground: '#ADD6FF', // editor.selectionHighlightBackground
	black: '#1E1E1E', // editorPane.background
	red: '#c86464', // editorError.foreground
	green: '#9aefea', // gitDecoration.renamedResourceForeground
	yellow: '#ffd7b1', // yellow default
	blue: '#007ACC', // editor.selectionBackground
	magenta: '#ADD6FF', // editor.selectionHighlightBackground
	cyan: '#41a6d9', // editorLineNumber.activeForeground
	white: '#A6A6A6', // activityBar.foreground
	brightBlack: '#292929', // editorRuler.foreground
	brightRed: '#c86464', // editorError.foreground
	brightGreen: '#9aefea', // gitDecoration.renamedResourceForeground
	brightYellow: '#ffd7b1', // default
	brightBlue: '#007ACC', // editor.selectionBackground
	brightMagenta: '#ADD6FF', // editor.selectionHighlightBackground
	brightCyan: '#41a6d9', // editorLineNumber.activeForeground
	brightWhite: '#A6A6A6', // activityBar.foreground
	extendedAnsi: ['#292929'] // editorRuler.foreground (approximation)
} as const

export const mojoBracketColors = {
	red: xTermMojoTheme.red,
	orange: xTermMojoTheme.yellow,
	yellow: xTermMojoTheme.brightYellow,
	green: xTermMojoTheme.green,
	blue: xTermMojoTheme.blue,
	indigo: xTermMojoTheme.brightBlue,
	violet: xTermMojoTheme.magenta
}
