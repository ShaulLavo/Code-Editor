import { OPFS } from '~/FS/OPFS'
import * as zip from '@zip.js/zip.js'

export async function getNerdFontLinks(
	fileSystem: OPFS
): Promise<{ [fontName: string]: string }> {
	let res: { [fontName: string]: string } = {}
	if (await fileSystem.exists('fonts/' + 'fontLinks.json')) {
		console.log('fontLinks.json exists')
		res = JSON.parse(
			await (await fileSystem.read('fonts/' + 'fontLinks.json')).text()
		)
	} else {
		const response = await fetch('http://localhost:3002/fonts')
		res = await response.json()
		fileSystem.write('fonts/' + 'fontLinks.json', JSON.stringify(res, null, 2))
	}

	return res
}
export async function loadNerdFont(
	fontName: string,
	fileSystem: OPFS,
	cb: (font: FontFace) => void
) {
	const font = await getNerdFont(fontName, fileSystem)
	if (font) {
		document.fonts.add(font)
		await font.load()
		cb(font)
	}
}

type fontType = 'Bold' | 'SemiBold' | 'Regular' | 'Light' | 'Retina'
export async function getNerdFont(fontName: string, fileSystem: OPFS) {
	const fontFaces = Array.from(await document.fonts.ready)
	if (fontFaces.some(font => font.family === fontName)) {
		console.log('Font already loaded')
		return
	}
	let buffer: ArrayBuffer = null!
	if (await fileSystem.exists('fonts/' + fontName)) {
		const file = await fileSystem.read('fonts/' + fontName)
		buffer = await file.arrayBuffer()
	} else {
		const data = await fetch(`http://localhost:3002/fonts/${fontName}`)
		const blob = await data.blob()
		const fontZip = new zip.BlobReader(blob)
		const zipReader = new zip.ZipReader(fontZip)
		const entries = await zipReader.getEntries({
			onprogress: async progress => console.log('progress', progress)
		})

		const regularFontEntry = entries.find(
			entry =>
				entry.filename.endsWith('Font-Regular.ttf') ||
				entry.filename.endsWith('Font-Regular.otf')
		)!
		const regularFont = await regularFontEntry.getData?.(new zip.BlobWriter())!
		buffer = await regularFont.arrayBuffer()
		fileSystem.write('fonts/' + fontName, buffer)
	}

	let font: FontFace = null!
	try {
		font = new FontFace(fontName, buffer)
	} catch (error) {
		console.error('Failed to create FontFace:', error)
	}
	document.fonts.ready.then(() => {
		if (!document.fonts.check(`1em ${fontName}`)) {
			console.error('Font did not load.')
		}
	})

	return font
}
