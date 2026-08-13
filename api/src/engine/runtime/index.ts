import type { Component } from '../../types/Component.js';
import { resolve } from './resolve.js';

export class Runtime {
    constructor(
        private readonly values: Record<string, unknown>,
        private readonly components: Map<string, Component>,
        private readonly parent?: Runtime,
    ) {}

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

    getComponent(name: string): Component | undefined {
        const component = this.components.get(name);

        if (component) {
            return component;
        }

        return this.parent?.getComponent(name);
    }

    child(): Runtime {
        return new Runtime({}, this.components, this);
    }
}
