import { Runtime } from "../runtime/index.js";

export function evaluateExpression(expression: string, runtime: Runtime,): unknown {
    expression = expression.trim();

    if (expression.includes("??")) {
        const parts = expression.split("??").map(part => part.trim());

        for (const part of parts) {
            if (
                (part.startsWith('"') && part.endsWith('"')) ||
                (part.startsWith("'") && part.endsWith("'"))
            ) {
                return part.slice(1, -1);
            }

            const value = runtime.get(part);

            if (value !== undefined && value !== null) {
                return value;
            }
        }

        return undefined;
    }

    if (expression.includes("!=")){
        const [left, right] = expression.split("!=").map(part => part.trim());

        return evaluateExpression(left, runtime) !== evaluateExpression(right, runtime);
    }

    if (expression.includes("==")){
        const [left, right] = expression.split("==").map(part => part.trim());

        return evaluateExpression(left, runtime) === evaluateExpression(right, runtime);
    }

    if (expression === "null") {
        return null;
    }

    if (expression === "true") {
        return true;
    }

    if (expression === "false") {
        return false;
    }

    if (
        (expression.startsWith('"') && expression.endsWith('"')) ||
        (expression.startsWith("'") && expression.endsWith("'"))
    ) {
        return expression.slice(1, -1);
    }

    const number = Number(expression);

    if (!isNaN(number)) {
        return number;
    }

    return runtime.get(expression);
}