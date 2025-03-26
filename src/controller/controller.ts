import { HttpMethod } from "@/generic/enum/http-method.enum";
import { ControllerFindResultInterface, ControllerInterface } from "./controller.interface";
import { ControllerHandler, ControllerHandlerParamsType } from "./controller.type";
import { Memoirist } from 'memoirist'
import { RequestBodyType } from "@/request/request.type";
import { MiddlewareChainInterface, MiddlewareHandler, MiddlewareRegistryInterface } from "@/middleware";
import { MiddlewareRegistry } from "@/middleware";
import { RequestInterface } from "@/request";
import { LoggerFactory, LoggerInterface, TransportEnum } from "@/logger";
import { DEFAULT_OPTIONS } from "@/cortex";

export class Controller implements ControllerInterface {
    private readonly router: Memoirist<ControllerHandler<ControllerHandlerParamsType, RequestBodyType>>
    private readonly middlewareRegistry: MiddlewareRegistryInterface;
    private readonly logger: LoggerInterface;

    constructor(
        private readonly basePath?: string,
        logger: TransportEnum = DEFAULT_OPTIONS.logger
    ) {
        this.router = new Memoirist<ControllerHandler<ControllerHandlerParamsType, RequestBodyType>>({lazy: true});
        this.middlewareRegistry = new MiddlewareRegistry();
        this.logger = LoggerFactory.createLogger(logger);
    }

    find(path: string, method: HttpMethod): ControllerFindResultInterface | null {
        const result = this.router.find(method, path);

        if (!result) {
            return null;
        }

        return {
            handler: result.store,
            params: result.params
        };
    }

    use<D extends RequestInterface = RequestInterface>(pathOrHandler: string | MiddlewareHandler<D>, handler?: MiddlewareHandler<D>): ControllerInterface {
        this.middlewareRegistry.use(pathOrHandler, handler);
        this.logger.info(`Middleware ${typeof pathOrHandler === 'function' ? pathOrHandler.name : handler?.name} ${typeof pathOrHandler === 'string' ? pathOrHandler : '/'}`);
        return this;
    }

    findAllMiddlewareByPath(path: string): MiddlewareChainInterface {
        return this.middlewareRegistry.getByPath(path);
    }

    get<T extends ControllerHandlerParamsType, TBody extends RequestBodyType, TRequest extends RequestInterface<T, TBody>>(path: string, cb: ControllerHandler<T, TBody, TRequest>): ControllerInterface {
        this.addRoute(path, HttpMethod.GET, cb);
        return this;
    }

    post<T extends ControllerHandlerParamsType, TBody extends RequestBodyType, TRequest extends RequestInterface<T, TBody>>(path: string, cb: ControllerHandler<T, TBody, TRequest>): ControllerInterface {
        this.addRoute(path, HttpMethod.POST, cb);
        return this;
    }

    put<T extends ControllerHandlerParamsType, TBody extends RequestBodyType, TRequest extends RequestInterface<T, TBody>>(path: string, cb: ControllerHandler<T, TBody, TRequest>): ControllerInterface {
        this.addRoute(path, HttpMethod.PUT, cb);
        return this;
    }

    delete<T extends ControllerHandlerParamsType, TBody extends RequestBodyType, TRequest extends RequestInterface<T, TBody>>(path: string, cb: ControllerHandler<T, TBody, TRequest>): ControllerInterface {
        this.addRoute(path, HttpMethod.DELETE, cb);
        return this;
    }

    private addRoute<T extends ControllerHandlerParamsType, TBody extends RequestBodyType, TRequest extends RequestInterface<T, TBody>>(path: string, method: HttpMethod, handler: ControllerHandler<T, TBody, TRequest>): void {
        this.router.add(method, this.getPath(path), handler as ControllerHandler<Record<string, unknown>>);
        this.logger.info(`Handler ${method} ${path} registered`);
    }

    private getPath(path: string): string {
        return this.basePath ? `${this.basePath}/${path}` : path;
    }
}