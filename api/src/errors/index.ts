export class TemplateNotFoundError extends Error {
    constructor(template: string) {
        super(`Template "${template}" not found`);
        this.name = 'TemplateNotFoundError';
    }
}

export class ComponentNotFoundError extends Error {
    constructor(component: string) {
        super(`Component "${component}" not found`);
        this.name = 'ComponentNotFoundError';
    }
}
