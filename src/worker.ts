import {
	createDefaultMapFromCDN,
	createSystem,
	createVirtualTypeScriptEnvironment
} from '@typescript/vfs'
import lzstring from 'lz-string'
import ts from 'typescript'
import { createWorkerStorage } from './utils/workerStorage'

import { createWorker } from '@valtown/codemirror-ts/worker'
import * as Comlink from 'comlink'
export const compilerOptions: ts.CompilerOptions = {
	target: ts.ScriptTarget.Latest,
	esModuleInterop: true,
	strict: true,
	allowSyntheticDefaultImports: true,
	noEmit: true,
	isolatedModules: true,
	jsx: ts.JsxEmit.React
}
let storage: Awaited<ReturnType<typeof createWorkerStorage>>
let system: ts.System = null!
const worker = createWorker(async () => {
	storage = await createWorkerStorage()
	const fsMap = await createDefaultMapFromCDN(
		compilerOptions,
		ts.version,
		true,
		ts,
		lzstring,
		undefined,
		storage
	)
	system = createSystem(fsMap)
	// Comlink.expose(system)
	return createVirtualTypeScriptEnvironment(system, [], ts, compilerOptions)
})
Comlink.expose({ ...worker, ...system })
self.postMessage('ready')
