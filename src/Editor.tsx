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
  createEditorControlledValue(editorView, code)
  createShortcut(
    ['Alt', 'Shift', 'F'],
    async () => {
      const formatted = await formatCode(code())
      setCode(formatted)
    },
    { preventDefault: true, requireReset: true }
  )
  createDefaultExtensions(createExtension, showLineNumber)
  defaultTheme && setTheme(defaultTheme)
  onMount(() => {})

  return <div ref={EditorRef} />
}
