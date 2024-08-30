import { EditorView } from '@codemirror/view'
import { WorkerShape } from '@valtown/codemirror-ts/worker'
import { Remote } from 'comlink'
import ts from 'typescript'
import { setIsTsLoading } from '~/stores/editorStore'
import * as Comlink from 'comlink'

type Worker = WorkerShape &
	Remote<ts.System> & {
		close: () => void
	}

export function createLoggingProxy<T extends {}>(target: T): T {
	return new Proxy(target, {
		get(target, prop, receiver) {
			const originalMethod = Reflect.get(target, prop, receiver)
			if (typeof originalMethod === 'function') {
				return (...args: any[]) => {
					console.log(`Calling ${String(prop)} with arguments:`, args)
					const result = originalMethod.apply(target, args)
					if (result instanceof Promise) {
						return result.then(res => {
							console.log(`Result from ${String(prop)}:`, res)
							return res
						})
					} else {
						console.log(`Result from ${String(prop)}:`, result)
						return result
					}
				}
			}
			return originalMethod
		}
	})
}
function WorkerStatusProxy<T extends {}>(target: T): T {
	return new Proxy(target, {
		get(target, prop, receiver) {
			const originalMethod = Reflect.get(target, prop, receiver)
			if (typeof originalMethod === 'function') {
				return (...args: any[]) => {
					if (prop === 'initialize') {
						setIsTsLoading(true)
					}
					const result = originalMethod.apply(target, args)
					if (prop === 'getLints') {
						if (result instanceof Promise) {
							return result.then(res => {
								setIsTsLoading(false)
								return res
							})
						} else {
							setIsTsLoading(false)
						}
					}
					return result
				}
			}
			return originalMethod
		}
	})
}
export function initTsWorker(cb: (worker: Worker) => void) {
	let start = performance.now()
	const innerWorker = new Worker(
		new URL('../workers/tsWorker.ts', import.meta.url),
		{
			type: 'module'
		}
	)
	const worker = WorkerStatusProxy(Comlink.wrap<Worker>(innerWorker))

	innerWorker.onmessage = async e => {
		if (e.data === 'ready') {
			await worker.initialize()

			console.log(
				`time for TS worker to load: ${performance.now() - start} milliseconds`
			)
			cb(worker)
		}
	}
}
