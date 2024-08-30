import { makePersisted } from '@solid-primitives/storage'

import { createEffect, createSignal } from 'solid-js'
import {
	baseColors,
	poimandres,
	xTermPoimandresTheme
} from '../themes/poimandres'
import {
	xTermXcodeDarkTheme,
	xTermXcodeLightTheme,
	xcodeDark,
	xcodeLight
} from '~/themes/xcode'
import {
	whiteDark,
	whiteLight,
	xTermWhiteDarkTheme,
	xTermWhiteLightTheme
} from '~/themes/white'
import {
	githubDark,
	githubLight,
	xTermGithubDarkTheme,
	xTermGithubLightTheme
} from '~/themes/github'
import {
	tokyoNightStorm,
	xTermTokyoNightStormTheme
} from '~/themes/tokyoNightStorm'
import {
	duotoneDark,
	duotoneLight,
	xTermDuotoneDarkTheme,
	xTermDuotoneLightTheme
} from '~/themes/duotone'
import { Terminal } from '@xterm/xterm'
import { tokyoNightDay, xTermTokyoNightDayTheme } from '~/themes/tokyoNightDay'
import { tokyoNight, xTermTokyoNightTheme } from '~/themes/toktoNight'

const themeSettings = {
	xcodeDark: {
		theme: xcodeDark,
		background: '#292A30',
		color: '#DABAFF',
		mode: 'dark',
		xTermTheme: xTermXcodeDarkTheme,
		color1: '\x1b[38;2;255;129;112m',
		color2: '\x1b[38;2;107;223;255m'
	},
	xcodeLight: {
		theme: xcodeLight,
		background: '#fff',
		color: '#522BB2',
		mode: 'light',
		xTermTheme: xTermXcodeLightTheme,
		color1: '\x1b[38;2;210;52;35m',
		color2: '\x1b[38;2;3;47;98m'
	},
	white: {
		theme: whiteLight,
		background: 'white',
		color: 'black',
		mode: 'light',
		xTermTheme: xTermWhiteLightTheme,
		color1: '\x1b[38;2;4;49;250m',
		color2: '\x1b[38;2;107;122;136m'
	},
	black: {
		theme: whiteDark,
		background: 'black',
		color: 'white',
		mode: 'dark',
		xTermTheme: xTermWhiteDarkTheme,
		color1: '\x1b[38;2;187;154;247m',
		color2: '\x1b[38;2;168;168;177m'
	},
	duotoneDark: {
		theme: duotoneDark,
		background: '#2a2734',
		color: '#7a63ee',
		mode: 'dark',
		xTermTheme: xTermDuotoneDarkTheme,
		color1: '\x1b[38;2;250;173;92m',
		color2: '\x1b[38;2;154;134;253m'
	},
	duotoneLight: {
		theme: duotoneLight,
		background: '#faf8f5',
		color: '#896724',
		mode: 'light',
		xTermTheme: xTermDuotoneLightTheme,
		color1: '\x1b[38;2;6;50;137m',
		color2: '\x1b[38;2;22;89;223m'
	},
	githubDark: {
		theme: githubDark,
		background: '#0d1117',
		color: '#ff7b72',
		mode: 'dark',
		xTermTheme: xTermGithubDarkTheme,
		color1: '\x1b[38;2;255;123;114m',
		color2: '\x1b[38;2;121;192;255m'
	},
	githubLight: {
		theme: githubLight,
		background: '#fff',
		color: '#d73a49',
		mode: 'light',
		xTermTheme: xTermGithubLightTheme,
		color1: '\x1b[38;2;215;58;73m',
		color2: '\x1b[38;2;0;92;197m'
	},
	tokyoNight: {
		theme: tokyoNight,
		background: '#1a1b26',
		color: '#787c99',
		mode: 'dark',
		xTermTheme: xTermTokyoNightTheme,
		themeName: 'xTermTokyoNightTheme',
		color1: '\x1b[38;2;255;83;112m',
		color2: '\x1b[38;2;122;162;247m'
	},
	tokyoNightDay: {
		theme: tokyoNightDay,
		background: '#e1e2e7',
		color: '#3760bf',
		mode: 'light',
		xTermTheme: xTermTokyoNightDayTheme,
		color1: '\x1b[38;2;245;42;101m',
		color2: '\x1b[38;2;55;96;191m'
	},
	tokyoNightStorm: {
		theme: tokyoNightStorm,
		background: '#24283b',
		color: '#2ac3de',
		mode: 'dark',
		xTermTheme: xTermTokyoNightStormTheme,
		color1: '\x1b[38;2;255;83;112m',
		color2: '\x1b[38;2;122;162;247m'
	},
	poimandres: {
		theme: poimandres,
		background: baseColors.bg,
		color: baseColors.white,
		mode: 'dark',
		xTermTheme: xTermPoimandresTheme,
		color1: '\x1b[38;2;208;103;157m', // Hot Red - Strings and meta
		color2: '\x1b[38;2;173;215;255m'
	},
	defaultLight: {
		theme: [],
		background: 'white',
		color: 'black',
		mode: 'light',
		xTermTheme: xTermGithubLightTheme,
		color1: '',
		color2: ''
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
const xTermTheme = () =>
	currentThemeSettings().xTermTheme ?? {
		background: currentBackground(),
		foreground: currentColor(),
		cursor: currentColor()
	}
const termColors = () => ({
	color1: currentThemeSettings().color1,
	color2: currentThemeSettings().color2
})

createEffect(() => {
	document.documentElement.style.setProperty('--current-color', currentColor())
	document.documentElement.style.setProperty(
		'--current-background',
		currentBackground()
	)
})

export {
	currentBackground,
	currentColor,
	currentTheme,
	currentThemeName,
	setTheme,
	themeSettings,
	isDark,
	xTermTheme,
	termColors
}

export type { ThemeKey, ThemeSetting }
