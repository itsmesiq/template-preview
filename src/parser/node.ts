export enum NodeType {
    Text = "text",
    Expression = "expression",
    Code = "code",
    If = "if",
    For = "for",
}

export interface BaseNode {
    type: NodeType;
}

export interface TextNode extends BaseNode {
    type: NodeType.Text;
    value: string;
}

export interface ExpressionNode extends BaseNode {
    type: NodeType.Expression;
    expression: string;
    name: string;
    args: Record<string, string>;
}

export interface CodeNode extends BaseNode {
    type: NodeType.Code;
    value: string;
}

export interface IfNode extends BaseNode {
    type: NodeType.If;
    condition: string;
    thenBranch: Node[];
    elseBranch: Node[];
}

export interface ForNode extends BaseNode {
    type: NodeType.For;
    variable: string;
    iterable: string;
    body: Node[];
}

export type Node = TextNode | ExpressionNode | CodeNode | IfNode | ForNode;