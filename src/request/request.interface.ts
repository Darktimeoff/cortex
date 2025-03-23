import { ControllerHandlerParamsType } from "@/controller";
import { RequestBodyType } from "./request.type";

export interface RequestInterface<T extends ControllerHandlerParamsType = ControllerHandlerParamsType, TBody extends RequestBodyType = RequestBodyType> {
    params: T;
    body: TBody;
}