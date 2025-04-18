import { Cortex } from "./cortex";
import { RequestInterface } from "./request";
import * as yup from "yup";
import { adaptYupSchema } from "./validation";

new Cortex()
    .use((_, __, next) => {
        console.log("Middleware 1");
        return next();
    })
    .use('/user', (_, __, next) => {
        console.log("Middleware 2");
        return next();
    })
    .use((req: RequestInterface & { state: { message: string } }, __, next) => {
        req.state = {
            message: "Hello World",
        }
        console.log("Middleware 3");
        return next();
    })
    .use((req: RequestInterface & { state: { userId: number } }, __, next) => {
        req.state.userId = 1
        console.log("Middleware 4");
        return next();
    })
    .get("/", (req: RequestInterface & { state: { message: string, userId: number } }) => {
        return {
            message: "Hello World",
            empty: null,
            undefined: undefined,
            number: 1,
            string: "string",
            boolean: true,
            params: req.params,
            state: req.state,
            query: req.query
        }
    }, {
        query: adaptYupSchema(yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required(),
        })),
        body: adaptYupSchema(yup.object().shape({
            name: yup.string().required(),
        })),
        response: adaptYupSchema(yup.object().shape({
            message: yup.string().required(),
            empty: yup.string().nullable(),
            undefined: yup.string().nullable(),
            number: yup.number().required(),
            string: yup.string().required(),
        }))
    })
    .get("/user/:id/post/:postId", (req: RequestInterface<{ id: string, postId: string }>) => ({
        message: "Hello World",
        params: req.params,
        query: req.query
    }))
    .post("user", (req: RequestInterface<{}, { name: string, email: string }> & { state: { userId: number, message: string } }) => ({
        message: "Create User",
        body: req.body,
        bodyType: typeof req.body,
        state: req.state
    }))
    .listen(3000);
