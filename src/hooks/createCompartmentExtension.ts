import { Compartment, Extension, StateEffect } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { Accessor, createEffect, createSignal, on, onMount } from 'solid-js'

export type CompartmentReconfigurationCallback = (extension: Extension) => void

export function createCompartmentExtension(
	extension: Accessor<Extension>,
	view: Accessor<EditorView>
) {
	const compartment = new Compartment()
	createEffect(() => {
		updateCompartment(view(), compartment, extension())
	})
}

function updateCompartment(
	view: EditorView,
	compartment: Compartment,
	extension: Extension
) {
	if (!view) return
	if (compartment.get(view.state)) {
		view?.dispatch({ effects: compartment.reconfigure(extension) })
	} else {
		view.dispatch({
			effects: StateEffect.appendConfig.of(compartment.of(extension))
		})
	}
}
