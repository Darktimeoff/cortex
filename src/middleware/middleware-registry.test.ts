import { MiddlewareRegistry } from './middleware-registry';
import { MiddlewareHandler } from '@/middleware';

describe('MiddlewareRegistry', () => {
    let registry: MiddlewareRegistry;
    let mockMiddleware: MiddlewareHandler;

    beforeEach(() => {
        registry = new MiddlewareRegistry();
        mockMiddleware = jest.fn();
    });

    it('should add middleware with path', () => {
        const path = '/test';
        registry.use(path, mockMiddleware);
        const chain = registry.getByPath(path);
        expect(chain.middlewares).toContain(mockMiddleware);
    });

    it('should add middleware without path', () => {
        registry.use(mockMiddleware);
        const chain = registry.getByPath('/any-path');
        expect(chain.middlewares).toContain(mockMiddleware);
    });

    it('should throw error when path is provided but handler is not', () => {
        expect(() => registry.use('/test')).toThrow('Handler is required when path is provided');
    });

    it('should remove middleware', () => {
        registry.use(mockMiddleware);
        registry.remove(mockMiddleware);
        const chain = registry.getByPath('/any-path');
        expect(chain.middlewares).not.toContain(mockMiddleware);
    });

    it('should return middlewares matching path', () => {
        const path1 = '/test';
        const path2 = '/test/sub';
        const middleware1 = jest.fn();
        const middleware2 = jest.fn();
        const middleware3 = jest.fn();

        registry.use(path1, middleware1);
        registry.use(path2, middleware2);
        registry.use(middleware3);

        const chain = registry.getByPath(path2);
        expect(chain.middlewares).toContain(middleware1);
        expect(chain.middlewares).toContain(middleware2);
        expect(chain.middlewares).toContain(middleware3);
    });
}); 