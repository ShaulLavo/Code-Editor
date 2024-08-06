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

const compilerOptions: ts.CompilerOptions = {
	target: ts.ScriptTarget.ES2016,
	esModuleInterop: true,
	strict: true,
	allowSyntheticDefaultImports: true,
	noEmit: true,
	isolatedModules: true
}

const storage = (await createWorkerStorage().catch(console.error)) ?? undefined
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
const worker = createWorker(async () =>
	createVirtualTypeScriptEnvironment(system, [], ts, compilerOptions)
)
Comlink.expose({ ...worker, close: storage?.close })

self.postMessage('ready')
