import { TransportEnum } from '@/logger';
import { Controller } from './controller';
import { HttpMethod } from '@/generic/enum/http-method.enum';

describe('Controller', () => {
  let controller: Controller;

  beforeEach(() => {
    controller = new Controller(undefined, TransportEnum.SILENT);
  });

  it('should register and find GET route', () => {
    const handler = jest.fn();
    controller.get('/test', handler);
    
    const result = controller.find('/test', HttpMethod.GET);
    
    expect(result).not.toBeNull();
    expect(result?.handler).toBe(handler);
  });

  it('should register and find POST route', () => {
    const handler = jest.fn();
    controller.post('/test', handler);
    
    const result = controller.find('/test', HttpMethod.POST);
    
    expect(result).not.toBeNull();
    expect(result?.handler).toBe(handler);
  });

  it('should register and find PUT route', () => {
    const handler = jest.fn();
    controller.put('/test', handler);
    
    const result = controller.find('/test', HttpMethod.PUT);
    
    expect(result).not.toBeNull();
    expect(result?.handler).toBe(handler);
  });

  it('should register and find DELETE route', () => {
    const handler = jest.fn();
    controller.delete('/test', handler);
    
    const result = controller.find('/test', HttpMethod.DELETE);
    
    expect(result).not.toBeNull();
    expect(result?.handler).toBe(handler);
  });

  it('should return null if route not found', () => {
    const result = controller.find('/not-exists', HttpMethod.GET);
    
    expect(result).toBeNull();
  });

  it('should handle URL parameters correctly', () => {
    const handler = jest.fn();
    controller.get('/user/:id', handler);
    
    const result = controller.find('/user/123', HttpMethod.GET);
    
    expect(result).not.toBeNull();
    expect(result?.handler).toBe(handler);
    expect(result?.params).toEqual({ id: '123' });
  });

  it('should handle multiple URL parameters', () => {
    const handler = jest.fn();
    controller.get('/user/:id/post/:postId', handler);
    
    const result = controller.find('/user/123/post/456', HttpMethod.GET);
    
    expect(result).not.toBeNull();
    expect(result?.handler).toBe(handler);
    expect(result?.params).toEqual({ id: '123', postId: '456' });
  });

  it('should handle base path', () => {
    const controller = new Controller('user', TransportEnum.SILENT);
    const handler = jest.fn();
    controller.get('', handler);

    const result = controller.find('/user/', HttpMethod.GET);
    
    expect(result).not.toBeNull();
    expect(result?.handler).toBe(handler);
    expect(result?.params).toEqual({});

    controller.get(':id', handler);

    const result2 = controller.find('/user/123', HttpMethod.GET);
    expect(result2).not.toBeNull();
    expect(result2?.handler).toBe(handler);
    expect(result2?.params).toEqual({ id: '123' });
  });

  it('should add middleware', () => {
    const middleware = jest.fn();
    controller.use(middleware);
    const chain = controller.findAllMiddlewareByPath('/any-path');
    expect(chain.middlewares).toContain(middleware);
  });

  it('should add middleware with path', () => {
    const path = '/test';
    const middleware = jest.fn();
    controller.use(path, middleware);
    const chain = controller.findAllMiddlewareByPath(path);
    expect(chain.middlewares).toContain(middleware);
  });

  it('should return empty array if no middleware', () => {
    const chain = controller.findAllMiddlewareByPath('/any-path');
    expect(chain.middlewares).toEqual([]);
  });

  it('should find one middleware by path', () => {
    const middleware = jest.fn();
    const middleware2 = jest.fn();
    const middleware3 = jest.fn();
    controller.use('/test/', middleware);
    controller.use('/user/', middleware2);
    controller.use(middleware3);
    const chain = controller.findAllMiddlewareByPath('/test/');
    expect(chain.middlewares).toContain(middleware);
    expect(chain.middlewares).not.toContain(middleware2);
    expect(chain.middlewares).toContain(middleware3);

    const chain2 = controller.findAllMiddlewareByPath('/user/');
    expect(chain2.middlewares).not.toContain(middleware);
    expect(chain2.middlewares).toContain(middleware2);
    expect(chain2.middlewares).toContain(middleware3);

    const chain3 = controller.findAllMiddlewareByPath('/');
    expect(chain3.middlewares).not.toContain(middleware);
    expect(chain3.middlewares).not.toContain(middleware2);
    expect(chain3.middlewares).toContain(middleware3);
  });
  
}); 