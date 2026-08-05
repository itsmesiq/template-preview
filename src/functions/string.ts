export const stringFunctions = {
    trim(value: unknown) {
        return String(value).trim();
    },

    split(value: unknown, separator: string) {
        console.log("split", { value, separator });
        return String(value).split(separator);
    },

    replace(value: unknown, search: string, replace: string) {
        return String(value).replace(search, replace);
    },

    contains(value: unknown, search: string) {
        return String(value).includes(search);
    },

    index_of(value: unknown, search: string) {
        console.log("index_of", { value, search });
        return String(value).indexOf(search);
    },

    slice(value: unknown, start: number, end?: number) {
        console.log("slice", { value, start, end });
        return String(value).slice(start, end);
    },
};