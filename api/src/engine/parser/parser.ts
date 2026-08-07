import { Token, TokenType } from "./token.js";
import { CodeNode, ExpressionNode, IfNode, ForNode, Node, NodeType, TextNode } from "./node.js";

export function parser(tokens: Token[]): Node[] {
    const nodes: Node[] = [];

    let i = 0;

    while (i < tokens.length) {
        const token = tokens[i];

        if (token.type === TokenType.Text) {
            nodes.push({
                type: NodeType.Text,
                value: token.value,
            } satisfies TextNode);
            i++;
            continue;
        }

        if (token.value.startsWith("~") && token.value.endsWith("~")) {
            nodes.push({
                type: NodeType.Code,
                value: token.value.slice(1, -1).trim(),
            } satisfies CodeNode);
            i++;
            continue;
        }

        if (token.value.startsWith("if ")) {
            const result = parseIf(tokens, i);

            nodes.push(result.node);

            i = result.nextIndex;
            continue;
        }

        if (token.value.startsWith("for ")) {
            const result = parseFor(tokens, i);

            nodes.push(result.node);

            i = result.nextIndex;
            continue;
        }

        nodes.push(parseExpression(token.value));

        i++;
    }

    return nodes;
}

function parseExpression(expression: string): ExpressionNode {
    console.log("Parsing expression:", expression);
    const parts = expression.trim().split(/\s+/);

    const name = parts.shift()!;

    const args: Record<string, string> = {};

    for (const part of parts) {
        const [key, value] = part.split(":");

        if (key && value) {
            args[key] = value;
        }
    }

    return {
        type: NodeType.Expression,
        expression,
        name,
        args,
    };
}

function parseIf(tokens: Token[], startIndex: number): { node: IfNode; nextIndex: number } {
    const condition = tokens[startIndex].value.slice(2).trim();

    const thenTokens: Token[] = [];
    const elseTokens: Token[] = [];

    let current = thenTokens;

    let depth = 0;

    let i = startIndex + 1;

    while (i < tokens.length) {
        const token = tokens[i];

        if (token.type === TokenType.Expression) {
            if (token.value.startsWith("if ") || token.value.startsWith("for ")) {
                depth++;
            }

            else if (token.value === "end") {
                if (depth === 0) {
                    return {
                        node: {
                            type: NodeType.If,
                            condition,
                            thenBranch: parser(thenTokens),
                            elseBranch: parser(elseTokens),
                        },
                        nextIndex: i + 1,
                    };
                }

                depth--;
            }

            else if (token.value.startsWith("else if ") && depth === 0) {
                const nestedIfTokens: Token[] = [
                    {
                        ...token,
                        value: token.value.slice(5).trim(), // remove "else "
                    },
                ];

                i++;

                let nestedDepth = 0;

                while (i < tokens.length) {
                    const nestedToken = tokens[i];

                    if (nestedToken.type === TokenType.Expression) {
                        if (
                            nestedToken.value.startsWith("if ") ||
                            nestedToken.value.startsWith("for ")
                        ) {
                            nestedDepth++;
                        }

                        else if (nestedToken.value === "end") {
                            if (nestedDepth === 0) {
                                nestedIfTokens.push(nestedToken);
                                break;
                            }

                            nestedDepth--;
                        }
                    }

                    nestedIfTokens.push(nestedToken);
                    i++;
                }

                const result = parseIf(nestedIfTokens, 0);

                return {
                    node: {
                        type: NodeType.If,
                        condition,
                        thenBranch: parser(thenTokens),
                        elseBranch: [result.node],
                    },
                    nextIndex: i + 1,
                };
            }
            
            else if (token.value === "else" && depth === 0) {
                current = elseTokens;
                i++;
                continue;
            }
        }
        current.push(token);
        i++;
    }

    throw new Error("If statement not closed with 'end'");
}

function parseFor(tokens: Token[], startIndex: number): { node: ForNode; nextIndex: number } {
    const expression = tokens[startIndex].value.slice(3).trim();

    const match = expression.match(/^(\w+)\s+in\s+(.+)$/);

    if (!match) {
        throw new Error(`Invalid for loop expression: ${expression}`);
    }

    const [, variable, iterable] = match;

    const bodyTokens: Token[] = [];

    let depth = 0;

    let i = startIndex + 1;

    while (i < tokens.length) {
        const token = tokens[i];

        if (token.type === TokenType.Expression) {
            if (token.value.startsWith("for ") || token.value.startsWith("if ")) {
                depth++;
            }

            else if (token.value === "end") {
                if (depth === 0) {
                    return {
                        node: {
                            type: NodeType.For,
                            variable,
                            iterable,
                            body: parser(bodyTokens),
                        },
                        nextIndex: i + 1,
                    };
                }
                depth--;
            }
        }
        bodyTokens.push(token);
        i++;
    }
    throw new Error("For loop not closed with 'end'");
}