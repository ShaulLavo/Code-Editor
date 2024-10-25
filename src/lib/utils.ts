import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

import { Signal } from 'solid-js'
import { createStore, reconcile, unwrap } from 'solid-js/store'

export function createDeepSignal<T>(value: T): Signal<T> {
	const [store, setStore] = createStore({
		value
	})
	return [
		() => store.value,
		(v: T) => {
			const unwrapped = unwrap(store.value)
			typeof v === 'function' && (v = v(unwrapped))
			setStore('value', reconcile(v))
			return store.value
		}
	] as Signal<T>
}

export function runOncePerTick<T extends (...args: any[]) => any>(fn: T): T {
	let isRunning = false

	return function (...args: Parameters<T>): ReturnType<T> | undefined {
		if (isRunning) {
			return
		}

		isRunning = true

		try {
			return fn(...args)
		} finally {
			setTimeout(() => {
				isRunning = false
			}, 0) // reset on next event loop cycle
		}
	} as T
}
