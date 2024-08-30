const defaultConfis = {
	rootName: 'liveFS'
}

async function create(config = defaultConfis) {
	const opfsRoot = await navigator.storage.getDirectory()
	const directoryHandle = await opfsRoot.getDirectoryHandle(config.rootName, {
		create: true
	})
}
