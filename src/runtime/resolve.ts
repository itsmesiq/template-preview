export function resolve(object: unknown, path: string): unknown {
    if (!path) {
        return object;
    }

    const normalizedPath = path
        .replaceAll("?.", ".")
        .replaceAll("?", "")
        .replace(/\[(\d+)\]/g, ".$1");

    return normalizedPath
        .split(".")
        .reduce((current: any, key) => {
            if (current == null){
                return undefined;
            }
            if (Array.isArray(current)) {
                switch (key) {
                    case "count":
                    case "size":
                        return current.length;
                    case "empty":
                        return current.length === 0;
                    case "first":
                        return current[0];
                    
                    case "last":
                        return current[current.length - 1];                        
                }
            }
            return current[key];
        }, object);
}
