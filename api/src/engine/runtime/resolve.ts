import { VariableNotFoundError } from '../../errors/index.js';

export function resolve(object: unknown, path: string): unknown {
    if (!path) {
        return object;
    }

    const normalizedPath = path.replace(/\[(\d+)\]/g, '.$1').replaceAll('?.', '.?');

    const segments = normalizedPath.split('.');

    return segments.reduce((current: unknown, rawKey) => {
        const isOptional = rawKey.startsWith('?');
        const key = rawKey.replaceAll('?', '');

        if (current == null) {
            if (isOptional) {
                return undefined;
            }

            throw new VariableNotFoundError(path);
        }

        if (Array.isArray(current)) {
            switch (key) {
                case 'count':
                case 'size':
                    return current.length;
                case 'empty':
                    return current.length === 0;
                case 'first':
                    return current[0];

                case 'last':
                    return current[current.length - 1];
            }
        }

        if (typeof current === 'string') {
            switch (key) {
                case 'size':
                    return current.length;
            }
        }

        if ((typeof current === 'object' || typeof current === 'function') && key in current) {
            return (current as Record<string, unknown>)[key];
        }

        if (isOptional) {
            return undefined;
        }

        throw new VariableNotFoundError(path);
    }, object);
}
