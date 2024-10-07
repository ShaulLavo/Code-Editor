import { createAutoAnimate } from '@formkit/auto-animate/solid'
import { ValidComponent } from 'solid-js'
import { Dynamic, DynamicProps } from 'solid-js/web'

export function AutoAnimeListContainer(
	props: Partial<DynamicProps<ValidComponent>> & {
		setRef?: (ref: HTMLElement) => void
	}
) {
	const [animationParent] = createAutoAnimate({ duration: 100 })
	return (
		<Dynamic
			{...props}
			component={props.component ?? 'ul'}
			ref={(ref: HTMLElement) => {
				animationParent(ref)
				props.setRef?.(ref)
			}}
		>
			{props.children}
		</Dynamic>
	)
}
