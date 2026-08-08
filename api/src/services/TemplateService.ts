import { listTemplates } from '../engine/renderer/listTemplates.js';

class TemplateService {
    async list() {
        return listTemplates();
    }
}

export const templateService = new TemplateService();
