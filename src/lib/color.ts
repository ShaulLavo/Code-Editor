export function rgbToHex(r: number, g: number, b: number) {
	return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)
}

export function hexToRgb(hex: string) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
			}
		: null
}

export const getLighterRgbColor = (hex: string, alpha: number): string => {
	const rgb = hexToRgb(hex)

	if (!rgb) return ''
	return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
}
