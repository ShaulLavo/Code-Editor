import { For, Resource, batch, useContext, type Component } from 'solid-js'
import ts from 'typescript'
import { compilerOptions } from '~/constants/constants'
import { demoNodes, nextApp } from '../constants/demo/nodes'
import {
	createFileSystemStructure,
	deleteAll
} from '../fileSystem/fileSystem.service'
import { Formmater, getConfigFromExt } from '../format'
import { setShowLineNumber, showLineNumber } from '../stores/editorStore'
import {
	ThemeKey,
	currentBackground,
	currentColor,
	currentThemeName,
	setTheme,
	themeSettings
} from '../stores/themeStore'
import { capitalizeFirstLetter } from '../utils/string'
import { useEditorFS } from '~/context/FsContext'

interface HeaderProps {
	code: Resource<string | undefined>
	setCode: (code: string) => void
	setHeaderRef: (el: HTMLDivElement) => void
	refetch: () => void
}

export const Header: Component<HeaderProps> = ({
	code,
	setCode,
	refetch,
	setHeaderRef
}) => {
	let hasTitle = false
	const { fs, currentExtension, setCurrentPath, clearTabs, fileMap } =
		useEditorFS()

	return (
		<div
			class="bg-background-dark h-max absolute top-0 w-full p-2 z-50"
			ref={setHeaderRef}
			style={{
				'background-color': currentBackground(),
				color: currentColor()
			}}
		>
			<select
				style={{
					'background-color': currentBackground(),
					color: currentColor()
				}}
				onChange={e => {
					setTheme(e.currentTarget.value as ThemeKey)
				}}
			>
				<For each={Object.keys(themeSettings)}>
					{theme => (
						<option selected={theme === currentThemeName()} value={theme}>
							{capitalizeFirstLetter(theme)}
						</option>
					)}
				</For>
			</select>{' '}
			|{' '}
			<button
				style={{
					color: currentColor()
				}}
				onMouseDown={async () =>
					code() !== undefined &&
					setCode(
						await Formmater.prettier(
							code()!,
							getConfigFromExt(currentExtension()!)
						)
					)
				}
			>
				prettier
			</button>{' '}
			|{' '}
			<button
				style={{
					color: currentColor()
				}}
				onMouseDown={() => setShowLineNumber(!showLineNumber())}
			>
				Toggle Line Number
			</button>{' '}
			|{' '}
			<button
				style={{
					color: currentColor()
				}}
				onMouseDown={() => {
					hasTitle = !hasTitle
				}}
			>
				Toggle status
			</button>{' '}
			|
			<button
				style={{
					color: currentColor()
				}}
				onMouseDown={() => {
					if (code() == undefined) return
					batch(() => {
						setCode(ts.transpileModule(code()!, { compilerOptions }).outputText)
					})
				}}
			>
				Transpile
			</button>{' '}
			|
			<button
				onMouseDown={async () => {
					await deleteAll('root', fs)
					await clearTabs(fileMap)
					setCurrentPath('')
					refetch()
				}}
			>
				delete all
			</button>{' '}
			|
			<button
				onMouseDown={async () => {
					await createFileSystemStructure(nextApp, fs)
					refetch()
				}}
			>
				create new fs nextApp
			</button>{' '}
			|
			<button
				onMouseDown={async () => {
					await createFileSystemStructure(demoNodes, fs)
					refetch()
				}}
			>
				create new fs demoNodes
			</button>
		</div>
	)
}
