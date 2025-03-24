import { ParserResultType } from "@/parser/parser-factory.type";
import { RequestInterface } from "@/request/request.interface";
import { ResponseInterface } from "@/response/response.interface";

export type ControllerHandlerResponseType = string | number | boolean | object | null | undefined;

export type ControllerHandler<T extends ControllerHandlerParamsType = ControllerHandlerParamsType, TBody extends ParserResultType | null = ParserResultType | null, TRequest extends RequestInterface<T, TBody> = RequestInterface<T, TBody>> = (req: TRequest, res: ResponseInterface) => ControllerHandlerResponseType | Promise<ControllerHandlerResponseType>;

export type ControllerHandlerParamsType<T extends object = Record<string, unknown>> = T;