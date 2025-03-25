import { LoggerLevelEnum } from "./enum/logger-level.enum";
import { LoggerInterface } from "./logger.interface";
import { TransportSilent } from "./transport/transport-sillent";
import { TransportInterface } from "./transport/transport.interface";

export class Logger implements LoggerInterface {
    constructor(
        private readonly context: string = '',
        private readonly transport: TransportInterface = new TransportSilent()
    ) {}

    info(message: string): void {
        this.output(LoggerLevelEnum.INFO, message);
    }
    error(message: string): void {
        this.output(LoggerLevelEnum.ERROR, message);
    }
    warn(message: string): void {
        this.output(LoggerLevelEnum.WARN, message);
    }

    debug(message: string): void {
        this.output(LoggerLevelEnum.DEBUG, message);
    }

    fatal(message: string): void {
        this.output(LoggerLevelEnum.FATAL, message);
    }

    private output(level: LoggerLevelEnum, message: string): void {
        this.transport.output(this.formatMessage(level, message));
    }

    private formatMessage(level: LoggerLevelEnum, message: string): string {
        return `\n${this.getDate()} ${level.toUpperCase()} ${this.context}${message}`;
    }

    private getDate(): string {
        return `[${new Date().toISOString()}]`;
    }
}
