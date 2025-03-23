import { ProtocolFactory } from './protocol-factory';
import { ProtocolEnum } from './enum/protocol.enum';
import { ControllerRegistry } from '@/controller-registry';
import { HttpProtocol } from './http/http';

describe('ProtocolFactory', () => {
  let registry: ControllerRegistry;

  beforeEach(() => {
    registry = new ControllerRegistry();
  });

  it('should create HTTP protocol instance', () => {
    const protocol = ProtocolFactory.getProtocol(ProtocolEnum.HTTP, registry);
    
    expect(protocol).toBeDefined();
    expect(protocol).toBeInstanceOf(HttpProtocol);
  });

  it('should throw error for unsupported protocol', () => {
    const unknownProtocol = 'websocket' as ProtocolEnum;
    
    expect(() => {
      ProtocolFactory.getProtocol(unknownProtocol, registry);
    }).toThrow('Protocol websocket not found');
  });

  it('should use the same protocol map for all invocations', () => {
    const spy = jest.spyOn(ProtocolFactory['protocols'], 'get');
    
    ProtocolFactory.getProtocol(ProtocolEnum.HTTP, registry);
    ProtocolFactory.getProtocol(ProtocolEnum.HTTP, registry);
    
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(ProtocolEnum.HTTP);

    spy.mockRestore();
  });

  it('should pass registry to protocol constructor', () => {
    const factorySpy = jest.fn().mockImplementation(reg => new HttpProtocol(reg));
    const getMapSpy = jest.spyOn(ProtocolFactory['protocols'], 'get')
      .mockReturnValue(factorySpy);
    
    ProtocolFactory.getProtocol(ProtocolEnum.HTTP, registry);
    
    expect(factorySpy).toHaveBeenCalledWith(registry);
    
    getMapSpy.mockRestore();
  });
}); 