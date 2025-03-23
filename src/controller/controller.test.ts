import { Controller } from './controller';
import { HttpMethod } from '@/generic/enum/http-method.enum';

describe('Controller', () => {
  let controller: Controller;

  beforeEach(() => {
    controller = new Controller();
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
}); 