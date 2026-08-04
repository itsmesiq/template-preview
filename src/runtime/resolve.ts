export function resolve(object: unknown, path: string): unknown {
    if (!path) {
        return object;
    }

    const normalizedPath = path.replaceAll("?.", ".").replaceAll("?", "");

    return normalizedPath
        .split(".")
        .reduce((current: any, key) => {
            if (current == null){
                return undefined;
            }

            return current[key];
        }, object);
}