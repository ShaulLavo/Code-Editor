import { createCodeMirror, createEditorControlledValue } from 'solid-codemirror'
import { Accessor, Setter, onMount } from 'solid-js'
import { ThemeKey, setTheme } from './themeStore'
import { createDefaultExtensions } from './utils/extensions'
import { createShortcut } from '@solid-primitives/keyboard'
import { formatCode } from './format'
import { showMinimap } from '@replit/codemirror-minimap'
import { EditorView } from '@codemirror/view'

export interface EditorProps {
  code: Accessor<string>
  setCode: Setter<string>
  defaultTheme?: ThemeKey
  showLineNumber?: Accessor<boolean>
}
// const create =
export const Editor = ({
  code,
  setCode,
  defaultTheme,
  showLineNumber
}: EditorProps) => {
  const {
    ref: editorRef,
    createExtension,
    editorView
  } = createCodeMirror({
    onValueChange: setCode,
    value: code()
  })
  let minimapRef: HTMLDivElement = null!

  //this function does a heavy string compare
  // maybe set flag on input instead
  // maybe length check but that fails sometimes
  createEditorControlledValue(editorView, code)
  createShortcut(
    ['Alt', 'Shift', 'F'],
    async () => {
      const formatted = await formatCode(code())
      setCode(formatted)
    },
    { preventDefault: true, requireReset: true }
  )
  createExtension(
    showMinimap.compute(['doc'], state => {
      console.log(state)
      return {
        create: (v: EditorView) => {
          const dom = document.createElement('div')
          // v.dom.appendChild(dom)
          // dom.style.zIndex = '1000'
          return { dom }
        },
        /* optional */
        eventHandlers: {
          contextmenu: e => console.log(e)
        },
        displayText: 'characters',
        showOverlay: 'mouse-over'
        // gutters: [{ 1: '#00FF00', 2: '#00FF00' }]
      }
    })
  )

  createDefaultExtensions(createExtension, showLineNumber)
  defaultTheme && setTheme(defaultTheme)
  onMount(() => {
    console.log(minimapRef)
  })

  return (
    <>
      <div ref={editorRef} />
    </>
  )
}
