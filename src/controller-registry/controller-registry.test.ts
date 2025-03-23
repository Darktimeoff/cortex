import { ControllerRegistry } from './controller-registry';
import { Controller } from '@/controller/controller';
import { HttpMethod } from '@/generic/enum/http-method.enum';

describe('ControllerRegistry', () => {
  let registry: ControllerRegistry;
  let controller: Controller;

  beforeEach(() => {
    registry = new ControllerRegistry();
    controller = new Controller();
    controller.get('/test', jest.fn());
  });

  it('should add controller to registry', () => {
    const result = registry.add(controller);
    
    expect(result).toBe(registry);
  });

  it('should remove controller from registry', () => {
    registry.add(controller);
    const result = registry.remove(controller);
    
    expect(result).toBe(registry);
  });

  it('should find handler in registered controller', () => {
    registry.add(controller);
    
    const result = registry.find('/test', HttpMethod.GET);
    
    expect(result).not.toBeNull();
  });

  it('should return null if handler not found', () => {
    registry.add(controller);
    
    const result = registry.find('/not-exists', HttpMethod.GET);
    
    expect(result).toBeNull();
  });

  it('should find handler in multiple controllers', () => {
    const controller1 = new Controller();
    const controller2 = new Controller();
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    
    controller1.get('/route1', handler1);
    controller2.get('/route2', handler2);
    
    registry.add(controller1);
    registry.add(controller2);
    
    const result1 = registry.find('/route1', HttpMethod.GET);
    const result2 = registry.find('/route2', HttpMethod.GET);
    
    expect(result1?.handler).toBe(handler1);
    expect(result2?.handler).toBe(handler2);
  });

  it('should find handler in multiple controllers with different base paths', () => {
    const controller1 = new Controller('user');
    const controller2 = new Controller('post');
    const handler1 = jest.fn();
    const handler2 = jest.fn();

    controller1.get(':id/subscription', handler1);
    controller2.get(':id/comment', handler2);

    registry.add(controller1);
    registry.add(controller2);
    
    const result1 = registry.find('/user/123/subscription', HttpMethod.GET);
    const result2 = registry.find('/post/123/comment', HttpMethod.GET);

    expect(result1?.handler).toBe(handler1);
    expect(result2?.handler).toBe(handler2);
  })
}); 