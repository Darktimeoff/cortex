import { ControllerRegistryInterface } from "@/controller-registry";
import { ParserFactoryInterface } from "@/parser";
import { ProtocolInterface } from "./protocol.interface";
import { LoggerInterface } from "@/logger";

export type ProtocolFactoryCreateType = (
    registry: ControllerRegistryInterface,
    parserFactory: ParserFactoryInterface,
    logger: LoggerInterface
) => ProtocolInterface;