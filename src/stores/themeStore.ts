import { makePersisted } from '@solid-primitives/storage'

import { createSignal } from 'solid-js'
import { baseColors, poimandres } from '../constants/themes/poimandres'
import { xcodeDark, xcodeLight } from '~/themes/xcode'
import { whiteDark, whiteLight } from '~/themes/white'
import { githubDark, githubLight } from '~/themes/github'
import { tokyoNightStorm } from '~/themes/tokyoNightStorm'
import { duotoneDark, duotoneLight } from '~/themes/duotone'

const themeSettings = {
	xcodeDark: {
		theme: xcodeDark,
		background: '#292A30',
		color: '#DABAFF',
		mode: 'dark'
	},
	xcodeLight: {
		theme: xcodeLight,
		background: '#fff',
		color: '#522BB2',
		mode: 'light'
	},
	white: {
		theme: whiteLight,
		background: 'white',
		color: 'black',
		mode: 'light'
	},
	black: {
		theme: whiteDark,
		background: 'black',
		color: 'white',
		mode: 'dark'
	},
	duotoneDark: {
		theme: duotoneDark,
		background: '#2a2734',
		color: '#7a63ee',
		mode: 'dark'
	},
	duotoneLight: {
		theme: duotoneLight,
		background: '#faf8f5',
		color: '#896724',
		mode: 'light'
	},
	githubDark: {
		theme: githubDark,
		background: '#0d1117',
		color: '#ff7b72',
		mode: 'dark'
	},
	githubLight: {
		theme: githubLight,
		background: '#fff',
		color: '#d73a49',
		mode: 'light'
	},
	tokyoNightStorm: {
		theme: tokyoNightStorm,
		background: '#24283b',
		color: '#2ac3de',
		mode: 'dark'
	},
	defaultLight: {
		theme: [],
		background: 'white',
		color: 'black',
		mode: 'light'
	},
	poimandres: {
		theme: poimandres,
		background: baseColors.bg,
		color: baseColors.white,
		mode: 'dark'
	}
} as const

type ThemeKey = keyof typeof themeSettings
type ThemeSetting = (typeof themeSettings)[ThemeKey]

const [currentThemeName, setTheme] = makePersisted(
	createSignal<ThemeKey>('poimandres'),
	{ name: 'theme' }
)
const currentThemeSettings = () =>
	themeSettings[currentThemeName() ?? 'poimandres']
const currentTheme = () => currentThemeSettings().theme
const currentColor = () => currentThemeSettings().color
const currentBackground = () => currentThemeSettings().background
const isDark = () => currentThemeSettings().mode === 'dark'
export {
	currentBackground,
	currentColor,
	currentTheme,
	currentThemeName,
	setTheme,
	themeSettings,
	isDark
}
export type { ThemeKey, ThemeSetting }
