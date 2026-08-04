import { readFile } from "node:fs/promises";
import path from "node:path";
import { paths } from "../utils/paths.js";

export async function loadTemplate(name: string): Promise<string> {
    const file = path.join(paths.templates, `${name}.html`);

    return readFile(file, "utf-8");
}