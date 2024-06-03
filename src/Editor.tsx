import { createShortcut } from '@solid-primitives/keyboard';
import { createCodeMirror, createEditorControlledValue } from 'solid-codemirror';
import { Accessor, createEffect, createSignal, on, onMount } from 'solid-js';
import { createDefaultExtensions } from './services/extensions';
import { preitter } from './services/preitter';
import { ThemeKey } from './stores/theme';
import { AsyncWorker } from './workers/services/AsyncWorker';
import { TypeScriptServer, TypeScriptServerResults } from './workers/services/TypeScriptServer';
import { linter, setDiagnostics, lintGutter, } from '@codemirror/lint';
import { TsWorker } from './App';



export interface EditorProps {
  // code: Accessor<string>;
  // setCode: Setter<string>;
  defaultCode: string;
  defaultTheme?: ThemeKey;
  showLineNumber?: Accessor<boolean>;
  formatOnMount?: Accessor<boolean>;
  postMessage: TsWorker['postMessage'];
}

export const Editor = ({
  // code,
  // setCode,
  postMessage,
  defaultCode,
  defaultTheme,
  showLineNumber,
  formatOnMount = () => true
}: EditorProps) => {
  const [code, setCode] = createSignal(defaultCode);
  const {
    ref: editorRef,
    createExtension,
    editorView
  } = createCodeMirror({
    onValueChange: code => {
      setCode(code);
      // updateServer(code);
    },
    value: code()
  });
  const [isMounted, setIsMounted] = createSignal(false);
  //this function does a heavy string compare
  // maybe set flag on input instead
  // maybe length check but that fails sometimes
  createEditorControlledValue(editorView, code);
  createShortcut(
    ['Alt', 'Shift', 'F'],
    async () => {
      const formatted = await preitter.format(code());
      setCode(formatted);
    },
    { preventDefault: true, requireReset: true }
  );
  createShortcut(
    ['Alt', 'Shift', 'Ï'],
    async () => {
      console.log('alt shift f', editorView());
      const formatted = await preitter.format(code());
      setCode(formatted);
    },
    { preventDefault: true, requireReset: true }
  );



  createEffect(on(code, async (code) => {
    console.log('code');

    const { payload: { success } } = await postMessage({ type: 'update', code });
    console.log('update', success);
  }, { defer: true }));



  createDefaultExtensions(createExtension, showLineNumber);


  // createExtension(linter(async () => {
  //   const { payload: { success, data } } = await postMessage({ type: 'diagnose', code: code() });
  //   console.log('diagnose', success, data);
  //   if (!success || !data) return [];
  //   return data;
  // }, {
  //   autoPanel: true, markerFilter(diagnostics, state) {
  //     return diagnostics.filter(diag => true);
  //   },
  // }));
  // createExtension(lintGutter());
  onMount(async () => {
    setIsMounted(true);
    const { payload: { success, data } } = await postMessage({ type: 'diagnose', code: code() });

    // setCode(await preitter.format(code()));
    setDiagnostics(editorView().state, data ?? []);
  });

  return (
    <>
      <div ref={editorRef} />
    </>
  );
};
