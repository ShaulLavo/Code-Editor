import { autocompletion, closeBrackets } from '@codemirror/autocomplete';
import { history } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import {
  bracketMatching,
  indentOnInput
} from '@codemirror/language';
import { highlightSelectionMatches } from '@codemirror/search';
import { EditorState } from '@codemirror/state';
import {
  EditorView,
  drawSelection,
  highlightActiveLine,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  rectangularSelection
} from '@codemirror/view';
import { showMinimap } from '@replit/codemirror-minimap';
import { createShortcut, useKeyDownList } from '@solid-primitives/keyboard';
import {
  tsAutocompleteWorker,
  tsFacetWorker,
  tsHoverWorker,
  tsLinterWorker,
  tsSyncWorker
} from '@valtown/codemirror-ts';
import { type WorkerShape } from '@valtown/codemirror-ts/worker';
import * as Comlink from 'comlink';
import {
  Accessor,
  Setter,
  createEffect,
  createSignal,
  onCleanup,
  onMount
} from 'solid-js';
import { createEditorControlledValue } from './controlledValue';
import { createCompartmentExtension } from './createCompartmentExtension';
import { formatter, formmaterName } from './format';
import { editor, setEditor, miniMap, setMiniMap } from './editorStore';
import { ThemeKey, currentTheme, setTheme } from './themeStore';
import { defaultKeymap } from './utils/keymap';

export interface EditorProps {
  code: Accessor<string>;
  setCode: Setter<string>;
  defaultTheme?: ThemeKey;
  showLineNumber?: Accessor<boolean>;
  formatOnMount?: Accessor<boolean>;
}
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
    const innerWorker = new Worker(new URL('./worker.ts', import.meta.url), {
      type: 'module'
    });
    const worker = Comlink.wrap<Worker>(innerWorker);
    const baseEditorState = EditorState.create({
      doc: code(),
      extensions: [
        showMinimap.compute([], () => {
          return {
            create: () => ({ dom: miniMap() }),
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
          parent: editor(),
          dispatch: (transaction, editorView) => {
            currentView.update([transaction]);
            setCode(editorView.state.doc.toString());
          }
        });
        currentView.setState(baseEditorState);

        setView(currentView);
        formatOnMount() && setCode(await formatter()(code()));
        defaultTheme && setTheme(defaultTheme);
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
      console.log('foramt', formmaterName());
      const formatted = await formatter()(code());
      setCode(formatted);
    },
    { preventDefault: true }
  );
  createShortcut(
    ['Alt', 'Shift', 'Ï'],
    async () => {
      console.log('alt shift f', editorView());
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
      <div id="editor" ref={setEditor} />
      <div ref={setMiniMap} />
    </>
  );
};
