import { Accessor, For, createSignal } from 'solid-js'
import { currentBackground, currentColor } from './themeStore'
import { createContext } from 'solid-js'

import { HoverCard } from './components/HoverCard'
import { currentColumn, currentLine, currentSelection } from './editorStore'

export const DefaultDescription = (props: { description: string }) => {
	return <div>{props.description}</div>
}

// export interface HoverCardContext {
// 	timeoutDelay: () => number
// 	setTimeoutDelay: (delay: number) => void
// 	hideTimeout: Accessor<NodeJS.Timeout | undefined>
// 	setHideTimeout: (timeout: NodeJS.Timeout) => void
// 	showTimeout: Accessor<NodeJS.Timeout | undefined>
// 	setShowTimeout: (timeout: NodeJS.Timeout) => void
// }

// const [timeoutDelay, setTimeoutDelay] = createSignal(300)
// const [hideTimeout, setHideTimeout] = createSignal<NodeJS.Timeout>()
// const [showTimeout, setShowTimeout] = createSignal<NodeJS.Timeout>()

// const value = {
// 	timeoutDelay,
// 	setTimeoutDelay,
// 	hideTimeout,
// 	setHideTimeout,
// 	showTimeout,
// 	setShowTimeout
// }
// export const StatusBarCtx = createContext<HoverCardContext>(value)

interface Status {
	title: string
	description?: string
	status: 'PENDING' | 'COMPLETED' | 'CANCELED'
}

export const StatusBar = () => {
	const selcetionLength = () =>
		currentSelection().length > 0
			? `(${currentSelection().length} selected)`
			: ''
	const statuses = () =>
		[
			{
				title: `Ln ${currentLine()},Col ${currentColumn()} ${selcetionLength()}`,
				description: 'Go to Line/Column',
				status: 'COMPLETED'
			}
		] satisfies Status[]

	return (
		// <StatusBarCtx.Provider value={value}>
		<div
			// onMouseOver={() => console.log('over')}
			class="absolute  bottom-0 w-full  z-50 flex "
			style={{ 'background-color': currentBackground() }}
		>
			<ul class="flex flex-1 justify-end px-4 text-xs">
				<For each={statuses()}>
					{event => (
						<li class="pr-1" style={{ color: currentColor() }}>
							<HoverCard
								trigger={<span>{event.title}</span>}
								caredContent={event.description}
								hasArrow
								gap={4}
								// Context={StatusBarCtx}
							/>
						</li>
					)}
				</For>
			</ul>{' '}
		</div>
		// </StatusBarCtx.Provider>
	)
}
