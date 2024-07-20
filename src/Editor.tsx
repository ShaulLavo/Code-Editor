import { createCodeMirror, createEditorControlledValue } from 'solid-codemirror';
import { Accessor, Setter, createEffect, onMount } from 'solid-js';
import { ThemeKey, setTheme } from './themeStore';
import { createDefaultExtensions } from './utils/extensions';
import { createShortcut } from '@solid-primitives/keyboard';
import { formatCode } from './format';
import { showMinimap, MinimapConfig } from '@replit/codemirror-minimap';
import { EditorView } from '@codemirror/view';
import { Compartment, StateEffect } from '@codemirror/state';

export interface EditorProps {
  code: Accessor<string>;
  setCode: Setter<string>;
  defaultTheme?: ThemeKey;
  showLineNumber?: Accessor<boolean>;
  formatOnMount?: Accessor<boolean>;
}
// const create =
export const Editor = ({
  code,
  setCode,
  defaultTheme,
  showLineNumber,
  formatOnMount = () => true
}: EditorProps) => {
  const {
    ref: editorRef,
    createExtension,
    editorView
  } = createCodeMirror({
    onValueChange: setCode,
    value: code()
  });
  let minimapRef: HTMLDivElement = null!;

  //this function does a heavy string compare
  // maybe set flag on input instead
  // maybe length check but that fails sometimes
  createEditorControlledValue(editorView, code);
  createShortcut(
    ['Alt', 'Shift', 'F'],
    async () => {
      const formatted = await formatCode(code());
      setCode(formatted);
    },
    { preventDefault: true, requireReset: true }
  );
  createShortcut(
    ['Alt', 'Shift', 'Ï'],
    async () => {
      console.log('alt shift f', editorView());
      const formatted = await formatCode(code());
      setCode(formatted);
    },
    { preventDefault: true, requireReset: true }
  );

  // queueMicrotask(() => {
  // })
  createDefaultExtensions(createExtension, showLineNumber);
  defaultTheme && setTheme(defaultTheme);

  // createEffect(() => {
  //   if (editorView()) {
  //     const compartment = new Compartment()
  //     editorView().dispatch({
  //       effects: StateEffect.appendConfig.of(
  //         showMinimap.compute([], state => {
  //           // return null
  //           return {
  //             create: () => ({ dom: document.createElement('div') }),
  //             displayText: 'characters',
  //             showOverlay: 'mouse-over'
  //           }
  //         })
  //       )
  //     })
  //   }
  // })
  onMount(async () => {
    // console.log(editorView())
  });

  return (
    <>
      <div ref={editorRef} />
    </>
  );
};
