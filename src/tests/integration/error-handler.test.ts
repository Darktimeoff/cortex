import supertest from 'supertest';
import { Cortex, CortexInterface } from '@/cortex';
import { RequestInterface } from '@/request';
import { ValidationError } from '@/validation';
import TestAgent from 'supertest/lib/agent';
import { ProtocolEnum } from '@/protocol';
import { TransportEnum } from '@/logger';

const port = 4000;

class HttpError extends Error {
  constructor(
    message: string, 
    public readonly statusCode: number = 500,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

describe('Error Handler Integration Tests', () => {
    let cortex: CortexInterface;
    let request: TestAgent;

    beforeAll(async () => {
        cortex = new Cortex({protocol: ProtocolEnum.HTTP, logger: TransportEnum.SILENT});
        cortex.listen(port);
        request = supertest(`http://localhost:${port}`);
    });

    afterAll(async () => {
        cortex.close();
    });

    it('should handle uncaught errors with global exception handler', async () => {
        cortex.useExceptionFilter((error, _req, _res) => {
            return {
                handled: true,
                error: error.name,
                message: error.message
            };
        });

        // Маршрут который выбрасывает ошибку
        cortex.get('/error-test', () => {
            throw new Error('Test error');
        });

        const response = await request.get('/error-test');
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            handled: true,
            error: 'Error',
            message: 'Test error'
        });
    });

    it('should handle HttpError with proper status code', async () => {
        cortex.get('/not-found', () => {
            throw new HttpError('Resource not found', 404, { resourceId: '123' });
        });

        const response = await request.get('/not-found');
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            handled: true,
            error: 'HttpError',
            message: 'Resource not found'
        });
    });

    it('should handle ValidationError', async () => {
        cortex.post('/validate', () => {
            throw new ValidationError('Validation failed', [
                { path: 'email', message: 'Invalid email format' }
            ]);
        });

        const response = await request.post('/validate');
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            handled: true,
            error: 'Error',
            message: 'Validation failed'
        });
    });

    it('should allow setting custom status code in exception handler', async () => {
        const customCortex = new Cortex({protocol: ProtocolEnum.HTTP, logger: TransportEnum.SILENT});
        customCortex.listen(port + 1);
        const customRequest = supertest(`http://localhost:${port + 1}`);

        customCortex.useExceptionFilter((error, _req, res) => {
            if (error instanceof HttpError) {
                res.statusCode = error.statusCode;
            } else {
                res.statusCode = 500;
            }
            
            return {
                error: error.name,
                message: error.message
            };
        });

        customCortex.get('/forbidden', () => {
            throw new HttpError('Access denied', 403);
        });

        const response = await customRequest.get('/forbidden');
        
        expect(response.status).toBe(403);
        expect(response.body).toEqual({
            error: 'HttpError',
            message: 'Access denied'
        });

        customCortex.close();
    });

    it('should access request data in exception handler', async () => {
        const testCortex = new Cortex({protocol: ProtocolEnum.HTTP, logger: TransportEnum.SILENT});
        testCortex.listen(port + 2);
        const testRequest = supertest(`http://localhost:${port + 2}`);

        testCortex.useExceptionFilter((error, req, _res) => {
            return {
                error: error.message,
                path: req.url,
                method: req.method
            };
        });

        testCortex.get('/with-request-data', (req: RequestInterface) => {
            throw new Error(`Error in ${req.params.id || 'root'} path`);
        });

        const response = await testRequest.get('/with-request-data');
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            error: 'Error in root path',
            path: '/with-request-data',
            method: 'GET'
        });

        testCortex.close();
    });

    it('should handle async errors', async () => {
        const asyncCortex = new Cortex({protocol: ProtocolEnum.HTTP, logger: TransportEnum.SILENT});
        asyncCortex.listen(port + 3);
        const asyncRequest = supertest(`http://localhost:${port + 3}`);

        asyncCortex.useExceptionFilter((error, _req, _res) => {
            return {
                async: true,
                error: error.message
            };
        });

        asyncCortex.get('/async-error', async () => {
            return new Promise((_resolve, reject) => {
                setTimeout(() => {
                    reject(new Error('Async operation failed'));
                }, 10);
            });
        });

        const response = await asyncRequest.get('/async-error');
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            async: true,
            error: 'Async operation failed'
        });

        asyncCortex.close();
    });
}); 