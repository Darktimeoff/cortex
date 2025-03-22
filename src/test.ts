import { Cortex } from "./cortex";

const cortex = new Cortex();

cortex.get("/", () => {
    return {
        message: "Hello World",
        empty: null,
        undefined: undefined,
        number: 1,
        string: "string",
        boolean: true,
        object: {
            message: "Hello World"
        },
        array: [1, 2, 3]
    };
});

cortex.listen(3000, () => {
    console.log("http://localhost:3000");
});

