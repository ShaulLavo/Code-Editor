export const viewTransition = (fn: () => void) => {
	if (!document.startViewTransition) return fn()
	const transition = document.startViewTransition(fn)
}
