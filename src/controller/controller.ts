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
import { ValidationRequestSchemaInterface } from "@/validation";

export class Controller implements ControllerInterface {
    private readonly router: Memoirist<ControllerHandler<ControllerHandlerParamsType, RequestBodyType>>
    private readonly middlewareRegistry: MiddlewareRegistryInterface;
    private readonly logger: LoggerInterface;
    private readonly handlerSchema: Map<ControllerHandler<ControllerHandlerParamsType, RequestBodyType>, ValidationRequestSchemaInterface> = new Map();

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
            params: result.params,
            schema: this.handlerSchema.get(result.store)
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

    get<T extends ControllerHandlerParamsType, TBody extends RequestBodyType, TRequest extends RequestInterface<T, TBody>>(path: string, cb: ControllerHandler<T, TBody, TRequest>, schema?: ValidationRequestSchemaInterface): ControllerInterface {
        this.addRoute(path, HttpMethod.GET, cb, schema);
        return this;
    }

    post<T extends ControllerHandlerParamsType, TBody extends RequestBodyType, TRequest extends RequestInterface<T, TBody>>(path: string, cb: ControllerHandler<T, TBody, TRequest>, schema?: ValidationRequestSchemaInterface): ControllerInterface {
        this.addRoute(path, HttpMethod.POST, cb, schema);
        return this;
    }

    put<T extends ControllerHandlerParamsType, TBody extends RequestBodyType, TRequest extends RequestInterface<T, TBody>>(path: string, cb: ControllerHandler<T, TBody, TRequest>, schema?: ValidationRequestSchemaInterface): ControllerInterface {
        this.addRoute(path, HttpMethod.PUT, cb, schema);
        return this;
    }

    delete<T extends ControllerHandlerParamsType, TBody extends RequestBodyType, TRequest extends RequestInterface<T, TBody>>(path: string, cb: ControllerHandler<T, TBody, TRequest>, schema?: ValidationRequestSchemaInterface): ControllerInterface {
        this.addRoute(path, HttpMethod.DELETE, cb, schema);
        return this;
    }

    private addRoute<T extends ControllerHandlerParamsType, TBody extends RequestBodyType, TRequest extends RequestInterface<T, TBody>>(path: string, method: HttpMethod, handler: ControllerHandler<T, TBody, TRequest>, schema?: ValidationRequestSchemaInterface): void {
        this.router.add(method, this.getPath(path), handler as ControllerHandler<Record<string, unknown>>);
        this.logger.info(`Handler ${method} ${path} registered`);
        if (schema) {
            this.handlerSchema.set(handler as ControllerHandler<Record<string, unknown>>, schema);
        }
    }

    private getPath(path: string): string {
        return this.basePath ? `${this.basePath}/${path}` : path;
    }
}