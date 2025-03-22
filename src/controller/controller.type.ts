import { RequestInterface } from "@/request/request.interface";
import { ResponseInterface } from "@/response/response.interface";

export type ControllerHandlerResponseType = string | number | boolean | object | null | undefined;

export type ControllerHandler = (req: RequestInterface, res: ResponseInterface) => ControllerHandlerResponseType | Promise<ControllerHandlerResponseType>;