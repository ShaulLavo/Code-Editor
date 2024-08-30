import { Accessor, Component, For, createSignal } from 'solid-js'
import { currentBackground, currentColor } from './stores/themeStore'
import { createContext } from 'solid-js'

import { HoverCard } from './components/HoverCard'
import {
	currentColumn,
	currentLine,
	currentSelection,
	isGitLoading,
	isTsLoading
} from './stores/editorStore'

import { Spinner, SpinnerType } from 'solid-spinner'
import { GitIcon } from './components/GitIcon'

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
	title: string | Component
	description?: string
	isLoading: boolean
}

interface StatusBarProps {
	isTs: Accessor<boolean>
}
export const StatusBar: Component<StatusBarProps> = ({ isTs }) => {
	const selcetionLength = () =>
		currentSelection().length > 0
			? `(${currentSelection().length} selected)`
			: ''

	const statuses = () =>
		[
			{
				title: `Ln ${currentLine()},Col ${currentColumn()} ${selcetionLength()}`,
				description: 'Go to Line/Column',
				isLoading: false
			},
			{
				title: `${isTs() ? 'TypeScript' : ''}`,
				// description: 'Go to Line/Column',
				isLoading: isTs() && isTsLoading()
			},
			{
				title: 'Git',
				description: 'File Encoding',
				isLoading: isGitLoading()
			},
			{
				title: () => <></>,
				isLoading: false
			}
		] satisfies Status[]

	return (
		// <StatusBarCtx.Provider value={value}>
		<div
			class="absolute  bottom-0 w-full  z-50 flex "
			style={{ 'background-color': currentBackground() }}
		>
			<ul class="flex flex-1 justify-end px-4 text-xs">
				<For each={statuses()}>
					{status => (
						<li class="pr-1" style={{ color: currentColor() }}>
							{status.isLoading ? (
								<Spinner
									type={SpinnerType.tailSpin}
									width={12}
									height={12}
									color={currentColor()}
								/>
							) : status.description ? (
								<HoverCard
									trigger={
										typeof status.title === 'function' ? (
											//@ts-ignore
											<status.title />
										) : (
											<span>{status.title}</span>
										)
									}
									caredContent={status.description}
									hasArrow
									gap={4}
									// Context={StatusBarCtx}
								/>
							) : typeof status.title === 'function' ? (
								<status.title />
							) : (
								<span>{status.title}</span>
							)}
						</li>
					)}
				</For>
			</ul>{' '}
		</div>
		// </StatusBarCtx.Provider>
	)
}
