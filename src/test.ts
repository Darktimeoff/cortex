import { Cortex } from "./cortex";
import { RequestInterface } from "./request";

new Cortex()
    .get("/", (req) => ({
        message: "Hello World",
        empty: null,
        undefined: undefined,
        number: 1,
        string: "string",
        boolean: true,
        params: req.params
    }))
    .get("/user/:id/post/:postId", (req: RequestInterface<{ id: string, postId: string }>) => ({
        message: "Hello World",
        params: req.params
    }))
    .post("user", (req: RequestInterface<{}, { name: string, email: string }>) => ({
        message: "Create User",
        body: req.body,
        bodyType: typeof req.body
    }))
    .listen(3000, () => {
        console.log("http://localhost:3000");
    });
