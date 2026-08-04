import { resolve } from "./resolve.js";

export class Runtime {
    constructor(private readonly values: Record<string, unknown>, private readonly parent?: Runtime) {}

    get(path: string): unknown {
        const value = resolve(this.values, path);

        if (value !== undefined) {
            return value;
        }

        return this.parent?.get(path);
    }

    set(path: string, value: unknown): void {
        this.values[path] = value;
    }

    child(): Runtime {
        return new Runtime({}, this);
    }
}