import { ControllerHandlerParamsType } from "@/controller";

export interface RequestInterface<T extends ControllerHandlerParamsType = ControllerHandlerParamsType> {
    params: T;
}