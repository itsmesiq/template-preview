import path from "node:path";

export const paths = {
    root: process.cwd(),

    templates: path.join(process.cwd(), "templates"),

    components: path.join(
        process.cwd(),
        "templates",
        "Components"
    ),

    mock: path.join(process.cwd(), "mock"),

    public: path.join(process.cwd(), "public"),

    src: path.join(process.cwd(), "src"),
};