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

    const logicalOr = findLogicalOr(expression);

    if (logicalOr !== -1) {
        const left = expression.slice(0, logicalOr).trim();
        const right = expression.slice(logicalOr + 2).trim();

        return Boolean(evaluateExpression(left, runtime))
            || Boolean(evaluateExpression(right, runtime));
    }    

    const logicalAnd = findLogicalAnd(expression);
    
    if (logicalAnd !== -1) {
        const left = expression.slice(0, logicalAnd).trim();
        const right = expression.slice(logicalAnd + 2).trim();
    
        return Boolean(evaluateExpression(left, runtime))
            && Boolean(evaluateExpression(right, runtime));
    }

    if (isUnaryNot(expression)) {
        return !evaluateExpression(expression.slice(1).trim(), runtime);
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
    let depth = 0;
    let quote = "";

    for (let i = 0; i < expression.length; i++) {
        const char = expression[i];

        if (quote) {
            if (char === quote) {
                quote = "";
            }
            continue;
        }

        if (char === '"' || char === "'") {
            quote = char;
            continue;
        }

        if (char === "(") {
            depth++;
            continue;
        }

        if (char === ")") {
            depth--;
            continue;
        }

        if (
            depth === 0 &&
            char === "?" &&
            expression[i + 1] !== "."
        ) {
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

function isUnaryNot(expression: string): boolean {
    return expression.startsWith("!") &&
        expression.length > 1 &&
        expression[1] !== "=";
}

function findLogicalOr(expression: string): number {
    return findOperator(expression, "||");
}

function findLogicalAnd(expression: string): number {
    return findOperator(expression, "&&");
}

function findOperator(expression: string, operator: string): number {
    let depth = 0;
    let quote = "";

    for (let i = 0; i < expression.length - operator.length + 1; i++) {
        const char = expression[i];

        if (quote) {
            if (char === quote) {
                quote = "";
            }

            continue;
        }

        if (char === '"' || char === "'") {
            quote = char;
            continue;
        }

        if (char === "(") {
            depth++;
            continue;
        }

        if (char === ")") {
            depth--;
            continue;
        }

        if (
            depth === 0 &&
            expression.slice(i, i + operator.length) === operator
        ) {
            return i;
        }
    }

    return -1;
}