import { HttpMethod } from "../enum/http-method.enum";

export const isHttpMethod = (value: unknown): value is HttpMethod => {
    return typeof value === "string" && Object.values(HttpMethod).includes(value as HttpMethod);
};
