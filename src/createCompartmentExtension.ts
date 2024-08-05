import { Compartment, Extension, StateEffect } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { Accessor, createEffect, createSignal, on } from 'solid-js';

export type CompartmentReconfigurationCallback = (extension: Extension) => void;


export function useExtension(
  extension: Extension,
  view: Accessor<EditorView>
): (useExtension: boolean | ((current: boolean) => boolean)) => void {
  const compartment = new Compartment();
  const [useExtension, setUseExtension] = createSignal(true);

  const reconfigure = () => {
    if (view()) {
      const effects = useExtension()
        ? compartment.reconfigure(extension)
        : compartment.reconfigure([]);
      view()?.dispatch({ effects });
    }
  };

  createEffect(() => {
    if (view() && compartment.get(view().state)) {
      reconfigure();
    } else if (view()) {
      view().dispatch({
        effects: StateEffect.appendConfig.of(compartment.of(useExtension() ? extension : [])),
      });
    }
  });

  return (use: boolean | ((current: boolean) => boolean)) => {
    setUseExtension((prev) => (typeof use === 'function' ? use(prev) : use));
  };
}

export function createCompartmentExtension(
  extension: Accessor<Extension | undefined> | Extension,
  view: Accessor<EditorView | undefined>
): CompartmentReconfigurationCallback {
  const compartment = new Compartment();

  const reconfigure = (extension: Extension) => {
    view()?.dispatch({
      effects: compartment.reconfigure(extension),
    });
  };

  const $extension =
    typeof extension === 'function' ? extension : () => extension;

  createEffect(
    on(
      [view, $extension],
      ([view, extension]) => {
        if (view && extension) {
          if (compartment.get(view.state)) {
            reconfigure(extension);
          } else {
            view.dispatch({
              effects: StateEffect.appendConfig.of(compartment.of(extension)),
            });
          }
        }
      },
      { defer: true }
    )
  );

  return reconfigure;
}