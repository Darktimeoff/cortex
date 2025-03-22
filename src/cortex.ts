import { ControllerRegistry } from './controller-registry/controller-registry';
import { ControllerRegistryInterface } from './controller-registry/controller-registry.interface';
import Controller from './controller/controller';
import { ControllerInterface } from './controller/controller.interface';
import { CortexInterface } from './cortex.interface';
import { ControllerHandler } from './controller/controller.type';
import { ProtocolInterface } from './protocol/protocol.interface';
import { ProtocolEnum } from './protocol/enum/protocol.enum';
import { ProtocolFactory } from './protocol/protocol-factory';

export default class Cortex implements CortexInterface {
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