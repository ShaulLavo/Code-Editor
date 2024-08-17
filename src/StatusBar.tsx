import {
	For,
	createEffect,
	createSignal,
	createUniqueId,
	on,
	onCleanup
} from 'solid-js'
import { currentBackground, currentColor } from './themeStore'

import { createStore, produce } from 'solid-js/store'
import { HoverCard } from './components/HoverCard'
import { code } from './editorStore'
import { createStatus, statuses } from './statusStore'

export const DefaultDescription = (props: { description: string }) => {
	return <div>{props.description}</div>
}

export const StatusBar = () => {
	const status = createStatus({
		title: code().slice(0, 10),
		status: 'COMPLETED'
	})
	createEffect(
		on(code, code => {
			status.update({
				title: code.slice(0, 10),
				status: 'COMPLETED'
			})
		})
	)
	return (
		<div
			// onMouseOver={() => console.log('over')}
			class="absolute  bottom-0 w-full  z-50"
			style={{ 'background-color': currentBackground() }}
		>
			<ul class="flex flex-1 justify-start">
				<For each={statuses}>
					{event => (
						<li class="pr-1" style={{ color: currentColor() }}>
							<HoverCard
								trigger={<span>{event.title}</span>}
								caredContent={event.description}
							/>
						</li>
					)}
				</For>
			</ul>{' '}
		</div>
	)
}
