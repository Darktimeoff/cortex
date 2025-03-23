import { ProtocolFactory } from './protocol-factory';
import { ProtocolEnum } from './enum/protocol.enum';
import { ControllerRegistry } from '@/controller-registry';
import { HttpProtocol } from './http/http';
import { ParserFactory, ParserFactoryInterface } from '@/parser';

describe('ProtocolFactory', () => {
  let registry: ControllerRegistry;
  let parserFactory: ParserFactoryInterface;

  beforeEach(() => {
    registry = new ControllerRegistry();
    parserFactory = new ParserFactory();
  });

  it('should create HTTP protocol instance', () => {
    const protocol = ProtocolFactory.getProtocol(ProtocolEnum.HTTP, registry, parserFactory);
    
    expect(protocol).toBeDefined();
    expect(protocol).toBeInstanceOf(HttpProtocol);
  });

  it('should throw error for unsupported protocol', () => {
    const unknownProtocol = 'websocket' as ProtocolEnum;
    
    expect(() => {
      ProtocolFactory.getProtocol(unknownProtocol, registry, parserFactory);
    }).toThrow('Protocol websocket not found');
  });

  it('should use the same protocol map for all invocations', () => {
    const spy = jest.spyOn(ProtocolFactory['protocols'], 'get');
    
    ProtocolFactory.getProtocol(ProtocolEnum.HTTP, registry, parserFactory);
    ProtocolFactory.getProtocol(ProtocolEnum.HTTP, registry, parserFactory);
    
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(ProtocolEnum.HTTP);

    spy.mockRestore();
  });

  it('should pass registry to protocol constructor', () => {
    const factorySpy = jest.fn().mockImplementation((reg, parserFactory) => new HttpProtocol(reg, parserFactory));
    const getMapSpy = jest.spyOn(ProtocolFactory['protocols'], 'get')
      .mockReturnValue(factorySpy);
    
    ProtocolFactory.getProtocol(ProtocolEnum.HTTP, registry, parserFactory);
    
    expect(factorySpy).toHaveBeenCalledWith(registry, parserFactory);
    
    getMapSpy.mockRestore();
  });
}); 