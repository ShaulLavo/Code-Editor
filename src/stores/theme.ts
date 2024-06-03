import { makePersisted } from '@solid-primitives/storage';
import { duotoneDark, duotoneLight, xcodeDark, githubDark, githubLight, xcodeLight, tokyoNightStorm } from '@uiw/codemirror-themes-all';
import { createSignal } from 'solid-js';




const themeSettings = {
	xcodeDark: { theme: xcodeDark, background: '#292A30', color: '#DABAFF' },
	xcodeLight: { theme: xcodeLight, background: '#fff', color: '#522BB2' },
	duotoneDark: { theme: duotoneDark, background: '#2a2734', color: '#7a63ee' },
	duotoneLight: { theme: duotoneLight, background: '#faf8f5', color: '#896724' },
	githubDark: { theme: githubDark, background: '#0d1117', color: '#ff7b72' },
	githubLight: { theme: githubLight, background: '#fff', color: '#d73a49' },
	tokyoNightStorm: { theme: tokyoNightStorm, background: '#24283b', color: '#2ac3de' },
	defaultLight: { theme: [], background: 'white', color: 'black' }
} as const;

type ThemeKey = keyof typeof themeSettings;
type ThemeSetting = (typeof themeSettings)[ThemeKey];

const [currentThemeName, setTheme] = makePersisted(createSignal<ThemeKey>('duotoneDark'));



const currentThemeSettings = () => themeSettings[currentThemeName()];
const currentTheme = () => currentThemeSettings().theme;
const currentColor = () => currentThemeSettings().color;
const currentBackground = () => currentThemeSettings().background;
export { currentBackground, currentColor, currentTheme, currentThemeName, setTheme, themeSettings };
export type { ThemeKey, ThemeSetting };
