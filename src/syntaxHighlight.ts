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
	keyword: { color: '#7390aa' },
	atom: { color: '#219' },
	bool: { color: '#219' },
	url: { color: '#219' },
	contentSeparator: { color: '#219' },
	labelName: { color: '#219' },
	literal: { color: '#89ddff' },
	inserted: { color: '#89ddff' },
	string: { color: '#5de4c7' },
	deleted: { color: '#303340' },
	regexp: { color: '#e4f0fb' },
	escape: { color: '#e4f0fb' },
	specialString: { color: '#e4f0fb' },
	definitionVariableName: { color: '#a6accd' },
	localVariableName: { color: '#30a' },
	typeName: { color: '#506477' },
	namespace: { color: '#506477' },
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
