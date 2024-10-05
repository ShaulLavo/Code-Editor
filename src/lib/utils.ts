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
export function createStoreSignal<T>(value: T): Signal<T> {
	const [store, setStore] = createStore({
		value
	})
	return [
		() => store.value,
		(v: T) => {
			typeof v === 'function' && (v = v(store.value))
			setStore('value', reconcile(v))
		}
	] as Signal<T>
}
export function rgbToHex(r: number, g: number, b: number) {
	return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)
}

export function hexToRgb(hex: string) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
			}
		: null
}
