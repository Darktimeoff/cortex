import { Logger } from "./logger";
import { LoggerInterface } from "./logger.interface";
import { TransportInterface } from "./transport/transport.interface";
import { TransportEnum } from "./transport/enum/transport.enum";
import { TransportConsole, TransportSilent } from "./transport";

export class LoggerFactory {
    private static transports: Record<TransportEnum, TransportInterface> = {
        [TransportEnum.CONSOLE]: new TransportConsole(),
        [TransportEnum.SILENT]: new TransportSilent(),
    };

    static createLogger(transport: TransportEnum, context?: string): LoggerInterface {
        return new Logger(context, this.transports[transport]);
    }
}
