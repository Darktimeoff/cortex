import { RequestInterface } from "@/request";
import { MiddlewareHandler } from "./middleware.type";
import { ResponseInterface } from "@/response";
import { MiddlewareChainInterface } from "./middleware-chain.interface";

export class MiddlewareChain implements MiddlewareChainInterface {
    constructor(
        private readonly _middlewares: Array<MiddlewareHandler>
    ) {}

    get middlewares(): Array<MiddlewareHandler> {
        return this._middlewares;
    }

    async execute(req: RequestInterface, res: ResponseInterface): Promise<void> {
        const next = async () => {
            if (this.middlewares.length === 0) {
                return;
            }

            const middleware = this.middlewares.shift();
            if (!middleware) {
                return;
            }

            await middleware(req, res, next);
        };

        await next();
    }
}