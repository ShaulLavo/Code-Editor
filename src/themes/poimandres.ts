import { tags as t } from '@lezer/highlight'
import { createTheme } from 'thememirror'

export const bg = '#1b1e28'
const gray = '#a6accd'
const select = '#272c3b'
const lowerBlue = '#89ddff'
const darkerGray = '#767c9d'
const offWhite = '#e4f0fb'
const brightMint = '#5DE4c7'
const lightBlue = '#ADD7FF'
const func = '#91b4d5'
export const poimandres = createTheme({
	variant: 'dark',
	settings: {
		background: bg,
		foreground: gray,
		caret: bg,
		selection: select,
		gutterBackground: bg,
		gutterForeground: '#383b4d',
		lineHighlight: select
	},
	styles: [
		{
			tag: t.comment,
			color: gray
		},
		{
			tag: [t.string, t.regexp, t.special(t.brace)],
			color: lowerBlue
		},
		{
			tag: t.number,
			color: darkerGray
		},
		{
			tag: t.bool,
			color: lowerBlue
		},
		{
			tag: [t.definitionKeyword, t.modifier, t.function(t.propertyName)],
			color: offWhite,
			fontWeight: 'bold'
		},
		{
			tag: [t.keyword, t.moduleKeyword, t.operatorKeyword, t.operator],
			color: brightMint,
			fontWeight: 'bold'
		},
		{
			tag: [t.variableName, t.attributeName],
			color: lightBlue
		},
		{
			tag: [t.function(t.variableName), t.definition(t.propertyName), t.derefOperator],
			color: '#fff'
		},
		{
			tag: t.angleBracket,
			color: '#55b4d480'
		},
		{
			tag: t.tagName,
			color: offWhite
		}
	]
})
