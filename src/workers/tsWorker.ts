import {
	createDefaultMapFromCDN,
	createSystem,
	createVirtualTypeScriptEnvironment,
	VirtualTypeScriptEnvironment
} from '@typescript/vfs'
import lzstring from 'lz-string'
import ts from 'typescript'
import { createWorkerStorage } from './workerStorage'

import { createWorker } from '@valtown/codemirror-ts/worker'
import * as Comlink from 'comlink'
import { compilerOptions } from '../constants/constants'

let storage: Awaited<ReturnType<typeof createWorkerStorage>>
let virtualTypeScriptEnvironment: VirtualTypeScriptEnvironment = null!
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
	virtualTypeScriptEnvironment = createVirtualTypeScriptEnvironment(
		createSystem(fsMap),
		[],
		ts,
		compilerOptions
	)

	return virtualTypeScriptEnvironment
})
Comlink.expose({ ...worker, ...virtualTypeScriptEnvironment })
self.postMessage('ready')
