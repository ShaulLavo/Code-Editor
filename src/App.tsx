import { Accessor, Setter, createSignal, on, onCleanup, type Component } from 'solid-js';
import { Editor } from './Editor';
import { all, sampleClass, sampleFunc } from './constants/samples';
import {
  ThemeKey,
  currentBackground,
  currentColor,
  currentThemeName,
  setTheme,
  themeSettings
} from './stores/theme';

import { PanelGroup, Panel, ResizeHandle } from "solid-resizable-panels";
import { AsyncWorker } from './workers/services/AsyncWorker';
import { TypeScriptServer, TypeScriptServerResults } from './workers/services/TypeScriptServer';

//todo add LSP https://github.com/FurqanSoftware/codemirror-languageserver
//todo add lint for client side maybe?
function capitalizeFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
type WorkerResult<T extends keyof TypeScriptServerResults> = Promise<{
  type: T,
  payload: TypeScriptServerResults[T];
  id: number;
}>;
export function initTsWorker() {
  const tsServer = new AsyncWorker(new URL('workers/ts.worker.ts', import.meta.url).href);
  return {
    async postMessage<T extends keyof TypeScriptServer>({ type, code }: { type: T; code?: string; }): WorkerResult<T> {
      try {
        const result = await tsServer.sendMessage<Awaited<WorkerResult<T>>>({ type, code });
        return result;

      } catch (e) {
        console.log('error', e);
        return [] as any;
      }
    },
    terminate() {
      tsServer.terminate();
    }
  };
}
export type TsWorker = ReturnType<typeof initTsWorker>;

const App: Component = () => {

  const [showLineNumber, setShowLineNumber] = createSignal(false);
  const { postMessage, terminate } = initTsWorker();
  onCleanup(terminate);
  return (
    <main
      style={{
        'font-family': 'JetBrains Mono, monospace',
        'background-color': currentBackground()
      }}
    >

      <Header setShowLineNumber={setShowLineNumber} showLineNumber={showLineNumber} />
      <Editor postMessage={postMessage} showLineNumber={showLineNumber} defaultCode={sampleFunc} />


      {/* <PanelGroup direction="row" class='overflow-y-hidden'>
        <Panel
          id="1"
          collapsible
          onCollapse={() => console.log("collapsed")}
          onExpand={() => console.log("expanded")}1
        >
          <Editor postMessage={postMessage} showLineNumber={showLineNumber} defaultCode={sampleClass} />

        </Panel>
        <ResizeHandle />
        <Panel
          id="2"
          collapsible
          onCollapse={() => console.log("collapsed")}
          onExpand={() => console.log("expanded")}
        >
          <Editor postMessage={postMessage} showLineNumber={showLineNumber} defaultCode={sampleFunc} />
        </Panel>
      </PanelGroup> */}

    </main>
  );
};

export default App;



function Header({ setShowLineNumber, showLineNumber }: { showLineNumber: Accessor<boolean>, setShowLineNumber: Setter<boolean>; }) {

  return (<div
    class='bg-background-dark h-max'
    style={{ 'background-color': currentBackground() }}
  >
    <select
      style={{
        'background-color': currentBackground(),
        color: currentColor()
      }}
      onChange={e => {
        setTheme(e.currentTarget.value as ThemeKey);
      }}
    >
      {Object.keys(themeSettings).map(theme => {
        return (
          <option selected={theme === currentThemeName()} value={theme}>
            {capitalizeFirstLetter(theme)}
          </option>
        );
      })}
    </select>{' '}
    <button
      style={{
        color: currentColor()
      }}
      onMouseDown={() => setShowLineNumber(!showLineNumber())}
    >
      Toggle Line Number
    </button>
  </div>);
}