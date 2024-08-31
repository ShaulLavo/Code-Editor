import { EditorView } from '@codemirror/view'
import { Accessor, Resource, createEffect, createMemo, on } from 'solid-js'

export function createEditorControlledValue(
	view: Accessor<EditorView | undefined>,
	code:
		| Accessor<string>
		| Resource<string | undefined>
		| (() => string | undefined)
): void {
	const memoizedCode = createMemo(code)

	createEffect(
		on(view, view => {
			if (!view) return
			createEffect(
				on(memoizedCode, code => {
					const localValue = view?.state.doc.toString()
					if (code === localValue) return
					// string cmpare unnotticeable up to 1k rows
					// need to implement a better way to compare large strings

					view.dispatch({
						changes: {
							from: 0,
							to: localValue?.length,
							insert: code ?? ''
						}
					})
				})
			)
		})
	)
}
