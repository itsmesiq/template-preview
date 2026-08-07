import { readFile } from "node:fs/promises";
import path from "node:path";

import { resolveComponents } from "../../loaders/resolveComponents.js";
import { paths } from "../../utils/paths.js";
import { interpret } from "../interpreter/index.js";
import { lexer } from "../parser/lexer.js";
import { parser } from "../parser/parser.js";
import { Runtime } from "../runtime/index.js";
import { evaluateExpression } from "./evaluateExpression.js";

export async function renderComponent(
    name: string,
    args: Record<string, string>,
    runtime: Runtime,
): Promise<string> {
    const component = await resolveComponents(name);

    const componentPath = path.join(paths.templates, component.path);

    const template = await readFile(componentPath, "utf-8");

    const child = runtime.child();

    for (const [key, expression] of Object.entries(args)) {
        child.set(key, evaluateExpression(expression, runtime));
    }

    const tokens = lexer(template);

    const nodes = parser(tokens);

    return interpret(nodes, child);
}