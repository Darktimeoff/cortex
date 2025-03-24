import { HttpMethod } from "@/generic/enum/http-method.enum";
import { ControllerHandler, ControllerHandlerParamsType } from "./controller.type";
import { RequestBodyType } from "@/request/request.type";
import { MiddlewareChainInterface, MiddlewareRegistryInterface } from "@/middleware";
import { RequestInterface } from "@/request";
export interface ControllerFindResultInterface {
    handler: ControllerHandler<ControllerHandlerParamsType, RequestBodyType>;
    params: ControllerHandlerParamsType;
}

export interface ControllerInterface<D extends object = object> extends Pick<MiddlewareRegistryInterface<D>, 'use'> {
    find(path: string, method: HttpMethod): ControllerFindResultInterface | null;
    get<T extends ControllerHandlerParamsType, TBody extends RequestBodyType, TRequest extends RequestInterface<T, TBody>>(path: string, cb: ControllerHandler<T, TBody, TRequest>): D;
    post<T extends ControllerHandlerParamsType, TBody extends RequestBodyType, TRequest extends RequestInterface<T, TBody>>(path: string, cb: ControllerHandler<T, TBody, TRequest>): D;
    put<T extends ControllerHandlerParamsType, TBody extends RequestBodyType, TRequest extends RequestInterface<T, TBody>>(path: string, cb: ControllerHandler<T, TBody, TRequest>): D;
    delete<T extends ControllerHandlerParamsType, TBody extends RequestBodyType, TRequest extends RequestInterface<T, TBody>>(path: string, cb: ControllerHandler<T, TBody, TRequest>): D;
    findAllMiddlewareByPath(path: string): MiddlewareChainInterface;
}