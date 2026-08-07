import { Node, NodeType } from "../parser/node.js";
import { Runtime } from "../runtime/index.js";
import { evaluateExpression } from "./evaluateExpression.js";
import { executeCode } from "./executeCode.js";
import { renderComponent } from "./renderComponent.js";

export async function interpret(nodes: Node[], runtime: Runtime): Promise<string> {
    let html = "";

    for (const node of nodes) {
        switch (node.type) {
            case NodeType.Text:
                html += node.value;
                break;

            case NodeType.Expression: {
                const value = evaluateExpression(node.expression, runtime);

                if (value !== undefined) {
                    html += String(value);
                    break;
                }

                try {
                    html += await renderComponent(node.name, node.args, runtime);
                } catch(error) {
                    console.error(error);
                    throw error;
                }

                break;
            }
            case NodeType.Code:
                executeCode(node.value, runtime);
                break;

            case NodeType.If: {
                const result = evaluateExpression(node.condition, runtime);

                html += await interpret(
                    result
                        ? node.thenBranch
                        : node.elseBranch,
                    runtime,
                );
                break;
            }

            case NodeType.For: {
                const iterable = evaluateExpression(node.iterable, runtime);

                if (!Array.isArray(iterable)) {
                    break;
                }

                for (let index = 0; index < iterable.length; index++) {
                    const child = runtime.child();
                
                    child.set(node.variable, iterable[index]);
                
                    child.set("for", {
                        index,
                        first: index === 0,
                        last: index === iterable.length - 1,
                    });
                
                    html += await interpret(node.body, child);
                }
                break;
            }
        }
    }

    return html;
}