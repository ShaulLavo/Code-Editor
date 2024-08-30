import ts from 'typescript'

export const compilerOptions: ts.CompilerOptions = {
	target: ts.ScriptTarget.Latest,
	esModuleInterop: true,
	strict: true,
	allowSyntheticDefaultImports: true,
	noEmit: true,
	isolatedModules: true,
	jsx: ts.JsxEmit.React
} as const
