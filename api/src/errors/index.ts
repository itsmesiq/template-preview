export class ComponentNotFoundError extends Error {
    constructor(component: string) {
        super(`Component "${component}" not found`);
        this.name = 'ComponentNotFoundError';
    }
}

export class MockNotFoundError extends Error {
    constructor(mock: string) {
        super(`Mock "${mock}" not found`);
        this.name = 'MockNotFoundError';
    }
}

export class VariableNotFoundError extends Error {
    constructor(path: string) {
        super(`Variable "${path}" not found`);
        this.name = 'VariableNotFoundError';
    }
}

export class ProjectNotFoundError extends Error {
    constructor(project: string) {
        super(`Project "${project}" not found`);
        this.name = 'ProjectNotFoundError';
    }
}

export class TemplateNotFoundError extends Error {
    constructor(template: string) {
        super(`Template "${template}" not found`);
        this.name = 'TemplateNotFoundError';
    }
}
