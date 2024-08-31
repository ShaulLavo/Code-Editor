import { useColorMode } from '@kobalte/core'
import { IconSun, IconMoon } from '~/assets/icons'
import { Button } from '~/components/ui/button'

export function ModeToggle() {
	const { colorMode, setColorMode } = useColorMode()

	const toggleColorMode = () => {
		setColorMode(colorMode() === 'light' ? 'dark' : 'light')
	}

	return (
		<Button
			onClick={toggleColorMode}
			variant="ghost"
			size="sm"
			class="w-9 px-0"
		>
			{colorMode() === 'light' ? (
				<IconSun class="size-6 transition-all" />
			) : (
				<IconMoon class="size-6 transition-all" />
			)}
			<span class="sr-only">Toggle theme</span>
		</Button>
	)
}
