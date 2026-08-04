import { Runtime } from "../runtime/index.js";
import { evaluateExpression } from "./evaluateExpression.js";

export function executeCode(code: string, runtime: Runtime): void {
    const statements = splitStatements(code);

    for (const statement of statements) {
        const equals = statement.indexOf("=");

        if (equals === -1) {
            continue;
        }

        const variable = statement.slice(0, equals).trim();

        const expression = statement.slice(equals + 1).trim();

        const value = evaluateExpression(expression, runtime);

        runtime.set(variable, value);
    }
}

function splitStatements(code: string): string[] {
    const statements: string[] = [];

    const lines = code
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean);

    let current = "";

    for (const line of lines) {
        if (line.includes("=") && current !== "") {
            statements.push(current.trim());
            current = line;
            continue;
        }

        if (current === ""){
            current = line;
        } else {
            current += " " + line;
        }
    }

    if (current !== "") {
        statements.push(current.trim());
    }

    return statements;
}