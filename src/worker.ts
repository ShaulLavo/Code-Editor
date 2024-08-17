import {
	createDefaultMapFromCDN,
	createSystem,
	createVirtualTypeScriptEnvironment
} from '@typescript/vfs'
import lzstring from 'lz-string'
import ts from 'typescript'
import { createWorkerStorage } from './workerStorage'

import { createWorker } from '@valtown/codemirror-ts/worker'
import * as Comlink from 'comlink'
export const compilerOptions: ts.CompilerOptions = {
	target: ts.ScriptTarget.ES2016,
	esModuleInterop: true,
	strict: true,
	allowSyntheticDefaultImports: true,
	noEmit: true,
	isolatedModules: true
}
let storage: Awaited<ReturnType<typeof createWorkerStorage>>
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
	const system = createSystem(fsMap)
	return createVirtualTypeScriptEnvironment(system, [], ts, compilerOptions)
})
Comlink.expose(worker)
self.postMessage('ready')
