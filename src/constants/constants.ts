import ts from 'typescript'
import { types } from 'util'

export const compilerOptions: ts.CompilerOptions = {
	target: ts.ScriptTarget.Latest,
	esModuleInterop: true,
	strict: true,
	allowSyntheticDefaultImports: true,
	noEmit: true,
	isolatedModules: true,
	jsx: ts.JsxEmit.React,
	types: ['jsdom', 'node', 'react'],
	lib: ['es5', 'es6', 'dom', 'ES2015']
} as const

export const EDITOR_FS_NAME = 'file-system'
export const EDITOR_PATH_KEY = 'editorPath'

export const TERMINAL_FS_NAME = 'file-system'
export const TERMINAL_PATH_KEY = 'xTerm'
export const TERMINAL_TAB_KEY = 'xTermTabs'
