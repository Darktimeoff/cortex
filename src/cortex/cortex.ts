import { ProtocolEnum } from "@/protocol";
import { ProtocolFactory, ProtocolInterface } from "@/protocol";
import { CortexInterface } from "./cortex.interface";
import { Controller, ControllerHandlerParamsType, ControllerInterface } from "@/controller";
import { ControllerRegistry, ControllerRegistryInterface } from "@/controller-registry";
import { ControllerHandler } from "@/controller";       
import { RequestBodyType, RequestInterface } from "@/request";
import { ParserFactory, ParserFactoryInterface } from "@/parser";
import { MiddlewareHandler } from "@/middleware";

export class Cortex implements CortexInterface {
    private protocol: ProtocolInterface;
    private router: ControllerInterface;
    private registry: ControllerRegistryInterface;
    private parserFactory: ParserFactoryInterface;
    constructor(protocol: ProtocolEnum = ProtocolEnum.HTTP) {
        this.router = new Controller();
        this.registry = new ControllerRegistry();
        this.parserFactory = new ParserFactory();
        this.registry.add(this.router);
        this.protocol = ProtocolFactory.getProtocol(protocol, this.registry, this.parserFactory);
    }

    get<T extends ControllerHandlerParamsType, TBody extends RequestBodyType, TRequest extends RequestInterface<T, TBody>>(path: string, cb: ControllerHandler<T, TBody, TRequest>): CortexInterface {
        this.router.get(path, cb);
        return this;
    }

    post<T extends ControllerHandlerParamsType, TBody extends RequestBodyType, TRequest extends RequestInterface<T, TBody>>(path: string, cb: ControllerHandler<T, TBody, TRequest>): CortexInterface {
        this.router.post(path, cb);
        return this;
    }

    put<T extends ControllerHandlerParamsType, TBody extends RequestBodyType, TRequest extends RequestInterface<T, TBody>>(path: string, cb: ControllerHandler<T, TBody, TRequest>): CortexInterface {
        this.router.put(path, cb);
        return this;
    }

    delete<T extends ControllerHandlerParamsType, TBody extends RequestBodyType, TRequest extends RequestInterface<T, TBody>>(path: string, cb: ControllerHandler<T, TBody, TRequest>): CortexInterface {
        this.router.delete(path, cb);
        return this;
    }

    add(controller: ControllerInterface): CortexInterface {
        this.registry.add(controller);
        return this;
    }

    use<D extends RequestInterface = RequestInterface>(pathOrHandler: string | MiddlewareHandler<D>, handler?: MiddlewareHandler<D>): CortexInterface {
        this.router.use(pathOrHandler, handler);
        return this;
    }

    listen(port: number, callback?: () => void): CortexInterface {
        this.protocol.listen(port, callback)
        return this;
    }

    close(): CortexInterface {
        this.protocol.close();
        return this;
    }
}