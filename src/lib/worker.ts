import { VirtualTypeScriptEnvironment } from '@typescript/vfs'
import { createWorker, WorkerShape } from '@valtown/codemirror-ts/worker'
import * as Comlink from 'comlink'
import { Remote } from 'comlink'
import ts from 'typescript'

export type TypeScriptWorker = Remote<
	ReturnType<typeof createWorker> & VirtualTypeScriptEnvironment
>

export function createLoggingProxy<T extends {}>(target: T): T {
	return new Proxy(target, {
		get(target, prop, receiver) {
			const originalMethod = Reflect.get(target, prop, receiver)
			if (typeof originalMethod === 'function') {
				return (...args: any[]) => {
					console.info(`Calling ${String(prop)} with arguments:`, args)
					const result = originalMethod.apply(target, args)
					if (result instanceof Promise) {
						return result.then(res => {
							console.info(`Result from ${String(prop)}:`, res)
							return res
						})
					} else {
						console.info(`Result from ${String(prop)}:`, result)
						return result
					}
				}
			}
			return originalMethod
		}
	})
}
function WorkerStatusProxy<T extends {}>(
	target: T,
	setIsLoading: (b: boolean) => void
): T {
	return new Proxy(target, {
		get(target, prop, receiver) {
			const originalMethod = Reflect.get(target, prop, receiver)
			if (typeof originalMethod === 'function') {
				return (...args: any[]) => {
					if (prop === 'initialize') {
						setIsLoading(true)
					}
					const result = originalMethod.apply(target, args)
					if (prop === 'getLints') {
						if (result instanceof Promise) {
							return result.then(res => {
								setIsLoading(false)
								return res
							})
						} else {
							setIsLoading(false)
						}
					}
					return result
				}
			}
			return originalMethod
		}
	})
}
export function initTsWorker(
	cb: (worker: TypeScriptWorker) => void,
	setIsLoading: (b: boolean) => void
) {
	let start = performance.now()
	const innerWorker = new Worker(
		new URL('../workers/tsWorker.ts', import.meta.url),
		{
			type: 'module'
		}
	)
	const worker = WorkerStatusProxy(
		Comlink.wrap<TypeScriptWorker>(innerWorker),
		setIsLoading
	)

	innerWorker.onmessage = async e => {
		if (e.data === 'ready') {
			await worker.initialize()
			cb(worker)
			console.info(
				`time for TS worker to load: ${performance.now() - start} milliseconds`
			)
		}
	}
}
