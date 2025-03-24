import { HttpMethod } from "@/generic/enum/http-method.enum";
import { ControllerFindResultInterface, ControllerInterface } from "./controller.interface";
import { ControllerHandler, ControllerHandlerParamsType } from "./controller.type";
import { Memoirist } from 'memoirist'
import { RequestBodyType } from "@/request/request.type";
import { MiddlewareChainInterface, MiddlewareHandler, MiddlewareRegistryInterface } from "@/middleware";
import { MiddlewareRegistry } from "@/middleware";
import { RequestInterface } from "@/request";

export class Controller implements ControllerInterface {
    private readonly router: Memoirist<ControllerHandler<ControllerHandlerParamsType, RequestBodyType>>
    private readonly middlewareRegistry: MiddlewareRegistryInterface;

    constructor(
        private readonly basePath?: string
    ) {
        this.router = new Memoirist<ControllerHandler<ControllerHandlerParamsType, RequestBodyType>>();
        this.middlewareRegistry = new MiddlewareRegistry();
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
    }

    private getPath(path: string): string {
        return this.basePath ? `${this.basePath}/${path}` : path;
    }
}