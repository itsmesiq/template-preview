import type { Component } from '../../types/Component.js';
import { getRoot, resolve } from './resolve.js';

export class Runtime {
    constructor(
        private readonly context: Record<string, unknown>,
        private readonly components: Map<string, Component>,
        private readonly values: Record<string, unknown> = {},
    ) {}

    get(path: string): unknown {
        const root = getRoot(path);

        if (Object.prototype.hasOwnProperty.call(this.values, root)) {
            return resolve(this.values, path);
        }
        return resolve(this.context, path);
    }

    set(path: string, value: unknown): void {
        this.values[path] = value;
    }

    getComponent(name: string): Component | undefined {
        return this.components.get(name);
    }

    child(): Runtime {
        return new Runtime(this.context, this.components, { ...this.values });
    }
}
