import { ControllerRegistryInterface } from "@/controller-registry/controller-registry.interface";
import { ProtocolEnum } from "./enum/protocol.enum";
import { HttpProtocol } from "./http/http";
import { ProtocolInterface } from "./protocol.interface";

export class ProtocolFactory {
    private static protocols: Map<ProtocolEnum, (registry: ControllerRegistryInterface) => ProtocolInterface    > = new Map([
        [ProtocolEnum.HTTP, (registry: ControllerRegistryInterface) => new HttpProtocol(registry)]
    ]);

    public static getProtocol(protocol: ProtocolEnum, registry: ControllerRegistryInterface): ProtocolInterface {
        const factory = this.protocols.get(protocol);

        if (!factory) {
            throw new Error(`Protocol ${protocol} not found`);
        }

        return factory(registry);
    }
}
