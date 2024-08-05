import { For, createSignal, type Component } from 'solid-js';
import { Editor } from './Editor';
import { all } from './constants/samples';
import {
  ThemeKey,
  currentBackground,
  currentColor,
  currentThemeName,
  setTheme,
  themeSettings
} from './themeStore';
import { Formmater, formmaterName, setFormmater } from './format';
import { editor, setEditor, miniMap, setMiniMap, setCode, code, setShowLineNumber, showLineNumber } from './editorStore';


function capitalizeFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
const App: Component = () => {


  return (
    <main
      style={{
        'font-family': 'JetBrains Mono, monospace',
        height: '100vh',
        'background-color': currentBackground()
      }}
    >
      <div
        class='bg-background-dark h-max'
        style={{ 'background-color': currentBackground(), color: currentColor() }}
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
          <For each={Object.keys(themeSettings)}>
            {(theme) =>
              <option selected={theme === currentThemeName()} value={theme}>
                {capitalizeFirstLetter(theme)}
              </option>
            }
          </For>

        </select> {' '}|{' '}

        <button
          style={{
            color: currentColor()
          }}
          onMouseDown={async () => setCode(await Formmater.prettier(code()))}
        >
          prettier
        </button>
        {' '}|{' '}
        <button
          style={{
            color: currentColor()
          }}
          onMouseDown={() => setShowLineNumber(!showLineNumber())}
        >
          Toggle Line Number
        </button>
        {' '}|{' '}
        <button
          style={{
            color: currentColor()
          }}
          onMouseDown={() => miniMap().style.display = miniMap().style.display === 'none' ? 'block' : 'none'}
        >
          Toggle MiniMap
        </button>
      </div>

      <Editor showLineNumber={showLineNumber} code={code} setCode={setCode} />
    </main>
  );
};

export default App;
