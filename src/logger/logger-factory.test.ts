import { LoggerFactory } from './logger-factory';
import { Logger } from './logger';
import { TransportEnum } from './transport/enum/transport.enum';

describe('LoggerFactory', () => {
    it('should create logger with console transport', () => {
        const logger = LoggerFactory.createLogger(TransportEnum.CONSOLE);
        expect(logger).toBeInstanceOf(Logger);
    });

    it('should create logger with silent transport', () => {
        const logger = LoggerFactory.createLogger(TransportEnum.SILENT);
        expect(logger).toBeInstanceOf(Logger);
    });

    it('should create logger with context', () => {
        const logger = LoggerFactory.createLogger(TransportEnum.SILENT, 'test-context');
        expect(logger).toBeInstanceOf(Logger);
    });
}); 