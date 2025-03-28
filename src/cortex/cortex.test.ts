import { TransportEnum } from '@/logger';
import { Cortex } from './cortex';
import { ProtocolEnum } from '@/protocol';

jest.mock('@/protocol/protocol-factory', () => {
  const mockListen = jest.fn().mockReturnThis();
  return {
    ProtocolFactory: {
      getProtocol: jest.fn().mockReturnValue({
        listen: mockListen
      })
    }
  };
});

// Получаем доступ к моку после его создания
const mockProtocolFactory = jest.requireMock('@/protocol/protocol-factory').ProtocolFactory;
const mockGetProtocol = mockProtocolFactory.getProtocol;

describe('Cortex', () => {
  let cortex: Cortex;

  beforeEach(() => {
    jest.clearAllMocks();
    cortex = new Cortex({protocol: ProtocolEnum.HTTP, logger: TransportEnum.SILENT});
  });

  it('should create an instance of Cortex', () => {
    expect(cortex).toBeInstanceOf(Cortex);
  });

  it('should register GET route', () => {
    const handler = jest.fn();
    const result = cortex.get('/test', handler);
    
    expect(result).toBe(cortex);
  });

  it('should register POST route', () => {
    const handler = jest.fn();
    const result = cortex.post('/test', handler);
    
    expect(result).toBe(cortex);
  });

  it('should register PUT route', () => {
    const handler = jest.fn();
    const result = cortex.put('/test', handler);
    
    expect(result).toBe(cortex);
  });

  it('should register DELETE route', () => {
    const handler = jest.fn();
    const result = cortex.delete('/test', handler);
    
    expect(result).toBe(cortex);
  });

  it('should start server on specified port', () => {
    const callback = jest.fn();
    cortex.listen(3000, callback);
    
    expect(mockGetProtocol).toHaveBeenCalled();
  });

  it('should add middleware', () => {
    const middleware = jest.fn();
    cortex.use(middleware);
    const chain = cortex['router'].findAllMiddlewareByPath('/any-path');
    expect(chain.middlewares).toContain(middleware);
  });

  it('should add middleware with path', () => {
    const path = '/test';
    const middleware = jest.fn();
    cortex.use(path, middleware);
    const chain = cortex['router'].findAllMiddlewareByPath(path);
    expect(chain.middlewares).toContain(middleware);
  });

  it('should return empty array if no middleware', () => {
    const chain = cortex['router'].findAllMiddlewareByPath('/any-path');
    expect(chain.middlewares).toEqual([]);
  });

  it('should find one middleware by path', () => {
    const middleware = jest.fn();
    const middleware2 = jest.fn();
    const middleware3 = jest.fn();
    cortex.use('/test/', middleware);
    cortex.use('/user/', middleware2);
    cortex.use(middleware3);
    const chain = cortex['router'].findAllMiddlewareByPath('/test/');
    expect(chain.middlewares).toContain(middleware);
    expect(chain.middlewares).not.toContain(middleware2);
    expect(chain.middlewares).toContain(middleware3);

    const chain2 = cortex['router'].findAllMiddlewareByPath('/user/');
    expect(chain2.middlewares).not.toContain(middleware);
    expect(chain2.middlewares).toContain(middleware2);
    expect(chain2.middlewares).toContain(middleware3);

    const chain3 = cortex['router'].findAllMiddlewareByPath('/');
    expect(chain3.middlewares).not.toContain(middleware);
    expect(chain3.middlewares).not.toContain(middleware2);
    expect(chain3.middlewares).toContain(middleware3);
  });
  
}); 