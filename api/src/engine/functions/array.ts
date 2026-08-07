export const arrayFunctions = {
    first(array: unknown[]) {
        return array[0];
    },

    last(array: unknown[]) {
        return array[array.length - 1];
    },

    join(array: unknown[], separator = ",") {
        if (!Array.isArray(array)) {
            return "";
        }
        return array.join(separator);
    },
    map(array: any[], property: string) {
        if (!Array.isArray(array)) {
            return [];
        }

        return array.map(item => item?.[property]);
    },
    size(array: unknown[]) {
        if (!Array.isArray(array)) {
            return 0;
        }
        return array.length;
    }
};