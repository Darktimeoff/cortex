import { ControllerInterface } from "@/controller";
import { TransportEnum } from "@/logger";
import { MiddlewareExceptionHandlerInterface } from "@/middleware";
import { ProtocolEnum } from "@/protocol";

export interface CortexInterface extends Omit<ControllerInterface<CortexInterface>, 'find' | 'findAllMiddlewareByPath'> {
    listen(port: number, callback?: () => void): CortexInterface;
    close(): CortexInterface;
    add(controller: ControllerInterface): CortexInterface;
    useExceptionFilter(cb: MiddlewareExceptionHandlerInterface): CortexInterface;
}

export interface CortexOptionsInterface {
    protocol: ProtocolEnum;
    logger: TransportEnum;
}