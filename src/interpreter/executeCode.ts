import { Runtime } from "../runtime/index.js";
import { evaluateExpression } from "./evaluateExpression.js";

export function executeCode(code: string, runtime: Runtime): void {
    const statements = splitStatements(code);

    for (const statement of statements) {
        if (
            statement.startsWith("if ") ||
            statement.startsWith("else") ||
            statement.startsWith("end") ||
            statement.startsWith("for ")
        ) {
            continue;
        }

        const equals = findAssignment(statement);

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
    return code
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean);
}

function findAssignment(statement: string): number {
    for (let i = 0; i < statement.length; i++) {
        if (statement[i] !== "=") {
            continue;
        }

        const previous = statement[i - 1];
        const next = statement[i + 1];

        if (
            previous === "=" ||
            previous === "!" ||
            previous === ">" ||
            previous === "<" ||
            next === "="
        ) {
            continue;
        }
        return i;
    }   
    return -1;
}