import { ControllerHandlerResponseType } from "@/controller/controller.type";
import { RequestInterface } from "@/request";
import { ResponseInterface } from "@/response";

export type MiddlewareHandler<T extends RequestInterface = RequestInterface> = (req: T, res: ResponseInterface, next: () => Promise<void>) => Promise<void>;

export type MiddlewareExceptionHandlerInterface = (error: Error, req: RequestInterface['request'], res: ResponseInterface['response']) => ControllerHandlerResponseType | Promise<ControllerHandlerResponseType>;