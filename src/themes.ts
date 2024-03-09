import { ayuLight, barf, dracula } from 'thememirror'
import { bg, poimandres } from './poimandres'

export const themeSettings = {
	dracula: { theme: dracula, background: '#2d2f3f', color: '#fff' },
	barf: { theme: barf, background: '#16191e', color: '#a3d295' },
	ayuLight: { theme: ayuLight, background: '#fcfcfc', color: '#5c6166' },
	poimandres: { theme: poimandres, background: bg, color: 'white' }
} as const
export type ThemeKey = keyof typeof themeSettings
export type ThemeSetting = (typeof themeSettings)[ThemeKey]
