// import JSZip from 'jszip'

// const nerdFontZipNames = [
// 	'0xProto',
// 	'3270',
// 	'Agave',
// 	'AnonymousPro',
// 	'Arimo',
// 	'AurulentSansMono',
// 	'BigBlueTerminal',
// 	'BitstreamVeraSansMono',
// 	'CascadiaCode',
// 	'CascadiaMono',
// 	'CodeNewRoman',
// 	'ComicShannsMono',
// 	'CommitMono',
// 	'Cousine',
// 	'D2Coding',
// 	'DaddyTimeMono',
// 	'DejaVuSansMono',
// 	'DroidSansMono',
// 	'EnvyCodeR',
// 	'FantasqueSansMono',
// 	'FiraCode',
// 	'FiraMono',
// 	'FontPatcher',
// 	'GeistMono',
// 	'Go-Mono',
// 	'Gohu',
// 	'Hack',
// 	'Hasklig',
// 	'HeavyData',
// 	'Hermit',
// 	'iA-Writer',
// 	'IBMPlexMono',
// 	'Inconsolata',
// 	'InconsolataGo',
// 	'InconsolataLGC',
// 	'IntelOneMono',
// 	'Iosevka',
// 	'IosevkaTerm',
// 	'IosevkaTermSlab',
// 	'JetBrainsMono',
// 	'Lekton',
// 	'LiberationMono',
// 	'Lilex',
// 	'MartianMono',
// 	'Meslo',
// 	'Monaspace',
// 	'Monofur',
// 	'Monoid',
// 	'Mononoki',
// 	'MPlus',
// 	'NerdFontsSymbolsOnly',
// 	'Noto',
// 	'OpenDyslexic',
// 	'Overpass',
// 	'ProFont',
// 	'ProggyClean',
// 	'Recursive',
// 	'RobotoMono',
// 	'ShareTechMono',
// 	'SourceCodePro',
// 	'SpaceMono',
// 	'Terminus',
// 	'Tinos',
// 	'Ubuntu',
// 	'UbuntuMono',
// 	'UbuntuSans',
// 	'VictorMono',
// 	'ZedMono'
// ] as const
// function generateNerdFontUrl(fontName: string): string {
// 	const baseUrl =
// 		'https://github.com/ryanoasis/nerd-fonts/releases/download/v3.2.1/'
// 	return `${baseUrl}${fontName}.zip`
// }

// export async function downloadNerdFont(
// 	fontName: (typeof nerdFontZipNames)[number]
// ) {
// 	const url = generateNerdFontUrl(fontName)
// 	const response = await fetch(url)
// 	const blob = await response.blob()
// 	const zip = new JSZip()
// 	await zip.loadAsync(blob)
// 	const files = zip.file(/\.ttf$/)
// 	const promises = files.map(async file => {
// 		const name = file.name.split('/').pop()!
// 		const buffer = await file.async('nodebuffer')
// 		await fs.writeFile(name, buffer)
// 	})
// 	await Promise.all(promises)
// }
