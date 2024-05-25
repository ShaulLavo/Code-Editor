import { createSignal, type Component } from 'solid-js'
import { Editor } from './Editor'
import {
  ThemeKey,
  currentBackground,
  currentColor,
  currentThemeName,
  setTheme,
  themeSettings
} from './themeStore'
import { formatCode } from './format'
import { all } from './constants/samples'

function capitalizeFirstLetter (word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}
const App: Component = () => {
  const [code, setCode] = createSignal(all)
  let header: HTMLDivElement = null!

  return (
    <main
      style={{
        'font-family': 'JetBrains Mono, monospace',
        height: '100vh',
        'background-color': currentBackground()
      }}
    >
      <div
        ref={header}
        class='bg-background-dark h-max'
        style={{ 'background-color': currentBackground() }}
      >
        <select
          style={{
            'background-color': currentBackground(),
            color: currentColor()
          }}
          onChange={e => {
            setTheme(e.currentTarget.value as ThemeKey)
          }}
        >
          {Object.keys(themeSettings).map(theme => {
            return (
              <option selected={theme === currentThemeName()} value={theme}>
                {capitalizeFirstLetter(theme)}
              </option>
            )
          })}
        </select>
        <button onMouseDown={async () => setCode(await formatCode(code()))}>
          Format
        </button>
      </div>

      <Editor code={code} setCode={setCode} />
    </main>
  )
}

export default App
