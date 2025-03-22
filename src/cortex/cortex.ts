import { ProtocolEnum } from "@/protocol/enum/protocol.enum";
import { ProtocolFactory, ProtocolInterface } from "@/protocol";
import { CortexInterface } from "./cortex.interface";
import { Controller, ControllerInterface } from "@/controller";
import { ControllerRegistry, ControllerRegistryInterface } from "@/controller-registry";
import { ControllerHandler } from "@/controller";


export class Cortex implements CortexInterface {
    private protocol: ProtocolInterface;
    private router: ControllerInterface;
    private registry: ControllerRegistryInterface;

    constructor(protocol: ProtocolEnum = ProtocolEnum.HTTP) {
        this.router = new Controller();
        this.registry = new ControllerRegistry();
        this.registry.add(this.router);
        this.protocol = ProtocolFactory.getProtocol(protocol, this.registry);
    }

    get(path: string, cb: ControllerHandler): CortexInterface {
        this.router.get(path, cb);
        return this;
    }

    post(path: string, cb: ControllerHandler): CortexInterface {
        this.router.post(path, cb);
        return this;
    }

    put(path: string, cb: ControllerHandler): CortexInterface {
        this.router.put(path, cb);
        return this;
    }

    delete(path: string, cb: ControllerHandler): CortexInterface {
        this.router.delete(path, cb);
        return this;
    }

    listen(port: number, callback?: () => void) {
        this.protocol.listen(port, callback)
        return this;
    }
}