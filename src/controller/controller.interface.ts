import { HttpMethod } from "@/generic/enum/http-method.enum";
import { ControllerHandler, ControllerHandlerParamsType } from "./controller.type";

export interface ControllerFindResultInterface {
    handler: ControllerHandler;
    params: ControllerHandlerParamsType;
}

export interface ControllerInterface<D = void> {
    find(path: string, method: HttpMethod): ControllerFindResultInterface | null;
    get<T extends ControllerHandlerParamsType>(path: string, cb: ControllerHandler<T>): D;
    post<T extends ControllerHandlerParamsType>(path: string, cb: ControllerHandler<T>): D;
    put<T extends ControllerHandlerParamsType>(path: string, cb: ControllerHandler<T>): D;
    delete<T extends ControllerHandlerParamsType>(path: string, cb: ControllerHandler<T>): D;
}