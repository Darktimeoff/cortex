import { MiddlewareChainInterface } from "./middleware-chain.interface";
import { MiddlewareHandler } from "./middleware.type";
import { RequestInterface } from "@/request";
export interface MiddlewareRegistryInterface<T extends object = object> {
    use<D extends RequestInterface = RequestInterface>(pathOrHandler: string | MiddlewareHandler<D>, handler?: MiddlewareHandler<D>): T;
    remove(middleware: MiddlewareHandler): T;
    getByPath(path: string): MiddlewareChainInterface;
}