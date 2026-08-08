import { loadMock } from '../../loaders/loadMock.js';
import type { RenderContext } from '../../types/RenderContext.js';
import { render } from '../renderer/render.js';

interface PreviewOptions {
    template: string;
    mock?: string;
}

export class PreviewEngine {
    async render({ template, mock = 'default' }: PreviewOptions) {
        const context: RenderContext = await loadMock(mock);

        return render(template, context);
    }
}
