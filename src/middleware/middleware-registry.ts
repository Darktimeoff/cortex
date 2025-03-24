import { RequestInterface } from "@/request";
import { MiddlewareChain } from "./middleware-chain";
import { MiddlewareChainInterface } from "./middleware-chain.interface";
import { MiddlewareRegistryInterface } from "./middleware-registry.interface";
import { MiddlewareHandler } from "./middleware.type";

export class MiddlewareRegistry implements MiddlewareRegistryInterface {
    private middlewares: Array<{ path: string; handler: MiddlewareHandler<RequestInterface> }> = [];

    use<D extends RequestInterface>(
        pathOrHandler: string | MiddlewareHandler<D>,
        handler?: MiddlewareHandler<D>
    ): MiddlewareRegistryInterface {
        if (typeof pathOrHandler === 'function') {
            this.middlewares.push({ path: '/', handler: pathOrHandler as MiddlewareHandler<RequestInterface> });
        } else {
            if (!handler) throw new Error('Handler is required when path is provided');
            this.middlewares.push({ path: pathOrHandler, handler: handler as MiddlewareHandler<RequestInterface> });
        }

        return this;
    }

    remove(middleware: MiddlewareHandler): MiddlewareRegistryInterface {
        this.middlewares = this.middlewares.filter(m => m.handler !== middleware);
        return this;
    }

    getByPath(path: string): MiddlewareChainInterface {
        const middlewares = this.middlewares.filter(m => path.startsWith(m.path) || m.path === '/').map(m => m.handler);
    
        return new MiddlewareChain(middlewares);
    }
}
