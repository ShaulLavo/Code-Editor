import { onCleanup } from "solid-js";

export class AsyncWorker {
    private worker: Worker;
    private messageId: number;
    private pendingMessages: Map<number, (value: any) => void>;

    constructor(workerPath: string) {
        this.worker = new Worker(workerPath, { type: 'module' });
        this.messageId = 0;
        this.pendingMessages = new Map();

        this.worker.onmessage = (event) => {
            const { id, data } = event.data;
            console.log('message from worker:', event.data);
            if (this.pendingMessages.has(id)) {
                this.pendingMessages.get(id)!(data);
                this.pendingMessages.delete(id);
            }
        };
        this.worker.onerror = (e) => {
            console.error('error', e);
        };
    }

    sendMessage<T>(message: any): Promise<T> {
        console.log('sending message', message);
        return new Promise<T>((resolve) => {
            const id = this.messageId++;
            this.pendingMessages.set(id, resolve);
            this.worker.postMessage({ id, ...message });
        });
    }

    terminate() {
        this.worker.terminate();
    }

}
