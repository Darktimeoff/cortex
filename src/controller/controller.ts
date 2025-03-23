import { HttpMethod } from "@/generic/enum/http-method.enum";
import { ControllerFindResultInterface, ControllerInterface } from "./controller.interface";
import { ControllerHandler, ControllerHandlerParamsType } from "./controller.type";
import { Memoirist } from 'memoirist'
import { RequestBodyType } from "@/request/request.type";
export class Controller implements ControllerInterface {
    private readonly router: Memoirist<ControllerHandler<ControllerHandlerParamsType, RequestBodyType>>

    constructor(
        private readonly basePath?: string
    ) {
        this.router = new Memoirist<ControllerHandler<ControllerHandlerParamsType, RequestBodyType>>();
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

    get<T extends ControllerHandlerParamsType, TBody extends RequestBodyType>(path: string, cb: ControllerHandler<T, TBody>): ControllerInterface {
        this.addRoute(path, HttpMethod.GET, cb);
        return this;
    }

    post<T extends ControllerHandlerParamsType, TBody extends RequestBodyType>(path: string, cb: ControllerHandler<T, TBody>): ControllerInterface {
        this.addRoute(path, HttpMethod.POST, cb);
        return this;
    }

    put<T extends ControllerHandlerParamsType, TBody extends RequestBodyType>(path: string, cb: ControllerHandler<T, TBody>): ControllerInterface {
        this.addRoute(path, HttpMethod.PUT, cb);
        return this;
    }

    delete<T extends ControllerHandlerParamsType, TBody extends RequestBodyType>(path: string, cb: ControllerHandler<T, TBody>): ControllerInterface {
        this.addRoute(path, HttpMethod.DELETE, cb);
        return this;
    }

    private addRoute<T extends ControllerHandlerParamsType, TBody extends RequestBodyType>(path: string, method: HttpMethod, handler: ControllerHandler<T, TBody>): void {
        this.router.add(method, this.getPath(path), handler as ControllerHandler<Record<string, unknown>>);
    }

    private getPath(path: string): string {
        return this.basePath ? `${this.basePath}/${path}` : path;
    }
}