import { TransportConsole } from "./transport-console";
import { TransportSilent } from "./transport-sillent";

describe('Transport', () => {
    describe('TransportConsole', () => {
        let transport: TransportConsole;
        let consoleSpy: jest.SpyInstance;

        beforeEach(() => {
            transport = new TransportConsole();
            consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        });

        afterEach(() => {
            consoleSpy.mockRestore();
        });

        it('should output message to console', () => {
            transport.output('test message');
            expect(consoleSpy).toHaveBeenCalledWith('test message');
        });
    });

    describe('TransportSilent', () => {
        let transport: TransportSilent;
        let consoleSpy: jest.SpyInstance;

        beforeEach(() => {
            transport = new TransportSilent();
            consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        });

        afterEach(() => {
            consoleSpy.mockRestore();
        });

        it('should not output anything', () => {
            transport.output('test message');
            expect(consoleSpy).not.toHaveBeenCalled();
        });
    });
}); 