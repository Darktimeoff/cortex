import { ControllerHandlerParamsType } from "@/controller";
import { RequestBodyType } from "./request.type";
import { IncomingMessage } from "node:http";

export interface RequestInterface<T extends ControllerHandlerParamsType = ControllerHandlerParamsType, TBody extends RequestBodyType = RequestBodyType> {
    params: T;
    body: TBody;
    request: IncomingMessage;
    query: Record<string, string | string[]>;
}