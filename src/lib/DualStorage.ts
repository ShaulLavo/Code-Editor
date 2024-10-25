class DualStorage implements Storage {
	get length(): number {
		const sessionLength = sessionStorage.length
		const localLength = localStorage.length
		const uniqueKeys = new Set<string>()
		for (let i = 0; i < sessionLength; i++) {
			const key = sessionStorage.key(i)
			if (key) uniqueKeys.add(key)
		}
		for (let i = 0; i < localLength; i++) {
			const key = localStorage.key(i)
			if (key) uniqueKeys.add(key)
		}
		return uniqueKeys.size
	}

	clear(): void {
		sessionStorage.clear()
		localStorage.clear()
	}

	getItem(key: string): string | null {
		return sessionStorage.getItem(key) ?? localStorage.getItem(key)
	}

	key(index: number): string | null {
		const sessionLength = sessionStorage.length
		if (index < sessionLength) {
			return sessionStorage.key(index)
		}
		return localStorage.key(index - sessionLength)
	}

	removeItem(key: string): void {
		sessionStorage.removeItem(key)
		localStorage.removeItem(key)
	}

	setItem(key: string, value: string): void {
		sessionStorage.setItem(key, value)
		localStorage.setItem(key, value)
	}
}

export const dualStorage = new DualStorage()
