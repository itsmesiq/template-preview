import { ComponentNotFoundError } from '../errors/index.js';
import { loadComponents } from './loadComponents.js';

export async function resolveComponents(name: string) {
    const components = await loadComponents();

    const component = components.get(name);

    if (!component) {
        throw new ComponentNotFoundError(name);
    }

    return component;
}
