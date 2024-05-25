import { makePersisted } from '@solid-primitives/storage';
import { duotoneDark, duotoneLight, xcodeDark, githubDark, githubLight, xcodeLight, tokyoNightStorm } from '@uiw/codemirror-themes-all';
import { createSignal } from 'solid-js';




const themeSettings = {
	xcodeDark: { theme: xcodeDark, background: '#292A30', color: '#DABAFF', name: 'xcodeDark' },
	xcodeLight: { theme: xcodeLight, background: '#fff', color: '#522BB2', name: 'xcodeLight' },
	duotoneDark: { theme: duotoneDark, background: '#2a2734', color: '#7a63ee', name: 'duotoneDark' },
	duotoneLight: { theme: duotoneLight, background: '#faf8f5', color: '#896724', name: 'duotoneLight' },
	githubDark: { theme: githubDark, background: '#0d1117', color: '#ff7b72', name: 'githubDark' },
	githubLight: { theme: githubLight, background: '#fff', color: '#d73a49', name: 'githubLight' },
	tokyoNightStorm: { theme: tokyoNightStorm, background: '#24283b', color: '#2ac3de', name: 'tokyoNightStorm' },
	default: { theme: [], background: 'white', color: 'black', name: 'default' }
} as const;

type ThemeKey = keyof typeof themeSettings;
type ThemeSetting = (typeof themeSettings)[ThemeKey];

const [currentThemeName, setTheme] = makePersisted(createSignal<ThemeKey>('tokyoNightStorm'));



const currentThemeSettings = () => themeSettings[currentThemeName()];

const currentTheme = () => currentThemeSettings().theme;
const currentColor = () => currentThemeSettings().color;
const currentBackground = () => currentThemeSettings().background;
export { currentBackground, currentColor, currentTheme, currentThemeName, setTheme, themeSettings };
export type { ThemeKey, ThemeSetting };
