import { makePersisted } from '@solid-primitives/storage'

import { Extension } from '@codemirror/state'
import { createSignal } from 'solid-js'
import {
	duotoneDark,
	duotoneDarkBracketColors,
	duotoneLight,
	duotoneLightBracketColors,
	xTermDuotoneDarkTheme,
	xTermDuotoneLightTheme
} from '~/themes/duotone'
import {
	githubDark,
	githubDarkBracketColors,
	githubLight,
	githubLightBracketColors,
	xTermGithubDarkTheme,
	xTermGithubLightTheme
} from '~/themes/github'
import {
	dark,
	darkBracketColors,
	darkColors,
	light,
	lightBracketColors,
	lightColors,
	xTermDarkTheme,
	xTermlightTheme
} from '~/themes/light'
import {
	tokyoNight,
	tokyoNightBracketColors,
	xTermTokyoNightTheme
} from '~/themes/toktoNight'
import {
	tokyoNightDay,
	tokyoNightDayBracketColors,
	xTermTokyoNightDayTheme
} from '~/themes/tokyoNightDay'
import {
	tokyoNightStorm,
	tokyoNightStormBracketColors,
	xTermTokyoNightStormTheme
} from '~/themes/tokyoNightStorm'
import {
	whiteDark,
	whiteDarkBracketColors,
	whiteLight,
	whiteLightBracketColors,
	xTermWhiteDarkTheme,
	xTermWhiteLightTheme
} from '~/themes/white'
import {
	xCodeDarkBracketColors,
	xCodeLightBracketColors,
	xTermXcodeDarkTheme,
	xTermXcodeLightTheme,
	xcodeDark,
	xcodeLight
} from '~/themes/xcode'
import {
	baseColors,
	poimandres,
	poimandresBracketColors,
	xTermPoimandresTheme
} from '../themes/poimandres'
import { mojo, mojoBracketColors, xTermMojoTheme } from '~/themes/mojo'

type ThemeSettingType = {
	theme: Extension
	background: string
	color: string
	mode: 'light' | 'dark'
	xTermTheme: any
	color1: string
	color2: string
	rainbowBracket: Record<BracketColors, `#${string}`>
}
type BracketColors =
	| 'red'
	| 'orange'
	| 'yellow'
	| 'green'
	| 'blue'
	| 'indigo'
	| 'violet'

const themeSettings = {
	xcodeDark: {
		theme: xcodeDark,
		background: '#292A30',
		color: '#DABAFF',
		mode: 'dark',
		xTermTheme: xTermXcodeDarkTheme,
		color1: '\x1b[38;2;255;129;112m',
		color2: '\x1b[38;2;107;223;255m',
		rainbowBracket: xCodeDarkBracketColors
	},
	xcodeLight: {
		theme: xcodeLight,
		background: '#fff',
		color: '#522BB2',
		mode: 'light',
		xTermTheme: xTermXcodeLightTheme,
		color1: '\x1b[38;2;210;52;35m',
		color2: '\x1b[38;2;3;47;98m',
		rainbowBracket: xCodeLightBracketColors
	},
	white: {
		theme: whiteLight,
		background: 'white',
		color: 'black',
		mode: 'light',
		xTermTheme: xTermWhiteLightTheme,
		color1: '\x1b[38;2;4;49;250m',
		color2: '\x1b[38;2;107;122;136m',
		rainbowBracket: whiteLightBracketColors
	},
	black: {
		theme: whiteDark,
		background: 'black',
		color: 'white',
		mode: 'dark',
		xTermTheme: xTermWhiteDarkTheme,
		color1: '\x1b[38;2;187;154;247m',
		color2: '\x1b[38;2;168;168;177m',
		rainbowBracket: whiteDarkBracketColors
	},
	duotoneDark: {
		theme: duotoneDark,
		background: '#2a2734',
		color: '#7a63ee',
		mode: 'dark',
		xTermTheme: xTermDuotoneDarkTheme,
		color1: '\x1b[38;2;250;173;92m',
		color2: '\x1b[38;2;154;134;253m',
		rainbowBracket: duotoneDarkBracketColors
	},
	duotoneLight: {
		theme: duotoneLight,
		background: '#faf8f5',
		color: '#896724',
		mode: 'light',
		xTermTheme: xTermDuotoneLightTheme,
		color1: '\x1b[38;2;6;50;137m',
		color2: '\x1b[38;2;22;89;223m',
		rainbowBracket: duotoneLightBracketColors
	},
	githubDark: {
		theme: githubDark,
		background: '#0d1117',
		color: '#ff7b72',
		mode: 'dark',
		xTermTheme: xTermGithubDarkTheme,
		color1: '\x1b[38;2;255;123;114m',
		color2: '\x1b[38;2;121;192;255m',
		rainbowBracket: githubDarkBracketColors
	},
	githubLight: {
		theme: githubLight,
		background: '#fff',
		color: '#d73a49',
		mode: 'light',
		xTermTheme: xTermGithubLightTheme,
		color1: '\x1b[38;2;215;58;73m',
		color2: '\x1b[38;2;0;92;197m',
		rainbowBracket: githubLightBracketColors
	},
	tokyoNight: {
		theme: tokyoNight,
		background: '#1a1b26',
		color: '#787c99',
		mode: 'dark',
		xTermTheme: xTermTokyoNightTheme,
		color1: '\x1b[38;2;255;83;112m',
		color2: '\x1b[38;2;122;162;247m',
		rainbowBracket: tokyoNightBracketColors
	},
	tokyoNightDay: {
		theme: tokyoNightDay,
		background: '#e1e2e7',
		color: '#3760bf',
		mode: 'light',
		xTermTheme: xTermTokyoNightDayTheme,
		color1: '\x1b[38;2;245;42;101m',
		color2: '\x1b[38;2;55;96;191m',
		rainbowBracket: tokyoNightDayBracketColors
	},
	tokyoNightStorm: {
		theme: tokyoNightStorm,
		background: '#24283b',
		color: '#2ac3de',
		mode: 'dark',
		xTermTheme: xTermTokyoNightStormTheme,
		color1: '\x1b[38;2;255;83;112m',
		color2: '\x1b[38;2;122;162;247m',
		rainbowBracket: tokyoNightStormBracketColors
	},
	poimandres: {
		theme: poimandres,
		background: baseColors.bg,
		color: baseColors.white,
		mode: 'dark',
		xTermTheme: xTermPoimandresTheme,
		color1: '\x1b[38;2;208;103;157m',
		color2: '\x1b[38;2;173;215;255m',
		rainbowBracket: poimandresBracketColors
	},
	light: {
		theme: light,
		background: lightColors.background,
		color: lightColors.foreground,
		mode: 'light',
		xTermTheme: xTermlightTheme,
		color1: '\x1b[38;2;208;103;157m',
		color2: '\x1b[38;2;173;215;253m',
		rainbowBracket: lightBracketColors
	},
	dark: {
		theme: dark,
		background: darkColors.background,
		color: darkColors.text,
		mode: 'dark',
		xTermTheme: xTermDarkTheme,
		color1: '\x1b[38;2;208;103;157m',
		color2: '\x1b[38;2;173;215;253m',
		rainbowBracket: darkBracketColors
	},

	defaultLight: {
		theme: [],
		background: 'white',
		color: 'black',
		mode: 'light',
		xTermTheme: xTermGithubLightTheme,
		color1: '',
		color2: '',
		rainbowBracket: {
			red: '#FF0000',
			orange: '#FFA500',
			yellow: '#FFFF00',
			green: '#008000',
			blue: '#0000FF',
			indigo: '#00BFFF',
			violet: '#FF00FF'
		}
	},
	mojo: {
		theme: mojo,
		background: '#1E1E1E',
		color: '#A6A6A6',
		mode: 'dark',
		xTermTheme: xTermMojoTheme,
		color1: '\x1b[38;2;200;100;100m',
		color2: '\x1b[38;2;65;166;217m',
		rainbowBracket: mojoBracketColors
	}
} as const satisfies Record<string, ThemeSettingType>

type ThemeKey = keyof typeof themeSettings
type ThemeSetting = (typeof themeSettings)[ThemeKey]

const [baseFontSize, setBaseFontSize] = makePersisted(createSignal(16), {
	name: 'baseFontSize'
})

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
const bracketColors = () => currentThemeSettings().rainbowBracket
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

export {
	baseFontSize,
	bracketColors,
	currentBackground,
	currentColor,
	currentTheme,
	currentThemeName,
	isDark,
	setBaseFontSize,
	setTheme,
	termColors,
	themeSettings,
	xTermTheme
}

export type { ThemeKey, ThemeSetting }
