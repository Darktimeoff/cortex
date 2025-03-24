import { RequestInterface } from "@/request";
import { ResponseInterface } from "@/response";

export type MiddlewareHandler<T extends RequestInterface = RequestInterface> = (req: T, res: ResponseInterface, next: () => Promise<void>) => Promise<void>;