import {
	For,
	Match,
	Resource,
	Switch,
	createEffect,
	createSignal,
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
import { compilerOptions, EDITOR_TAB_KEY } from '~/constants/constants'
import { demoNodes, nextApp } from '~/constants/demo/nodes'
import { useEditorFS } from '~/context/FsContext'
import {
	clearTabs,
	createFileSystemStructure
} from '~/modules/fileSystem/fileSystem.service'
import { Formmater, getConfigFromExt } from '~/format'
import { setShowLineNumber, showLineNumber } from '~/stores/editorStore'
import {
	ThemeKey,
	currentBackground,
	currentColor,
	currentThemeName,
	setTheme,
	themeSettings
} from '~/stores/themeStore'
import { capitalizeFirstLetter } from '~/utils/string'

interface HeaderProps {
	code: Resource<string | undefined>
	setCode: (code: string) => void
	refetch: () => void
}

export const CmdK: Component<HeaderProps> = props => {
	const [open, setOpen] = createSignal(false)
	const [currentMenu, setCurrentMenu] = createSignal<'base' | 'theme'>('base')
	createEffect(() => {
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
		<div style={{ 'font-family': 'JetBrains Mono' }}>
			<CommandDialog open={open()} onOpenChange={setOpen}>
				<Command
					style={{ color: currentColor(), background: currentBackground() }}
					class="rounded-lg border shadow-md  h-96"
					onValueChange={e => console.info(e)}
				>
					<CommandInput placeholder="Type a command or search..." />
					{/* <BaseItems {...props} setCurrentMenu={setCurrentMenu} /> */}

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
					</Switch>
				</Command>
			</CommandDialog>
		</div>
	)
}

interface BaseItemsProps extends HeaderProps {
	setCurrentMenu: (menu: 'base' | 'theme') => void
	setOpen: (open: boolean) => void
}

const BaseItems: Component<BaseItemsProps> = ({
	code,
	setCode,
	refetch,
	setCurrentMenu,
	setOpen
}) => {
	const { fs, currentExtension, setCurrentPath, fileMap, setLastKnownFile } =
		useEditorFS()
	return (
		<CommandList>
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

			<CommandGroup heading="Actions">
				<CommandItem
					onSelect={async () => {
						if (code() == undefined) return
						setCode(
							await Formmater.prettier(
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
						clearTabs(fileMap, fs()!, EDITOR_TAB_KEY)
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
		</CommandList>
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
		<CommandList>
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
							// isDefaultSelected={currentThemeName() === theme}
						>
							<span>
								{capitalizeFirstLetter(theme).replace(/([A-Z])/g, ' $1')}
							</span>
						</CommandItem>
					)}
				</For>
			</CommandGroup>
		</CommandList>
	)
}
