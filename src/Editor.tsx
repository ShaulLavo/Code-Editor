import { createCodeMirror, createEditorControlledValue } from 'solid-codemirror'
import { Accessor, Setter, onMount } from 'solid-js'
import { ThemeKey, setTheme } from './themeStore'
import { createDefaultExtensions } from './utils/extensions'
import { createShortcut } from '@solid-primitives/keyboard'
import { formatCode } from './format'

export interface EditorProps {
  code: Accessor<string>
  setCode: Setter<string>
  defaultTheme?: ThemeKey
  showLineNumber?: Accessor<boolean>
}

export const Editor = ({
  code,
  setCode,
  defaultTheme,
  showLineNumber
}: EditorProps) => {
  const {
    ref: EditorRef,
    createExtension,
    editorView
  } = createCodeMirror({
    onValueChange: setCode,
    value: code()
  })
  //this function does a heavy string compare
  createEditorControlledValue(editorView, code)
  createShortcut(
    ['Alt', 'Shift', 'F'],
    async () => {
      console.log('alt shift f', editorView())
      const formatted = await formatCode(code())
      setCode(formatted)
    },
    { preventDefault: true, requireReset: true }
  )
  createDefaultExtensions(createExtension, showLineNumber)
  defaultTheme && setTheme(defaultTheme)
  onMount(() => {
    console.log(editorView())
  })

  return <div ref={EditorRef} />
}
