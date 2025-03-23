import { ControllerRegistryInterface } from "@/controller-registry/controller-registry.interface";
import { ProtocolEnum } from "./enum/protocol.enum";
import { HttpProtocol } from "./http/http";
import { ProtocolInterface } from "./protocol.interface";
import { ParserFactoryInterface } from "@/parser";

export class ProtocolFactory {
    private static protocols: Map<ProtocolEnum, (registry: ControllerRegistryInterface, parserFactory: ParserFactoryInterface) => ProtocolInterface    > = new Map([
        [ProtocolEnum.HTTP, (registry: ControllerRegistryInterface, parserFactory: ParserFactoryInterface) => new HttpProtocol(registry, parserFactory)]
    ]);

    public static getProtocol(protocol: ProtocolEnum, registry: ControllerRegistryInterface, parserFactory: ParserFactoryInterface): ProtocolInterface {
        const factory = this.protocols.get(protocol);

        if (!factory) {
            throw new Error(`Protocol ${protocol} not found`);
        }

        return factory(registry, parserFactory);
    }
}
