import { HttpMethod } from "@/generic/enum/http-method.enum";
import { ControllerHandler, ControllerHandlerParamsType } from "./controller.type";
import { RequestBodyType } from "@/request/request.type";
export interface ControllerFindResultInterface {
    handler: ControllerHandler<ControllerHandlerParamsType, RequestBodyType>;
    params: ControllerHandlerParamsType;
}

export interface ControllerInterface<D = void> {
    find(path: string, method: HttpMethod): ControllerFindResultInterface | null;
    get<T extends ControllerHandlerParamsType, TBody extends RequestBodyType>(path: string, cb: ControllerHandler<T, TBody>): D;
    post<T extends ControllerHandlerParamsType, TBody extends RequestBodyType>(path: string, cb: ControllerHandler<T, TBody>): D;
    put<T extends ControllerHandlerParamsType, TBody extends RequestBodyType>(path: string, cb: ControllerHandler<T, TBody>): D;
    delete<T extends ControllerHandlerParamsType, TBody extends RequestBodyType>(path: string, cb: ControllerHandler<T, TBody>): D;
}