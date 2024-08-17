import { createStore, produce } from 'solid-js/store'

interface Event {
	title: string
	description?: string
	status: 'PENDING' | 'COMPLETED' | 'CANCELED'
}

const [_events, setEvents] = createStore<Event[]>([])

export const addEvent = (event: Event) => {
	setEvents(produce(events => events.push(event)))
}

export const removeEvent = (title: string) => {
	setEvents(produce(events => events.filter(event => event.title !== title)))
}
