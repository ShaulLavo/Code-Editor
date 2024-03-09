import { createSignal } from 'solid-js'
import { ayuLight, barf, dracula } from 'thememirror'
import { bg, poimandres } from './poimandres'

const [defTheme] = createSignal(undefined)

export const themeSettings = {
	poimandres: { theme: poimandres, background: bg, color: 'white', name: 'poimandres' },
	dracula: { theme: dracula, background: '#2d2f3f', color: '#fff', name: 'dracula' },
	barf: { theme: barf, background: '#16191e', color: '#a3d295', name: 'barf' },
	ayuLight: { theme: ayuLight, background: '#fcfcfc', color: '#5c6166', name: 'ayuLight' },
	default: { theme: [], background: 'white', color: 'black', name: 'default' }
} as const

export type ThemeKey = keyof typeof themeSettings
export type ThemeSetting = (typeof themeSettings)[ThemeKey]

const [currentThemeSettings, setCurrentThemeSettings] = createSignal<ThemeSetting>(
	themeSettings.poimandres
)

function setTheme(theme: ThemeKey) {
	setCurrentThemeSettings(themeSettings[theme])
}

const currentTheme = () => currentThemeSettings().theme
const currentBackground = () => currentThemeSettings().background
const currentColor = () => currentThemeSettings().color
const currentThemeName = () => currentThemeSettings().name
export { currentBackground, currentColor, currentTheme, currentThemeName, setTheme }
