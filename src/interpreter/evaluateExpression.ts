import { Runtime } from "../runtime/index.js";
import { evaluatePipe } from "./evaluatePipe.js";

export function evaluateExpression(expression: string, runtime: Runtime,): unknown {
    expression = expression.trim();

    if (
        expression.startsWith("(") &&
        expression.endsWith(")")
    ) {
        return evaluateExpression(
            expression.slice(1, -1).trim(),
            runtime,
        );
    }

    if (hasPipe(expression)) {
        return evaluatePipe(expression, runtime);
    }

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

    const question = findTernary(expression);

    if (question !== -1) {
        const colon = expression.indexOf(":", question);

        const condition = expression.slice(0, question).trim();
        const whenTrue = expression.slice(question + 1, colon).trim();
        const whenFalse = expression.slice(colon + 1).trim();

        return evaluateExpression(condition, runtime)
            ? evaluateExpression(whenTrue, runtime)
            : evaluateExpression(whenFalse, runtime);
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

    if (expression.includes("+")) {
        const parts = expression.split("+").map(p => p.trim());
    
        const values = parts.map(part => evaluateExpression(part, runtime));
    
        if (values.every(v => typeof v === "number")) {
            return values.reduce((a, b) => Number(a) + Number(b));
        }
    
        return values
            .map(v => v ?? "")
            .join("");
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


function findTernary(expression: string): number {
    for (let i = 0; i < expression.length; i++) {
        if( expression[i] === "?" && expression[i + 1] !== "."){
            return i;
        }
    }
    return -1;
}

function hasPipe(expression: string): boolean {
    let inString = false;
    let quote = "";

    for (const char of expression) {
        if ((char === '"' || char === "'")) {
            if (!inString) {
                inString = true;
                quote = char;
            } else if (quote === char) {
                inString = false;
            }
        }

        if (!inString && char === "|") {
            return true;
        }
    }

    return false;
}