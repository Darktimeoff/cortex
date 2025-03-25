import { ProtocolFactory } from './protocol-factory';
import { ProtocolEnum } from './enum/protocol.enum';
import { ControllerRegistry } from '@/controller-registry';
import { HttpProtocol } from './http/http';
import { ParserFactory, ParserFactoryInterface } from '@/parser';
import { Logger, LoggerInterface, TransportSilent } from '@/logger';

describe('ProtocolFactory', () => {
  let registry: ControllerRegistry;
  let parserFactory: ParserFactoryInterface;
  let logger: LoggerInterface;

  beforeEach(() => {
    registry = new ControllerRegistry();
    parserFactory = new ParserFactory();
    logger = new Logger(undefined, new TransportSilent());
  });

  it('should create HTTP protocol instance', () => {
    const protocol = ProtocolFactory.getProtocol(ProtocolEnum.HTTP, registry, parserFactory, logger);
    
    expect(protocol).toBeDefined();
    expect(protocol).toBeInstanceOf(HttpProtocol);
  });

  it('should throw error for unsupported protocol', () => {
    const unknownProtocol = 'websocket' as ProtocolEnum;
    
    expect(() => {
      ProtocolFactory.getProtocol(unknownProtocol, registry, parserFactory, logger);
    }).toThrow('Protocol websocket not found');
  });

  it('should use the same protocol map for all invocations', () => {
    const spy = jest.spyOn(ProtocolFactory['protocols'], 'get');
    
    ProtocolFactory.getProtocol(ProtocolEnum.HTTP, registry, parserFactory, logger);
    ProtocolFactory.getProtocol(ProtocolEnum.HTTP, registry, parserFactory, logger);
    
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(ProtocolEnum.HTTP);

    spy.mockRestore();
  });

  it('should pass registry to protocol constructor', () => {
    const factorySpy = jest.fn().mockImplementation((reg, parserFactory, logger) => new HttpProtocol(reg, parserFactory, logger));
    const getMapSpy = jest.spyOn(ProtocolFactory['protocols'], 'get')
      .mockReturnValue(factorySpy);
    
    ProtocolFactory.getProtocol(ProtocolEnum.HTTP, registry, parserFactory, logger);
    
    expect(factorySpy).toHaveBeenCalledWith(registry, parserFactory, logger);
    
    getMapSpy.mockRestore();
  });
}); 