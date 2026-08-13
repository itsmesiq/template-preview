import type { Component } from '../../types/Component.js';
import type { RenderContext } from '../../types/RenderContext.js';
import { render } from '../renderer/render.js';

interface PreviewOptions {
    template: string;
    context: RenderContext;
    components: Map<string, Component>;
}

class PreviewEngine {
    async render({ template, context, components }: PreviewOptions) {
        return render(template, context, components);
    }
}

export const previewEngine = new PreviewEngine();
