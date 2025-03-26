import { HttpMethod } from "@/generic/enum/http-method.enum";
import { ControllerHandler, ControllerHandlerParamsType } from "./controller.type";
import { RequestBodyType } from "@/request/request.type";
import { MiddlewareChainInterface, MiddlewareRegistryInterface } from "@/middleware";
import { RequestInterface } from "@/request";
import { ValidationRequestSchemaInterface } from "@/validation";
export interface ControllerFindResultInterface {
    handler: ControllerHandler<ControllerHandlerParamsType, RequestBodyType>;
    params: ControllerHandlerParamsType;
    schema?: ValidationRequestSchemaInterface;
}

export interface ControllerInterface<D extends object = object> extends Pick<MiddlewareRegistryInterface<D>, 'use'> {
    find(path: string, method: HttpMethod): ControllerFindResultInterface | null;
    get<T extends ControllerHandlerParamsType, TBody extends RequestBodyType, TRequest extends RequestInterface<T, TBody>>(path: string, cb: ControllerHandler<T, TBody, TRequest>, schema?: ValidationRequestSchemaInterface): D;
    post<T extends ControllerHandlerParamsType, TBody extends RequestBodyType, TRequest extends RequestInterface<T, TBody>>(path: string, cb: ControllerHandler<T, TBody, TRequest>, schema?: ValidationRequestSchemaInterface): D;
    put<T extends ControllerHandlerParamsType, TBody extends RequestBodyType, TRequest extends RequestInterface<T, TBody>>(path: string, cb: ControllerHandler<T, TBody, TRequest>, schema?: ValidationRequestSchemaInterface): D;
    delete<T extends ControllerHandlerParamsType, TBody extends RequestBodyType, TRequest extends RequestInterface<T, TBody>>(path: string, cb: ControllerHandler<T, TBody, TRequest>, schema?: ValidationRequestSchemaInterface): D;
    findAllMiddlewareByPath(path: string): MiddlewareChainInterface;
}