import { tags as t } from '@lezer/highlight'
import { createTheme } from 'thememirror'

export const baseColors = {
	brightYellow: '#fffac2',
	brightMint: '#5DE4c7',
	lowerMint: '#5fb3a1',
	blueishGreen: '#42675A',

	lowerBlue: '#89ddff',
	lightBlue: '#ADD7FF',
	desaturatedBlue: '#91B4D5',
	bluishGrayBrighter: '#7390AA',

	hotRed: '#d0679d',
	pink: '#f087bd',
	gray: '#a6accd',

	darkerGray: '#767c9d',
	bluishGray: '#506477',
	focus: '#303340',
	bg: '#1b1e28',

	offWhite: '#e4f0fb',
	selection: '#717cb425',

	white: '#ffffff',
	black: '#000000',
	transparent: '#00000000'
} as const
export const poimandresBracketColors = {
	red: baseColors.hotRed,
	orange: baseColors.brightYellow,
	yellow: baseColors.brightMint,
	green: baseColors.lowerMint,
	blue: baseColors.lowerBlue,
	indigo: baseColors.desaturatedBlue,
	violet: baseColors.pink
}

export const poimandres = createTheme({
	variant: 'dark',
	settings: {
		background: baseColors.bg,
		foreground: baseColors.gray,
		caret: baseColors.gray,
		selection: baseColors.selection,
		gutterBackground: baseColors.bg,
		gutterForeground: baseColors.darkerGray,
		lineHighlight: baseColors.selection
	},
	styles: [
		{
			tag: t.comment,
			color: `${baseColors.darkerGray}B0`,
			fontStyle: 'italic'
		},
		{
			tag: [t.string, t.regexp],
			color: baseColors.brightMint
		},
		{
			tag: t.number,
			color: baseColors.brightMint
		},
		{
			tag: [t.bool, t.null],
			color: baseColors.hotRed
		},
		{
			tag: [t.punctuation, t.derefOperator],
			color: baseColors.gray
		},
		{
			tag: t.keyword,
			color: baseColors.gray
		},
		{
			tag: t.definitionKeyword,
			color: baseColors.brightMint
		},
		{
			tag: t.moduleKeyword,
			color: baseColors.brightMint
		},
		{
			tag: t.operator,
			color: baseColors.desaturatedBlue
		},
		{
			tag: [t.variableName, t.self],
			color: baseColors.offWhite
		},
		{
			tag: t.operatorKeyword,
			color: baseColors.desaturatedBlue
		},
		{
			tag: t.controlKeyword,
			color: `${baseColors.brightMint}c0`
		},
		{
			tag: t.className,
			color: baseColors.brightMint
		},
		{
			tag: [t.function(t.propertyName), t.propertyName],
			color: baseColors.lightBlue
		},
		{
			tag: t.tagName,
			color: baseColors.brightMint
		},
		{
			tag: t.modifier,
			color: baseColors.brightMint
		},
		{
			tag: [t.squareBracket, t.attributeName],
			color: baseColors.gray
		},
		{
			tag: t.link,
			color: baseColors.lightBlue,
			fontStyle: 'underline'
		},
		{
			tag: [t.url, t.special(t.string)],
			color: baseColors.lightBlue,
			fontStyle: 'underline'
		},
		{
			tag: t.meta,
			color: baseColors.lightBlue
		},
		{
			tag: t.atom,
			color: baseColors.brightMint
		},
		{
			tag: t.invalid,
			color: baseColors.hotRed
		},
		{
			tag: t.strong,
			color: baseColors.bluishGrayBrighter,
			fontStyle: 'bold'
		},
		{
			tag: t.emphasis,
			color: baseColors.bluishGrayBrighter,
			fontStyle: 'italic'
		},
		{
			tag: t.heading,
			color: baseColors.offWhite,
			fontStyle: 'bold'
		},
		{
			tag: t.strikethrough,
			color: baseColors.bluishGrayBrighter,
			fontStyle: 'strikethrough'
		}
	]
})

export const xTermPoimandresTheme = {
	foreground: baseColors.offWhite,
	background: baseColors.bg,
	cursor: baseColors.focus,
	cursorAccent: baseColors.offWhite,
	selectionBackground: baseColors.selection,
	selectionForeground: baseColors.white,
	selectionInactiveBackground: baseColors.selection,

	black: baseColors.black,
	red: baseColors.hotRed,
	green: baseColors.brightMint,
	yellow: baseColors.brightYellow,
	blue: baseColors.lowerBlue,
	magenta: baseColors.pink,
	cyan: baseColors.lowerMint,
	white: baseColors.offWhite,

	brightBlack: baseColors.darkerGray,
	brightRed: baseColors.hotRed,
	brightGreen: baseColors.brightMint,
	brightYellow: baseColors.brightYellow,
	brightBlue: baseColors.lightBlue,
	brightMagenta: baseColors.pink,
	brightCyan: baseColors.brightMint,
	brightWhite: baseColors.white,

	extendedAnsi: [baseColors.bluishGrayBrighter]
}
