import { HighlightStyle } from '@codemirror/language'
import { Tag, tags as t } from '@lezer/highlight'

type StyleConfig = {
	[key: string]: {
		color?: string
		textDecoration?: string
		fontStyle?: string
		fontWeight?: string
	}
}

const defaultColors: StyleConfig = {
	meta: { color: '#0c0c0d' },
	link: { textDecoration: 'underline' },
	heading: { textDecoration: 'underline', fontWeight: 'bold' },
	emphasis: { fontStyle: 'italic' },
	strong: { fontWeight: 'bold' },
	strikethrough: { textDecoration: 'line-through' },
	keyword: { color: '#5de4c7' },
	atom: { color: '#8a94b2' },
	bool: { color: '#5de4c7' },
	url: { color: '#5de4c7' },
	contentSeparator: { color: '#8a94b2' },
	labelName: { color: '#8a94b2' },
	literal: { color: '#89ddff' },
	inserted: { color: '#89ddff' },
	string: { color: '#5de4c7' },
	deleted: { color: '#303340' },
	regexp: { color: '#e4f0fb' },
	escape: { color: '#e4f0fb' },
	specialString: { color: '#e4f0fb' },
	definitionVariableName: { color: '#a6accd' },
	localVariableName: { color: '#30a' },
	typeName: { color: '#add7ff' },
	namespace: { color: '#add7ff' },
	className: { color: '#167' },
	specialVariableName: { color: '#303340' },
	macroName: { color: '#303340' },
	definitionPropertyName: { color: '#303340' },
	comment: { color: '#8fc5c9' },
	invalid: { color: '#f00' }
}

function getHighlightStyle(styleConfig: StyleConfig): HighlightStyle {
	const styleArray = Object.keys(styleConfig).flatMap(key => {
		const style = styleConfig[key]
		const tag = t[key as keyof typeof t] as Tag
		if (!tag) return []

		return [{ tag, ...style }]
	})

	return HighlightStyle.define(styleArray)
}

export const highlightStyle = getHighlightStyle(defaultColors)
