import { loadComponents } from './loadComponents.js';

export async function resolveComponents(name: string) {
    const components = await loadComponents();

    const component = components.get(name);

    if (!component) {
        throw new Error(`Component "${name}" not found`);
    }

    return component;
}
