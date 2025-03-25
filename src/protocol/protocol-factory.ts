import { ControllerRegistryInterface } from "@/controller-registry/controller-registry.interface";
import { ProtocolEnum } from "./enum/protocol.enum";
import { HttpProtocol } from "./http/http";
import { ProtocolInterface } from "./protocol.interface";
import { ParserFactoryInterface } from "@/parser";
import { ProtocolFactoryCreateType } from "./protocol.type";
import { LoggerInterface } from "@/logger";
export class ProtocolFactory {
    private static protocols: Map<ProtocolEnum, ProtocolFactoryCreateType> = new Map([
        [ProtocolEnum.HTTP, 
            (registry: ControllerRegistryInterface, 
                parserFactory: ParserFactoryInterface,
                logger: LoggerInterface,
            ) => new HttpProtocol(registry, parserFactory, logger)]
    ]);

    public static getProtocol(
        protocol: ProtocolEnum, 
        registry: ControllerRegistryInterface, 
        parserFactory: ParserFactoryInterface,
        logger: LoggerInterface
    ): ProtocolInterface {
        const factory = this.protocols.get(protocol);

        if (!factory) {
            throw new Error(`Protocol ${protocol} not found`);
        }

        return factory(registry, parserFactory, logger);
    }
}
