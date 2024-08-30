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
import { compilerOptions } from '../constants/constants'

let storage: Awaited<ReturnType<typeof createWorkerStorage>>
let system: ts.System = null!
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
const worker = createWorker(() =>
	createVirtualTypeScriptEnvironment(system, [], ts, compilerOptions)
)
Comlink.expose({ ...worker, ...system })
self.postMessage('ready')
