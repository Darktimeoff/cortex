import { MiddlewareExceptionHandlerInterface } from "@/middleware";

export interface ProtocolInterface {
    listen(port: number, callback?: () => void): ProtocolInterface;
    close(): ProtocolInterface;
    useExceptionFilter(cb: MiddlewareExceptionHandlerInterface): ProtocolInterface;
}