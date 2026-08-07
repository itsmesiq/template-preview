import { readFile } from "node:fs/promises";
import path from "node:path";

import { paths } from "../utils/paths.js";

export async function loadMock(name: string) {
    const file = path.join(paths.mock, `${name}.json`);

    const json = await readFile(file, "utf-8");

    return JSON.parse(json);
}