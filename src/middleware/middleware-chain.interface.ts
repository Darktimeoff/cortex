import { RequestInterface } from "@/request";
import { ResponseInterface } from "@/response";
import { MiddlewareHandler } from "./middleware.type";

export interface MiddlewareChainInterface {
    execute(req: RequestInterface, res: ResponseInterface): Promise<void>;
    middlewares: Array<MiddlewareHandler>;
}