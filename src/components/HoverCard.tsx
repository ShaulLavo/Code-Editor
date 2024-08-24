import {
	Context,
	JSX,
	Show,
	createEffect,
	createSignal,
	on,
	onMount,
	useContext
} from 'solid-js'
import { computePosition, flip, shift, offset, arrow } from '@floating-ui/dom'
// import { HoverCardContext, StatusBarCtx } from '../StatusBar'

useContext

interface HoverCardProps {
	trigger: JSX.Element
	caredContent: JSX.Element
	hasArrow?: boolean
	gap?: number
	// Context?: Context<HoverCardContext>
}
export const HoverCard = ({
	trigger,
	caredContent,
	hasArrow,
	gap
}: HoverCardProps) => {
	// const {
	// 	timeoutDelay,
	// 	setTimeoutDelay,
	// 	hideTimeout,
	// 	setHideTimeout,
	// 	showTimeout,
	// 	setShowTimeout
	// } = useContext<HoverCardContext>(Context)
	const [isHovered, setHovered] = createSignal(false)

	const [timeoutDelay, setTimeoutDelay] = createSignal(300)
	const [hideTimeout, setHideTimeout] = createSignal<NodeJS.Timeout>()
	const [showTimeout, setShowTimeout] = createSignal<NodeJS.Timeout>()

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
						offset(gap),
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

			if (!hasArrow) return
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
					class='class="w-max absolute top-0 left-0 bg-gray-800 text-white font-bold p-1.5 rounded-md  z-50 text-xs'
				>
					{hasArrow && (
						<div
							ref={arrowRef}
							class="absolute bg-gray-800 w-2 h-2 transform rotate-45"
						/>
					)}

					{caredContent}
				</div>
			</Show>
		</>
	)
}
