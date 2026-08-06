import { readdir } from "node:fs/promises";
import path from "node:path";
import { paths } from "../utils/paths.js";

export async function listMocks(): Promise<string[]> {
    const files = await readdir(paths.mock);

    return files
        .filter(file => file.endsWith(".json"))
        .map(file => file.replace(".json", ""));
}