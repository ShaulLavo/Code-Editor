import { createSignal, createUniqueId } from 'solid-js'
import { createStore, produce } from 'solid-js/store'

interface StatusBase {
	title: string
	description?: string
	status: 'PENDING' | 'COMPLETED' | 'CANCELED'
}
interface Status extends StatusBase {
	id: string
}
const [_statuses, setStatuses] = createStore<Status[]>([
	{
		title: 'Hello',
		status: 'PENDING',
		description: 'This is a test',
		id: createUniqueId()
	}
])

const pushStatus = (status: Status) => {
	setStatuses(produce(statuses => statuses.push(status)))
}

const removeStatus = (id: string) => {
	setStatuses(statuses => statuses.filter(status => status.id !== id))
}

const updateStatus = (status: Status) => {
	setStatuses(_statuses.map(s => (s.id === status.id ? status : s)))
}

export const [timeoutDelay, setTimeoutDelay] = createSignal(300)
export const [hideTimeout, setHideTimeout] = createSignal<NodeJS.Timeout>()
export const [showTimeout, setShowTimeout] = createSignal<NodeJS.Timeout>()

export const createStatus = (status: StatusBase) => {
	const newStatus = { ...status, id: createUniqueId() }
	pushStatus(newStatus)
	return {
		update: (status: StatusBase) => {
			updateStatus({ ...status, id: newStatus.id })
		},
		remove: () => {
			removeStatus(newStatus.id)
		}
	}
}

export const statuses = _statuses
