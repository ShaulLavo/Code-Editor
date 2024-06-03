import { createSystem, createVirtualTypeScriptEnvironment, createDefaultMapFromCDN } from "@typescript/vfs";
import ts, { DiagnosticCategory } from "typescript";
import lzstring from "lz-string";
import { createWorkerStorage } from "./workerStorage";
import { Result } from "../../constants/types";
import { Diagnostic } from "@codemirror/lint";
import { createUniqueId } from "solid-js";

const compilerOptions: ts.CompilerOptions = { target: ts.ScriptTarget.ES2016, esModuleInterop: true };

interface TypeScriptEnvironmentConfig {
    useWorkerStorage?: boolean;

}

class TypeScriptServer {
    #env: ReturnType<typeof createVirtualTypeScriptEnvironment> = null!;
    #fsMap: Map<string, string> = null!;
    #system: ReturnType<typeof createSystem> = null!;
    #config: TypeScriptEnvironmentConfig;
    #isReady = false;
    constructor(config: TypeScriptEnvironmentConfig = {}) {
        this.#config = config;
        this.#initialize();
        this.#isReady = true;
        console.log(' WorkerGlobalScope.isSecureContext ', self.isSecureContext);

    }

    async #initialize() {
        console.log(' WorkerGlobalScope.isSecureContext ', self.isSecureContext);

        const storage = this.#config.useWorkerStorage ? await createWorkerStorage() : localStorage;
        console.log("Initializing TypeScript environment", ts.version);
        this.#fsMap = await createDefaultMapFromCDN(compilerOptions, ts.version, true, ts, lzstring, undefined, storage);
        this.#fsMap.set("index.ts", "// main TypeScript file content");
        this.#system = createSystem(this.#fsMap);
        this.#env = createVirtualTypeScriptEnvironment(this.#system, ["index.ts"], ts, compilerOptions);
    }

    #handleResult<T>(callback: () => T): Result<T> {
        try {
            const data = callback();
            return { success: true, data };
        } catch (error) {
            if (error instanceof Error) return { success: false, error: error.message };
            return { success: false, error: "An error occurred" };
        }
    }

    public update(code: string): Result<void> {
        return this.#handleResult(() => {
            if (!code) throw new Error("No code provided");
            this.#env.updateFile("/index.ts", code ?? " ");
        });
    }

    public diagnose(): Result<Diagnostic[]> {
        return this.#handleResult(() => {
            const diagnoses = this.#env.languageService.getSemanticDiagnostics("index.ts");
            return diagnoses.map(({ start, length, source, messageText, category }) => ({
                from: start!,
                to: start! + length!,
                message: messageText.toString(),
                source,
                severity: DiagnosticCategory[category] as Diagnostic['severity']
            }));
        });
    }

    public format(): Result<ts.TextChange[]> {
        return this.#handleResult(() => this.#env.languageService.getFormattingEditsForDocument("index.ts", { tabSize: 2 }));
    }

    public getDocumentHighlights(position: number): Result<ts.DocumentHighlights[] | undefined> {
        return this.#handleResult(() => this.#env.languageService.getDocumentHighlights("index.ts", position, ["index.ts"]));
    }

    isReady() {
        return this.#isReady;
    }
}


export type TypeScriptServerResults = {
    [K in keyof TypeScriptServer]: ReturnType<TypeScriptServer[K]>;

};

export { TypeScriptServer };