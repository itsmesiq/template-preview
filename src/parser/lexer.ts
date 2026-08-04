import { Token, TokenType } from "./token.js";

export function lexer(input: string): Token[] {
    const tokens: Token[] = [];

    let cursor = 0;

    while (cursor < input.length) {
        const expressionStart = input.indexOf("{{", cursor);

        if (expressionStart === -1) {
            if (cursor < input.length) {
                tokens.push({
                    type: TokenType.Text,
                    value: input.slice(cursor),
                    start: cursor,
                    end: input.length,
                });
            }
            break;
        }

        if (expressionStart > cursor) {
            tokens.push({
                type: TokenType.Text,
                value: input.slice(cursor, expressionStart),
                start: cursor,
                end: expressionStart,
            });
        }

        const expressionEnd = input.indexOf("}}", expressionStart);

        if (expressionEnd === -1) {
            throw new Error(`Unclosed expression at position ${expressionStart}`);
        }

        tokens.push({
            type: TokenType.Expression,
            value: input.slice(expressionStart + 2, expressionEnd).trim(),
            start: expressionStart,
            end: expressionEnd + 2,
        });
        cursor = expressionEnd + 2;
    }

    return tokens;
}