import { Message } from "../constants/types";
import { TypeScriptServer } from "./services/TypeScriptServer";


const TS = new TypeScriptServer({ useWorkerStorage: true });
console.log(' WorkerGlobalScope.isSecureContext ', self.isSecureContext);
function onmessage(e: MessageEvent<Message>) {
    console.log('message from main', e.data);
    try {
        if (!TS.isReady()) throw new Error("TS Server is not ready");
        const { type, code, id } = e.data;
        if (!(type in TS)) throw new Error(`Invalid message type: ${type}`);
        postMessage({ data: { type, payload: TS[type](code as never) }, id });
    } catch (error) {
        postMessage({ error, success: false });
    }
}

self.onmessage = onmessage;