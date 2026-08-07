import type { Context } from "../../types/Context.js";
import { render } from "../renderer/render.js";

export class PreviewEngine {
    async render(template: string, context: Context): Promise<string> {
        return render(template, context);
    }
}