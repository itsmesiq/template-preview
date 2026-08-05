import { functions } from "../functions/index.js";
import { evaluateExpression } from "./evaluateExpression.js";
import { Runtime } from "../runtime/index.js";

export function evaluatePipe(expression: string, runtime: Runtime): unknown {
    const parts = expression.split("|").map(part => part.trim());

    let value = evaluateExpression(parts.shift()!, runtime);

    for (const part of parts) {
        console.log("PIPE:", part);
        if (value == null) {
            return value;
        }
        const { fn, args } = parseFunction(part);

        const [namespace, method] = fn.split(".");

        const callable = (functions as any)[namespace]?.[method];

        if (!callable) {
            throw new Error(`Function ${fn} not found`);
        }

        value = callable(
            value,
            ...args.map(arg => evaluateExpression(arg, runtime)),
        );
    }

    return value;
}

function parseFunction(part: string): { fn: string; args: string[] } {
    const firstSpace = part.indexOf(" ");

    if (firstSpace === -1) {
        return {
            fn: part,
            args: [],
        };
    }

    const fn = part.slice(0, firstSpace);

    const argsText = part.slice(firstSpace + 1).trim();

    return {
        fn,
        args: splitArguments(argsText),
    };
}

function splitArguments(text: string): string[] {
    const args: string[] = [];

    let current = "";

    let depth = 0;
    let quote = "";

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (quote) {
            current += char;

            if (char === quote) {
                quote = "";
            }

            continue;
        }

        if (char === '"' || char === "'") {
            quote = char;
            current += char;
            continue;
        }

        if (char === "(") {
            depth++;
            current += char;
            continue;
        }

        if (char === ")") {
            depth--;
            current += char;
            continue;
        }

        if (char === " " && depth === 0) {
            if (current.trim()) {
                args.push(current.trim());
                current = "";
            }

            continue;
        }

        current += char;
    }

    if (current.trim()) {
        args.push(current.trim());
    }

    return args;
}