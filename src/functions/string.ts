export const stringFunctions = {
    strip(value: unknown) {
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

    size(value: unknown) {
        return String(value).length;
    },

    downcase(value: unknown) {
        const text = String(value);

        if(text.length === 0) {
            return text;
        }

        return text.toLowerCase();
    },

    capitalize(value: unknown) {
        const text = String(value);

        if (text.length === 0) {
            return text;
        }

        return text.charAt(0).toUpperCase() + text.slice(1);
    },

    capitalizewords(value: unknown) {
        const text = String(value);

        if (text.length === 0) {
            return text;
        }
        return text.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
    }
};