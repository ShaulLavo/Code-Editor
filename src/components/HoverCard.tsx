import { JSX, Show, createEffect, createSignal, on, onMount } from 'solid-js'
import { computePosition, flip, shift, offset, arrow } from '@floating-ui/dom'
import {
	hideTimeout,
	setHideTimeout,
	setShowTimeout,
	setTimeoutDelay,
	showTimeout,
	timeoutDelay
} from '../statusStore'

interface HoverCardProps {
	trigger: JSX.Element
	caredContent: JSX.Element
}
export const HoverCard = ({ trigger, caredContent }: HoverCardProps) => {
	const [isHovered, setHovered] = createSignal(false)

	const [tooltip, setToolTip] = createSignal<HTMLDivElement>(null!)
	let arrowRef: HTMLDivElement = null!
	let button: HTMLDivElement = null!

	createEffect(
		on(tooltip, async tooltip => {
			if (!tooltip) return
			const { x, y, placement, middlewareData } = await computePosition(
				button,
				tooltip,
				{
					placement: 'top',
					middleware: [
						offset(6),
						flip(),
						shift({ padding: 5 }),
						arrow({ element: arrowRef })
					]
				}
			)

			Object.assign(tooltip.style, {
				left: `${x}px`,
				top: `${y}px`
			})

			//@ts-ignore
			const { x: arrowX, y: arrowY } = middlewareData.arrow
			const staticSide = {
				top: 'bottom',
				right: 'left',
				bottom: 'top',
				left: 'right'
			}[placement.split('-')[0]]

			Object.assign(arrowRef.style, {
				left: arrowX != null ? `${arrowX}px` : '',
				top: arrowY != null ? `${arrowY}px` : '',
				right: '',
				bottom: '',
				//@ts-ignore
				[staticSide]: '-4px'
			})
		})
	)
	const showTooltip = () => {
		clearTimeout(hideTimeout())
		const showTimeout = setTimeout(() => {
			setHovered(true)
			setTimeoutDelay(0)
		}, timeoutDelay())
		setShowTimeout(showTimeout)
	}

	const hideTooltip = () => {
		clearTimeout(showTimeout())
		const hideTimeout = setTimeout(() => {
			setHovered(false)
			setTimeoutDelay(300)
		}, 500)
		setHideTimeout(hideTimeout)
	}
	return (
		<>
			<div
				onMouseOver={showTooltip}
				onMouseLeave={hideTooltip}
				onFocus={showTooltip}
				onBlur={hideTooltip}
				ref={button}
			>
				{trigger}
			</div>
			<Show when={isHovered()}>
				<div
					onMouseOver={showTooltip}
					onMouseLeave={hideTooltip}
					onFocus={showTooltip}
					onBlur={hideTooltip}
					ref={setToolTip}
					class='class="w-max absolute top-0 left-0 bg-gray-800 text-white font-bold p-1.5 rounded-md text-sm z-50'
				>
					<div
						ref={arrowRef}
						class="absolute bg-gray-800 w-2 h-2 transform rotate-45"
					/>

					{caredContent}
				</div>
			</Show>
		</>
	)
}
