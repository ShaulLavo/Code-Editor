import { tags as t } from '@lezer/highlight'
import { createTheme } from 'thememirror'

export const lightColors = {
	background: '#f9f9f8',
	foreground: '#1b263b',
	caret: '#778da9',
	selection: '#778da950',
	gutterBackground: '#f9f9f8',
	gutterForeground: '#c5d0e4',
	lineHighlight: '#e3e8ee4c',
	brightMint: '#415a77',
	brightYellow: '#ffeb3b',
	lightBlue: '#03a9f4',
	hotRed: '#f44336',
	gray: '#607d8b',
	darkerGray: '#455a64',
	offWhite: '#f5f5f5',
	focus: '#343131',
	bluishGrayBrighter: '#90a4ae'
} as const

export const light = createTheme({
	variant: 'light',
	settings: {
		background: lightColors.background,
		foreground: lightColors.foreground,
		caret: lightColors.caret,
		selection: lightColors.selection,
		gutterBackground: lightColors.gutterBackground,
		gutterForeground: lightColors.gutterForeground,
		lineHighlight: lightColors.lineHighlight
	},
	styles: [
		{
			tag: t.comment,
			color: `${lightColors.darkerGray}B0`,
			fontStyle: 'italic'
		},
		{
			tag: [t.string, t.regexp],
			color: lightColors.brightMint
		},
		{
			tag: t.number,
			color: lightColors.brightMint
		},
		{
			tag: [t.bool, t.null],
			color: lightColors.hotRed
		},
		{
			tag: [t.punctuation, t.derefOperator],
			color: lightColors.gray
		},
		{
			tag: t.keyword,
			color: lightColors.gray
		},
		{
			tag: t.definitionKeyword,
			color: lightColors.brightMint
		},
		{
			tag: t.operator,
			color: lightColors.lightBlue
		},
		{
			tag: [t.variableName, t.self],
			color: lightColors.focus
		},
		{
			tag: t.operatorKeyword,
			color: lightColors.lightBlue
		},
		{
			tag: t.className,
			color: lightColors.brightMint
		},
		{
			tag: [t.function(t.propertyName), t.propertyName],
			color: lightColors.lightBlue
		},
		{
			tag: t.invalid,
			color: lightColors.hotRed
		},
		{
			tag: t.strong,
			color: lightColors.bluishGrayBrighter,
			fontStyle: 'bold'
		},
		{
			tag: t.emphasis,
			color: lightColors.bluishGrayBrighter,
			fontStyle: 'italic'
		}
	]
})

export const xTermlightTheme = {
	foreground: lightColors.foreground,
	background: lightColors.background,
	cursor: lightColors.focus,
	cursorAccent: lightColors.offWhite,
	selectionBackground: lightColors.selection,
	selectionForeground: lightColors.foreground,
	selectionInactiveBackground: lightColors.selection,

	black: lightColors.darkerGray,
	red: lightColors.hotRed,
	green: lightColors.brightMint,
	yellow: lightColors.brightYellow,
	blue: lightColors.lightBlue,
	magenta: lightColors.hotRed,
	cyan: lightColors.brightMint,
	white: lightColors.offWhite,

	brightBlack: lightColors.darkerGray,
	brightRed: lightColors.hotRed,
	brightGreen: lightColors.brightMint,
	brightYellow: lightColors.brightYellow,
	brightBlue: lightColors.lightBlue,
	brightMagenta: lightColors.hotRed,
	brightCyan: lightColors.brightMint,
	brightWhite: lightColors.offWhite,

	extendedAnsi: [lightColors.bluishGrayBrighter]
}
export const lightBracketColors = {
	red: lightColors.hotRed,
	orange: lightColors.brightYellow,
	yellow: lightColors.brightMint,
	green: lightColors.lightBlue,
	blue: lightColors.lightBlue,
	indigo: lightColors.gray,
	violet: lightColors.darkerGray
}
export const darkColors = {
	focus: '#303340',
	background: '#302D2D',
	text: '#F6F2F2',
	selection: '#3431314c',
	brightYellow: '#9ECECA',
	brightMint: '#FFE4E4',
	lowerMint: '#FFE4E4',
	lowerBlue: '#FFE4E4',
	lightBlue: '#FFE4E4',
	desaturatedBlue: '#FFE4E4',
	bluishGrayBrighter: '#7390AA',
	hotRed: '#d0679d',
	pink: '#f087bd',
	gray: '#a6accd',
	darkerGray: '#767c9d'
} as const
export const darkBracketColors = {
	red: darkColors.hotRed,
	orange: darkColors.brightYellow,
	yellow: darkColors.brightMint,
	green: darkColors.lowerMint,
	blue: darkColors.lowerBlue,
	indigo: darkColors.desaturatedBlue,
	violet: darkColors.pink
}
export const dark = createTheme({
	variant: 'dark',
	settings: {
		background: darkColors.background,
		foreground: darkColors.gray,
		caret: darkColors.gray,
		selection: darkColors.selection,
		gutterBackground: darkColors.background,
		gutterForeground: darkColors.darkerGray,
		lineHighlight: darkColors.selection
	},
	styles: [
		{
			tag: t.comment,
			color: `${darkColors.darkerGray}B0`,
			fontStyle: 'italic'
		},
		{
			tag: [t.string, t.regexp],
			color: darkColors.brightMint
		},
		{
			tag: t.number,
			color: darkColors.brightMint
		},
		{
			tag: [t.bool, t.null],
			color: darkColors.hotRed
		},
		{
			tag: [t.punctuation, t.derefOperator],
			color: darkColors.gray
		},
		{
			tag: t.keyword,
			color: darkColors.gray
		},
		{
			tag: t.definitionKeyword,
			color: darkColors.brightMint
		},
		{
			tag: t.moduleKeyword,
			color: darkColors.brightMint
		},
		{
			tag: t.operator,
			color: darkColors.desaturatedBlue
		},
		{
			tag: [t.variableName, t.self],
			color: darkColors.text
		},
		{
			tag: t.operatorKeyword,
			color: darkColors.desaturatedBlue
		},
		{
			tag: t.controlKeyword,
			color: `${darkColors.brightMint}c0`
		},
		{
			tag: t.className,
			color: darkColors.brightMint
		},
		{
			tag: [t.function(t.propertyName), t.propertyName],
			color: darkColors.lightBlue
		},
		{
			tag: t.tagName,
			color: darkColors.brightMint
		},
		{
			tag: t.modifier,
			color: darkColors.brightMint
		},
		{
			tag: [t.squareBracket, t.attributeName],
			color: darkColors.gray
		},
		{
			tag: t.link,
			color: darkColors.lightBlue,
			fontStyle: 'underline'
		},
		{
			tag: [t.url, t.special(t.string)],
			color: darkColors.lightBlue,
			fontStyle: 'underline'
		},
		{
			tag: t.meta,
			color: darkColors.lightBlue
		},
		{
			tag: t.atom,
			color: darkColors.brightMint
		},
		{
			tag: t.invalid,
			color: darkColors.hotRed
		},
		{
			tag: t.strong,
			color: darkColors.bluishGrayBrighter,
			fontStyle: 'bold'
		},
		{
			tag: t.emphasis,
			color: darkColors.bluishGrayBrighter,
			fontStyle: 'italic'
		},
		{
			tag: t.heading,
			color: darkColors.text,
			fontStyle: 'bold'
		},
		{
			tag: t.strikethrough,
			color: darkColors.bluishGrayBrighter,
			fontStyle: 'strikethrough'
		}
	]
})

export const xTermDarkTheme = {
	foreground: darkColors.text,
	background: darkColors.background,
	cursor: darkColors.focus,
	cursorAccent: darkColors.text,
	selectionBackground: darkColors.selection,
	selectionForeground: darkColors.text,
	selectionInactiveBackground: darkColors.selection,

	black: darkColors.darkerGray,
	red: darkColors.hotRed,
	green: darkColors.brightMint,
	yellow: darkColors.brightYellow,
	blue: darkColors.text,
	magenta: darkColors.hotRed,
	cyan: darkColors.brightMint,
	white: darkColors.text,

	brightBlack: darkColors.darkerGray,
	brightRed: darkColors.hotRed,
	brightGreen: darkColors.brightMint,
	brightYellow: darkColors.brightYellow,
	brightBlue: darkColors.text,
	brightMagenta: darkColors.hotRed,
	brightCyan: darkColors.brightMint,
	brightWhite: darkColors.text,

	extendedAnsi: [darkColors.bluishGrayBrighter]
}
