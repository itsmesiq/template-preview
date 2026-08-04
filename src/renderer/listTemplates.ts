import { readdir } from "node:fs/promises";
import path from "node:path";
import { paths } from "../utils/paths.js";

export async function listTemplates(): Promise<string[]> {
    const files = await readdir(paths.templates);

    return files
        .filter(file => file.endsWith(".html"))
        .map(file => file.replace(".html", ""));
}