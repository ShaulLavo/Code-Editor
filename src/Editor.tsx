import {
  Accessor,
  Setter,
  createEffect,
  createSignal,
  on,
  onCleanup,
  onMount
} from 'solid-js';
import { ThemeKey, setTheme } from './themeStore';
import { createShortcut, useKeyDownList } from '@solid-primitives/keyboard';
import { Formmater, formatter, formmaterName } from './format';
import { showMinimap, MinimapConfig } from '@replit/codemirror-minimap';
import { Compartment, StateEffect } from '@codemirror/state';
import { type WorkerShape } from '@valtown/codemirror-ts/worker';
import {
  tsFacetWorker,
  tsSyncWorker,
  tsLinterWorker,
  tsAutocompleteWorker,
  tsHoverWorker,
  tsFacet,
  tsSync,
  tsLinter,
  tsAutocomplete,
  tsHover
} from '@valtown/codemirror-ts';
import * as Comlink from 'comlink';
import { all } from './constants/samples';
import { createCompartmentExtension } from './createCompartmentExtension';
import { history } from '@codemirror/commands';
import { autocompletion, closeBrackets } from '@codemirror/autocomplete';
import { javascript } from '@codemirror/lang-javascript';
import {
  bracketMatching,
  foldGutter,
  indentOnInput
} from '@codemirror/language';
import { highlightSelectionMatches } from '@codemirror/search';
import { EditorState } from '@codemirror/state';
import {
  drawSelection,
  EditorView,
  gutter,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  rectangularSelection
} from '@codemirror/view';
import { defaultKeymap } from './utils/keymap';
import { currentTheme } from './themeStore';
export interface EditorProps {
  code: Accessor<string>;
  setCode: Setter<string>;
  defaultTheme?: ThemeKey;
  showLineNumber?: Accessor<boolean>;
  formatOnMount?: Accessor<boolean>;
}
import { createEditorControlledValue } from './controlledValue';
import {
  createDefaultMapFromCDN,
  createSystem,
  createVirtualTypeScriptEnvironment
} from '@typescript/vfs';
import ts from 'typescript';
import { refs } from './editorStore';
interface Worker extends WorkerShape {
  close: () => void;

}

export const Editor = ({
  code,
  setCode,
  defaultTheme,
  showLineNumber,
  formatOnMount = () => true
}: EditorProps) => {

  const [editorView, setView] = createSignal<EditorView>(null!);



  onMount(() => {
    const start = performance.now();

    const innerWorker = new Worker(new URL('./worker.ts', import.meta.url), {
      type: 'module'
    });

    const worker = Comlink.wrap<Worker>(innerWorker);
    const baseEditorState = EditorState.create({
      doc: code(),
      extensions: [
        showMinimap.compute([], () => {
          return {
            create: () => ({ dom: refs.miniMap }),
            showOverlay: 'mouse-over',
            displayText: 'blocks'
          };
        }),
        highlightSpecialChars(),
        history(),
        drawSelection(),
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        rectangularSelection(),
        highlightActiveLine(),
        highlightSelectionMatches(),
        EditorView.lineWrapping,
        keymap.of(defaultKeymap),
        javascript({ jsx: true, typescript: true }),
        tsFacetWorker.of({ worker, path: 'index.ts' }),
        tsSyncWorker(),
        tsLinterWorker(),
        autocompletion({
          override: [tsAutocompleteWorker()],
        }),
        tsHoverWorker()
        // tsFacet.of({ env, path }),
        // tsSync(),
        // tsLinter(),
        // autocompletion({
        //   override: [tsAutocomplete()],
        // }),
        // tsHover(),
      ],
    });
    innerWorker.onmessage = async e => {
      if (e.data === 'ready') {
        await worker.initialize();
        const currentView = new EditorView({
          parent: refs.editor,
          dispatch: (transaction, editorView) => {
            currentView.update([transaction]);
            setCode(editorView.state.doc.toString());
          }
        });
        currentView.setState(baseEditorState);

        refs.miniMap.addEventListener('mouseenter', () => {
          console.log('Mouse entered');
        });
        refs.miniMap.addEventListener('mouseleave', () => {
          console.log('Mouse left');
        });
        setView(currentView);
        formatOnMount() && setCode(await formatter()(code()));
        defaultTheme && setTheme(defaultTheme);
        const end = performance.now();
        console.log(`Execution time: ${end - start} milliseconds`);
      }
    };
    onCleanup(() => {
      worker.close();
    });
  });
  createCompartmentExtension(currentTheme, editorView);
  createCompartmentExtension(
    () => (showLineNumber?.() ? lineNumbers() : []),
    editorView
  );
  createEditorControlledValue(editorView, code);

  createShortcut(
    ['Alt', 'Shift', 'F'],
    async () => {
      const formatted = await formatter()(code());
      setCode(formatted);
    },
    { preventDefault: true }
  );
  createShortcut(
    ['Alt', 'Shift', 'Ï'],
    async () => {
      const formatted = await formatter()(code());
      setCode(formatted);
    },
    { preventDefault: true }
  );

  const pressed = useKeyDownList();
  createEffect(() => {
    console.log('pressed', pressed());
  });


  return (
    <>
      <div id="editor" ref={refs.editor} />
      <div ref={refs.miniMap} />
    </>
  );
};
