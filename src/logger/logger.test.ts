import { Logger } from './logger';
import { TransportConsole } from './transport/transport-console';
import { TransportSilent } from './transport/transport-sillent';

describe('Logger', () => {
    let consoleTransport: TransportConsole;
    let silentTransport: TransportSilent;
    let logger: Logger;

    beforeEach(() => {
        consoleTransport = new TransportConsole();
        silentTransport = new TransportSilent();
        logger = new Logger('test-context', consoleTransport);
    });

    it('should format message with context', () => {
        const spy = jest.spyOn(consoleTransport, 'output');
        logger.info('test message');
        
        expect(spy).toHaveBeenCalledWith(expect.stringMatching(/\[.*\] INFO test-contexttest message/));
    });

    it('should format message without context', () => {
        logger = new Logger(undefined, consoleTransport);
        const spy = jest.spyOn(consoleTransport, 'output');
        logger.info('test message');
        
        expect(spy).toHaveBeenCalledWith(expect.stringMatching(/\[.*\] INFO test message/));
    });

    it('should log info message', () => {
        const spy = jest.spyOn(consoleTransport, 'output');
        logger.info('test message');
        
        expect(spy).toHaveBeenCalledWith(expect.stringMatching(/INFO.*test message/));
    });

    it('should log error message', () => {
        const spy = jest.spyOn(consoleTransport, 'output');
        logger.error('test message');
        
        expect(spy).toHaveBeenCalledWith(expect.stringMatching(/ERROR.*test message/));
    });

    it('should log warn message', () => {
        const spy = jest.spyOn(consoleTransport, 'output');
        logger.warn('test message');
        
        expect(spy).toHaveBeenCalledWith(expect.stringMatching(/WARN.*test message/));
    });

    it('should log debug message', () => {
        const spy = jest.spyOn(consoleTransport, 'output');
        logger.debug('test message');
        
        expect(spy).toHaveBeenCalledWith(expect.stringMatching(/DEBUG.*test message/));
    });

    it('should log fatal message', () => {
        const spy = jest.spyOn(consoleTransport, 'output');
        logger.fatal('test message');
        
        expect(spy).toHaveBeenCalledWith(expect.stringMatching(/FATAL.*test message/));
    });

    it('should not output anything with silent transport', () => {
        logger = new Logger('test-context', silentTransport);
        const spy = jest.spyOn(silentTransport, 'output');
        
        logger.info('test message');
        logger.error('test message');
        logger.warn('test message');
        logger.debug('test message');
        logger.fatal('test message');
        
        expect(spy).toHaveBeenCalledTimes(5);
    });
}); 