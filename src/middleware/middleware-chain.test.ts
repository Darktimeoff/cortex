import { MiddlewareChain } from './middleware-chain';
import { RequestInterface } from '@/request';
import { ResponseInterface } from '@/response';
import { MiddlewareHandler } from '@/middleware';

describe('MiddlewareChain', () => {
    let chain: MiddlewareChain;
    let mockReq: RequestInterface;
    let mockRes: ResponseInterface;

    beforeEach(() => {
        chain = new MiddlewareChain([]);
        mockReq = {} as RequestInterface;
        mockRes = {} as ResponseInterface;
    });

    it('should execute middlewares in order', async () => {
        const executionOrder: number[] = [];
        const middleware1: MiddlewareHandler = async (_req, _res, next) => {
            executionOrder.push(1);
            await next();
        };
        const middleware2: MiddlewareHandler = async (_req, _res, next) => {
            executionOrder.push(2);
            await next();
        };

        chain = new MiddlewareChain([middleware1, middleware2]);

        await chain.execute(mockReq, mockRes);

        expect(executionOrder).toEqual([1, 2]);
    });

    it('should stop execution when middleware does not call next', async () => {
        const executionOrder: number[] = [];
        const middleware1: MiddlewareHandler = async (_req, _res, next) => {
            executionOrder.push(1);
            await next();
        };
        const middleware2: MiddlewareHandler = async (_req, _res) => {
            executionOrder.push(2);
        };
        const middleware3: MiddlewareHandler = async (_req, _res, next) => {
            executionOrder.push(3);
            await next();
        };

        chain = new MiddlewareChain([middleware1, middleware2, middleware3]);

        await chain.execute(mockReq, mockRes);

        expect(executionOrder).toEqual([1, 2]);
    });

    it('should handle empty middleware chain', async () => {
        await expect(chain.execute(mockReq, mockRes)).resolves.not.toThrow();
    });

    it('should handle undefined middleware return', async () => {
        let modifiedReq = false;
        
        // Create middleware array with a null item to simulate shift returning null
        const middlewareArray = [
            async (req: RequestInterface, _res: ResponseInterface, next: () => Promise<void>) => {
                // @ts-ignore
                req.modified = true;
                modifiedReq = true;
                await next();
            }
        ];
        
        // Manipulate the array to make shift return undefined in the middle of execution
        const originalShift = Array.prototype.shift;
        // @ts-ignore
        middlewareArray.shift = function() {
            // After first call, restore original and make it return undefined
            // @ts-ignore
            this.shift = function() { return undefined; };
            return originalShift.apply(this);
        };
        
        chain = new MiddlewareChain(middlewareArray as MiddlewareHandler[]);
        
        await chain.execute(mockReq, mockRes);
        
        expect(modifiedReq).toBe(true);
    });
}); 