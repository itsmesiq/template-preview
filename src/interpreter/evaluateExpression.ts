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
        const index = expression.indexOf("!=");
        const left = expression.slice(0, index).trim();
        const right = expression.slice(index + 2).trim();
        
        const leftValue = evaluateExpression(left, runtime);
        const rightValue = evaluateExpression(right, runtime);

        return notEquals(leftValue, rightValue);
    }

    if (expression.includes("==")){
        const index = expression.indexOf("==");
        const left = expression.slice(0, index).trim();
        const right = expression.slice(index + 2).trim();

        const leftValue = evaluateExpression(left, runtime);
        const rightValue = evaluateExpression(right, runtime);

        return equals(leftValue, rightValue);
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

function equals(left: unknown, right: unknown): boolean {
    if ((left == null && right == null)) {
        return true;
    }
    return left === right;
}

function notEquals(left: unknown, right: unknown): boolean {
    return !equals(left, right);
}