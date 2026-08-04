export enum TokenType {
    Text = "text",
    Expression = "expression",
}

export interface Token {
    type: TokenType;
    value: string;
    start: number;
    end: number;
}