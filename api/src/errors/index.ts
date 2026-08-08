export class TemplateNotFoundError extends Error {
    constructor(template: string) {
        super(`Template "${template}" not found`);
        this.name = 'TemplateNotFoundError';
    }
}
