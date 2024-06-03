import { TypeScriptServer } from "../workers/services/TypeScriptServer";

export interface Result<T> {
    success: boolean;
    data?: T;
    error?: string;
}


export interface Message {
    type: keyof TypeScriptServer;
    code?: string;
    id: number;
}