import { Runtime } from '../runtime/index.js';
import { evaluateExpression } from './evaluateExpression.js';

export function executeCode(code: string, runtime: Runtime): void {
    const statements = splitStatements(code);

    let index = 0;

    while (index < statements.length) {
        const statement = statements[index];

        if (statement.startsWith('if ')) {
            const condition = statement.slice(3).trim();
            const result = Boolean(evaluateExpression(condition, runtime));

            const endIndex = findMatchingEnd(statements, index);

            const elseIndex = findElse(statements, index, endIndex);

            if (result) {
                const branchEnd = elseIndex === -1 ? endIndex : elseIndex;

                executeCode(statements.slice(index + 1, branchEnd).join('\n'), runtime);
            } else if (elseIndex !== -1) {
                executeCode(statements.slice(elseIndex + 1, endIndex).join('\n'), runtime);
            }

            index = endIndex + 1;
            continue;
        }

        if (
            statement.startsWith('else') ||
            statement.startsWith('end') ||
            statement.startsWith('for ')
        ) {
            index++;
            continue;
        }

        const equals = findAssignment(statement);

        if (equals === -1) {
            index++;
            continue;
        }

        const variable = statement.slice(0, equals).trim();
        const expression = statement.slice(equals + 1).trim();

        const value = evaluateExpression(expression, runtime);

        runtime.set(variable, value);

        index++;
    }
}

function splitStatements(code: string): string[] {
    return code
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean);
}

function findAssignment(statement: string): number {
    for (let i = 0; i < statement.length; i++) {
        if (statement[i] !== '=') {
            continue;
        }

        const previous = statement[i - 1];
        const next = statement[i + 1];

        if (
            previous === '=' ||
            previous === '!' ||
            previous === '>' ||
            previous === '<' ||
            next === '='
        ) {
            continue;
        }
        return i;
    }
    return -1;
}

function findMatchingEnd(statements: string[], startIndex: number): number {
    let depth = 0;

    for (let index = startIndex; index < statements.length; index++) {
        const statement = statements[index];

        if (statement.startsWith('if ')) {
            depth++;
            continue;
        }

        if (statement.startsWith('end')) {
            depth--;
            if (depth === 0) {
                return index;
            }
        }
    }

    throw new Error('Unclosed if block');
}

function findElse(statements: string[], startIndex: number, endIndex: number): number {
    let depth = 0;

    for (let index = startIndex + 1; index < endIndex; index++) {
        const statement = statements[index];

        if (statement.startsWith('if ')) {
            depth++;
            continue;
        }

        if (statement === 'end') {
            depth--;
            continue;
        }

        if (statement == 'else' && depth === 0) {
            return index;
        }
    }

    return -1;
}
