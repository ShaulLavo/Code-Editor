import {
	For,
	Match,
	Resource,
	Switch,
	createEffect,
	createSignal,
	on,
	onCleanup,
	onMount,
	useContext,
	type Component
} from 'solid-js'
import ts from 'typescript'
import {
	IconCalendar,
	IconMail,
	IconRocket,
	IconSettings,
	IconSmile,
	IconUser
} from '~/assets/icons'
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut
} from '~/components/ui/command'
import { compilerOptions } from '~/constants/constants'
import { demoNodes, nextApp } from '~/constants/demo/nodes'
import {
	clearTabs,
	createFileSystemStructure
} from '~/modules/fileSystem/fileSystem.service'
import { Formatter, getConfigFromExt } from '~/format'
import { setShowLineNumber, showLineNumber } from '~/stores/editorStore'
import {
	ThemeKey,
	currentBackground,
	currentColor,
	currentThemeName,
	setTheme,
	themeSettings
} from '~/stores/themeStore'
import { capitalizeFirstLetter } from '~/lib/string'
import { currentEditorFs } from '~/stores/appStateStore'
import {
	availableFonts,
	fontFamily,
	fontFamilyWithFallback,
	fontSelection,
	setAvailableFonts,
	setFontFamily,
	setFontSelection
} from '~/stores/fontStore'
import { doc } from 'prettier'
import { loadNerdFont } from '~/lib/fonts'

interface HeaderProps {
	code: Resource<string | undefined>
	setCode: (code: string) => void
	refetch: () => void
}

export const CmdK: Component<HeaderProps> = props => {
	const [open, setOpen] = createSignal(false)
	const [currentMenu, setCurrentMenu] = createSignal<'base' | 'theme' | 'font'>(
		'base'
	)
	const [value, setValue] = createSignal('')

	// super hacky way to set the default value
	const defaultValue = () => {
		if (currentMenu() === 'base') {
			return 'Change Theme'
		}
		if (currentMenu() === 'theme') {
			return currentThemeName()
		}
		if (currentMenu() === 'font') {
			return fontFamily()
		}
		return ''
	}
	let hasRun = false
	createEffect(
		on(currentMenu, () => {
			hasRun = false
		})
	)
	createEffect(
		on(value, () => {
			if (!hasRun) {
				setValue(defaultValue())
				hasRun = true
			}
		})
	)

	onMount(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				setOpen(open => !open)
			}
		}

		document.addEventListener('keydown', down)

		onCleanup(() => {
			document.removeEventListener('keydown', down)
		})
	})

	createEffect(() => {
		if (!open()) {
			setTimeout(() => {
				setCurrentMenu('base')
			}, 150)
		}
	})
	return (
		<div style={{ 'font-family': fontFamilyWithFallback() }}>
			<CommandDialog open={open()} onOpenChange={setOpen}>
				<Command
					style={{ color: currentColor(), background: currentBackground() }}
					class="rounded-lg border shadow-md  h-96"
					onValueChange={setValue}
					value={value()}
					loop
				>
					<CommandInput
						onInput={e => {
							console.log('input', e.target.value)
						}}
						placeholder="Type a command or search..."
					/>
					{/* <BaseItems {...props} setCurrentMenu={setCurrentMenu} /> */}
					<CommandList>
						<Switch>
							<Match when={currentMenu() === 'base'}>
								<BaseItems
									{...props}
									setCurrentMenu={setCurrentMenu}
									setOpen={setOpen}
								/>
							</Match>
							<Match when={currentMenu() === 'theme'}>
								<ThemeItems setOpen={setOpen} />
							</Match>
							<Match when={currentMenu() === 'font'}>
								<Fonts setOpen={setOpen} />
							</Match>
						</Switch>
					</CommandList>
				</Command>
			</CommandDialog>
		</div>
	)
}

interface BaseItemsProps extends HeaderProps {
	setCurrentMenu: (menu: 'base' | 'theme' | 'font') => void
	setOpen: (open: boolean) => void
}

const BaseItems: Component<BaseItemsProps> = ({
	code,
	setCode,
	refetch,
	setCurrentMenu,
	setOpen
}) => {
	const {
		fs,
		currentExtension,
		setCurrentPath,
		fileMap,
		setLastKnownFile,
		refetchNodes
	} = currentEditorFs()
	return (
		<>
			<CommandEmpty>No results found.</CommandEmpty>

			<CommandGroup heading="Theme">
				<CommandItem
					onSelect={e => {
						setCurrentMenu('theme')
					}}
				>
					<span>Change Theme</span>
				</CommandItem>
			</CommandGroup>
			<CommandGroup heading="Font">
				<CommandItem
					onSelect={e => {
						setCurrentMenu('font')
					}}
				>
					<span>Change font</span>
				</CommandItem>
			</CommandGroup>

			<CommandGroup heading="Actions">
				<CommandItem
					onSelect={async () => {
						if (code() == undefined) return
						setCode(
							await Formatter.prettier(
								code()!,
								getConfigFromExt(currentExtension()!)
							)
						)
						setOpen(false)
					}}
				>
					<span>Prettier</span>
				</CommandItem>

				<CommandItem onSelect={() => setShowLineNumber(!showLineNumber())}>
					<span>Toggle Line Number</span>
				</CommandItem>

				<CommandItem
					onSelect={() => {
						if (code() == undefined) return
						setCode(ts.transpileModule(code()!, { compilerOptions }).outputText)
						setOpen(false)
					}}
				>
					<span>Transpile</span>
				</CommandItem>

				<CommandItem
					onSelect={async () => {
						await fs()?.deleteAll()
						setLastKnownFile('')
						clearTabs(fileMap, fs()!, 'editor-' + currentEditorFs() + '-tab')
						setCurrentPath('')
						refetch()
						setOpen(false)
					}}
				>
					<span>Delete All</span>
				</CommandItem>

				<CommandItem
					onSelect={async () => {
						await createFileSystemStructure(nextApp, fs()!)
						refetch()
						setOpen(false)
					}}
				>
					<span>Create New FS nextApp</span>
				</CommandItem>

				<CommandItem
					onSelect={async () => {
						await createFileSystemStructure(demoNodes, fs()!)
						refetch()
						setOpen(false)
					}}
				>
					<span>Create New FS demoNodes</span>
				</CommandItem>
			</CommandGroup>
		</>
	)
}

interface FontsProps {
	setOpen: (open: boolean) => void
}

const Fonts: Component<FontsProps> = props => {
	const { fs, refetchNodes } = currentEditorFs()
	return (
		<>
			<CommandGroup heading="Available">
				<For each={Object.keys(availableFonts())}>
					{font => (
						<CommandItem
							onHover={name => {
								setFontFamily(name)
							}}
							// onSelect={() => {
							// 	setTheme(theme as ThemeKey)
							// 	props.setOpen(false)
							// }}
							value={font}
							onSelect={name => {
								setFontFamily(name)
								props.setOpen(false)
							}}
							// data-selected={currentThemeName() === theme}
							// isSelected={currentThemeName() === theme}
							// isDefaultSelected={currentThemeName() === theme}
						>
							<span>
								{capitalizeFirstLetter(font)
									.replace(/([A-Z])/g, ' $1')
									.trim()}
							</span>
						</CommandItem>
					)}
				</For>
			</CommandGroup>
			<CommandGroup heading="Download">
				<For each={Object.keys(fontSelection())}>
					{font => (
						<CommandItem
							// onHover={() => {
							// 	setTheme(theme as ThemeKey)
							// }}
							onSelect={async name => {
								await loadNerdFont(name, fs()!, font => {
									setAvailableFonts(current => ({
										...current,
										[name]: font
									}))
									setFontSelection(current => {
										delete current[name]
										return { ...current }
									})
									setFontFamily(name)
									refetchNodes()
								})
								props.setOpen(false)
							}}
							value={font}
							// isSelected={currentThemeName() === theme}
							// isDefaultSelected={currentThemeName() === theme}
						>
							<span>
								{capitalizeFirstLetter(font).replace(/([A-Z])/g, ' $1')}
							</span>
						</CommandItem>
					)}
				</For>
			</CommandGroup>
		</>
	)
}

interface ThemeItemsProps {
	setOpen: (open: boolean) => void
}

const ThemeItems: Component<ThemeItemsProps> = props => {
	const darkModeThemes = Object.fromEntries(
		Object.entries(themeSettings).filter(
			([key, value]) => value.mode === 'dark'
		)
	)

	const lightModeThemes = Object.fromEntries(
		Object.entries(themeSettings).filter(
			([key, value]) => value.mode === 'light'
		)
	)
	return (
		<>
			<CommandGroup heading="Dark mode">
				<For each={Object.keys(darkModeThemes)}>
					{theme => (
						<CommandItem
							onHover={() => {
								setTheme(theme as ThemeKey)
							}}
							onSelect={() => {
								setTheme(theme as ThemeKey)
								props.setOpen(false)
							}}
							value={theme}
							// data-selected={currentThemeName() === theme}
							// isSelected={currentThemeName() === theme}
							// isDefaultSelected={currentThemeName() === theme}
						>
							<span>
								{capitalizeFirstLetter(theme)
									.replace(/([A-Z])/g, ' $1')
									.trim()}
							</span>
						</CommandItem>
					)}
				</For>
			</CommandGroup>
			<CommandGroup heading="Light mode">
				<For each={Object.keys(lightModeThemes)}>
					{theme => (
						<CommandItem
							onHover={() => {
								setTheme(theme as ThemeKey)
							}}
							onSelect={() => {
								setTheme(theme as ThemeKey)
								props.setOpen(false)
							}}
							value={theme}
							isSelected={currentThemeName() === theme}

							// isDefaultSelected={currentThemeName() === theme}
						>
							<span>
								{capitalizeFirstLetter(theme).replace(/([A-Z])/g, ' $1')}
							</span>
						</CommandItem>
					)}
				</For>
			</CommandGroup>
		</>
	)
}
