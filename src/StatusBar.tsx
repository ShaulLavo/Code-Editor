import { For } from 'solid-js'
import { currentBackground, currentColor } from './themeStore'

import { HoverCard } from './components/HoverCard'
import { statuses } from './statusStore'

export const DefaultDescription = (props: { description: string }) => {
	return <div>{props.description}</div>
}

export const StatusBar = () => {
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
