import path from 'node:path';

const root = process.cwd();

export interface ProjectPaths {
    root: string;
    templates: string;
    components: string;
    mocks: string;
    componentsConfig: string;
}

export const paths = {
    root,

    projects: path.join(root, 'projects'),

    public: path.join(root, 'public'),

    src: path.join(root, 'src'),

    project(slug: string): ProjectPaths {
        const projectRoot = path.join(root, 'projects', slug);

        return {
            root: projectRoot,
            templates: path.join(projectRoot, 'templates'),
            components: path.join(projectRoot, 'components'),
            mocks: path.join(projectRoot, 'mocks'),
            componentsConfig: path.join(projectRoot, 'components.json'),
        };
    },
};
