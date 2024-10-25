export function autoHide(el: HTMLElement) {
	el.classList.add('transition-display')
	let isVisible = false
	let rect = el.getBoundingClientRect()
	const showOnHover = (event: MouseEvent) => {
		const newRect = el.getBoundingClientRect()
		if (newRect.width) rect = newRect

		const isMouseOverElement =
			event.clientX >= rect.left &&
			event.clientX <= rect.right &&
			event.clientY >= rect.top &&
			event.clientY <= rect.bottom

		if (isMouseOverElement && !isVisible) {
			el.style.display = 'block'
			el.style.opacity = '1'
			isVisible = true
		} else if (!isMouseOverElement && isVisible) {
			el.style.display = 'none'
			el.style.opacity = '0'
			isVisible = false
		}
	}
	window.addEventListener('mousemove', showOnHover)
	return () => window.removeEventListener('mousemove', showOnHover)
}
export const setCSSVariable = (varName: string, color: string) => {
	if (!varName.startsWith('--')) {
		varName = `--${varName}`
	}

	document.documentElement.style.setProperty(varName, color)
}
