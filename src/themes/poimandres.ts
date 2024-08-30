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
		// {
		// 	tag: [t.angleBracket, t.paren, t.squareBracket],
		// 	color: baseColors.lowerBlue
		// }
	]
})

export const xTermPoimandresTheme = {
	// Default colors
	foreground: baseColors.offWhite, // Map to a suitable foreground color
	background: baseColors.bg, // Map to your background color
	cursor: baseColors.focus, // Cursor color
	cursorAccent: baseColors.offWhite, // Accent color for the cursor (fg color for a block cursor)
	selectionBackground: baseColors.selection, // Selection background color
	selectionForeground: baseColors.white, // Selection foreground color (optional)
	selectionInactiveBackground: baseColors.selection, // Inactive selection background color

	// ANSI colors
	black: baseColors.black, // ANSI black
	red: baseColors.hotRed, // ANSI red
	green: baseColors.brightMint, // ANSI green
	yellow: baseColors.brightYellow, // ANSI yellow
	blue: baseColors.lowerBlue, // ANSI blue
	magenta: baseColors.pink, // ANSI magenta
	cyan: baseColors.lowerMint, // ANSI cyan
	white: baseColors.offWhite, // ANSI white

	brightBlack: baseColors.darkerGray, // ANSI bright black
	brightRed: baseColors.hotRed, // ANSI bright red
	brightGreen: baseColors.brightMint, // ANSI bright green
	brightYellow: baseColors.brightYellow, // ANSI bright yellow
	brightBlue: baseColors.lightBlue, // ANSI bright blue
	brightMagenta: baseColors.pink, // ANSI bright magenta
	brightCyan: baseColors.brightMint, // ANSI bright cyan
	brightWhite: baseColors.white, // ANSI bright white

	// Optional extended ANSI colors (16-255)
	extendedAnsi: [
		baseColors.bluishGrayBrighter // Example of how you can map additional colors
		// ... more colors if needed
	]
}
