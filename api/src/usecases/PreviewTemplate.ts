import { previewEngine } from '../engine/core/PreviewEngine.js';
import type { Component } from '../types/Component.js';
import type { RenderContext } from '../types/RenderContext.js';
import { getMock } from './GetMock.js';
import { getTemplate } from './GetTemplate.js';
import { listComponents } from './ListComponent.js';

interface PreviewTemplateInput {
    projectId: string;
    templateId: string;
    mockId: string;
    userId: string;
}

export async function previewTemplate({
    projectId,
    templateId,
    mockId,
    userId,
}: PreviewTemplateInput): Promise<string> {
    const [template, mock, components] = await Promise.all([
        getTemplate({ id: templateId, projectId, userId }),
        getMock({ id: mockId, projectId, userId }),
        listComponents({ projectId, userId }),
    ]);

    const context = JSON.parse(mock.content) as RenderContext;

    const componentMap = new Map<string, Component>(
        components.map(component => [
            component.name,
            {
                name: component.name,
                content: component.content,
                params: component.params,
            },
        ]),
    );

    return previewEngine.render({
        template: template.content,
        context,
        components: componentMap,
    });
}
