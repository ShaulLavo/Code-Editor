import { makeEventListener } from '@solid-primitives/event-listener'
import { makePersisted } from '@solid-primitives/storage'
import { createSignal, createMemo, onMount, Accessor } from 'solid-js'
import { baseFontSize } from '~/stores/themeStore'

interface InnerZoomOptions {
	ref: HTMLElement | Accessor<HTMLElement>
	key: string
	aggressiveness?: number
	sync?(fontSize: number): void
	autoSync?: boolean
}

const MIN_PERCENT_CHANGE = -50
const MAX_PERCENT_CHANGE = 350
const DEFAULT_AGGRESSIVENESS = 8

const clmap = (value: number, min: number, max: number) => {
	return Math.min(Math.max(value, min), max)
}

export const createInnerZoom = (options: InnerZoomOptions) => {
	const [percentChange, setPercentChange] = makePersisted(createSignal(0), {
		name: options.key + '-fontChange'
	})

	const aggressiveness = options.aggressiveness ?? DEFAULT_AGGRESSIVENESS

	const resolveRef = () => {
		if (typeof options.ref === 'function') {
			return options.ref()
		}
		return options.ref
	}

	const setPercentChangeClamped = (value: number) =>
		setPercentChange(clmap(value, MIN_PERCENT_CHANGE, MAX_PERCENT_CHANGE))

	const fontSize = createMemo(() => {
		const percent = percentChange()
		return baseFontSize() * (1 + percent / 100)
	})

	const sync = () => {
		if (options.sync) {
			options.sync(fontSize())
		} else if (options.autoSync) {
			resolveRef().style.fontSize = `${fontSize()}px`
		}
	}

	onMount(() => {
		sync()
		makeEventListener(resolveRef(), 'wheel', e => {
			if (e.ctrlKey) {
				e.preventDefault()
				const delta = e.deltaY < 0 ? 1 : -1
				setPercentChangeClamped(percentChange() + delta * aggressiveness)

				sync()
			}
		})
	})

	return {
		fontSize,
		percentChange,
		setPercentChange: setPercentChangeClamped
	}
}
