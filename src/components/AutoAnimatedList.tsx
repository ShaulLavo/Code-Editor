import { createAutoAnimate } from '@formkit/auto-animate/solid'
import { ValidComponent } from 'solid-js'
import { Dynamic, DynamicProps } from 'solid-js/web'

export function AutoAnimeListContainer(
	props: Partial<DynamicProps<ValidComponent>>
) {
	const [animationParent] = createAutoAnimate({ duration: 100 })
	return (
		<Dynamic
			{...props}
			component={props.component ?? 'ul'}
			ref={animationParent}
		>
			{props.children}
		</Dynamic>
	)
}
