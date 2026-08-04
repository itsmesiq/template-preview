import { loadComponents } from "./loadComponents.js";
import path from "node:path";

export async function resolveComponents(name: string) {
    const components = await loadComponents();

    const component = components.get(name);

    if (!component) {
        throw new Error(`Component "${name}" not found`);
    }

    const filename = path.basename(component.path);

    return component;
}