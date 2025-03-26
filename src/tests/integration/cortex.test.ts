import supertest from 'supertest';
import { Cortex, CortexInterface } from '@/cortex';
import { RequestInterface } from '@/request';
import { Controller } from '@/controller';
import TestAgent from 'supertest/lib/agent';
import { ProtocolEnum } from '@/protocol';
import { TransportEnum } from '@/logger';

const port = 2000;

describe('Cortex Integration Tests', () => {
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

    it('should have correct headers', async () => {
        cortex.get('/test', () => ({ success: true }));
        cortex.get('/plain', () => 'Hello, World!');
        const response = await request.get('/test');
        
        expect(response.status).toBe(200);
        expect(response.headers['powered-by']).toBe('Cortex');
        expect(response.headers['content-type']).toBe('application/json')
        
        const plainResponse = await request.get('/plain');
        expect(plainResponse.status).toBe(200);
        expect(plainResponse.headers['powered-by']).toBe('Cortex');
        expect(plainResponse.headers['content-type']).toBe('text/plain');
    });

    it('should handle dynamic routes', async () => {
        cortex.get('/test/:id', (req: RequestInterface<{ id: string }>) => ({ success: true, id: req.params.id }));
        const response = await request.get('/test/123');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true, id: '123' });
        cortex.get('/test/:id/user/:name', (req: RequestInterface<{ id: string, name: string }>) => ({ success: true, id: req.params.id, name: req.params.name }));
        const response2 = await request.get('/test/123/user/John');
        expect(response2.status).toBe(200);
        expect(response2.body).toEqual({ success: true, id: '123', name: 'John' });
    });

    it('could add routes from other controllers', async () => {
        const otherController = new Controller('other', TransportEnum.SILENT);
        otherController.get('test/:id', (req: RequestInterface<{ id: string }>) => ({ success: true, id: req.params.id }));
        cortex.add(otherController);
        const response = await request.get('/other/test/123');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true, id: '123' });
    });

    it('should handle unknown routes', async () => {
        const response = await request.get('/unknown');
        expect(response.status).toBe(404);
    });
    
    it('should handle POST requests with JSON body', async () => {
        cortex.post('/api/user', (req: RequestInterface<{}, object>) => {
            return { 
                success: true, 
                received: req.body 
            };
        });
        
        const userData = { name: 'John', age: 30, email: 'john@example.com' };
        const response = await request
            .post('/api/user')
            .set('Content-Type', 'application/json')
            .send(userData);
            
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ 
            success: true, 
            received: userData 
        });
    });
    
    it('should handle PUT requests with JSON body', async () => {
        cortex.put('/api/user/:id', (req: RequestInterface<{ id: string }, object>) => {
            return { 
                success: true, 
                id: req.params.id,
                data: req.body 
            };
        });
        
        const userData = { name: 'Updated Name', age: 31 };
        const response = await request
            .put('/api/user/123')
            .set('Content-Type', 'application/json')
            .send(userData);
            
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ 
            success: true, 
            id: '123',
            data: userData 
        });
    });
    
    it('should handle DELETE requests with params and body', async () => {
        cortex.delete('/api/user/:id', (req: RequestInterface<{ id: string }, object>) => {
            return { 
                success: true, 
                deleted: req.params.id,
                reason: req.body 
            };
        });
        
        const deleteReason = { reason: 'User requested account deletion' };
        const response = await request
            .delete('/api/user/456')
            .set('Content-Type', 'application/json')
            .send(deleteReason);
            
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ 
            success: true, 
            deleted: '456',
            reason: deleteReason 
        });
    });
    
    it('should handle requests with complex typed body', async () => {
        interface UserData {
            name: string;
            address: {
                street: string;
                city: string;
            };
            hobbies: string[];
        }
        
        cortex.post('/api/user/complex', (req: RequestInterface<{}, UserData>) => {
            const userData = req.body as unknown as UserData;
            return { 
                success: true, 
                name: userData.name,
                city: userData.address.city,
                hobbies: userData.hobbies
            };
        });
        
        const complexUserData = {
            name: 'Alice',
            address: {
                street: '123 Main St',
                city: 'New York'
            },
            hobbies: ['reading', 'gaming', 'hiking']
        };
        
        const response = await request
            .post('/api/user/complex')
            .set('Content-Type', 'application/json')
            .send(complexUserData);
            
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ 
            success: true, 
            name: 'Alice',
            city: 'New York',
            hobbies: ['reading', 'gaming', 'hiking']
        });
    });
    
    it('should handle POST requests with text content-type', async () => {
        cortex.post('/api/message', (req: RequestInterface<{}, object>) => {
            return { 
                success: true, 
                textContent: req.body 
            };
        });
        
        const textData = '{"message": "Simple text message"}';
        const response = await request
            .post('/api/message')
            .set('Content-Type', 'text/plain')
            .send(textData);
            
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ 
            success: true, 
            textContent: JSON.parse(textData)
        });
    });
    
    it('should handle string value in JSON body', async () => {
        cortex.post('/api/string', (req: RequestInterface<{}, string>) => {
            return { 
                success: true, 
                value: req.body,
                type: typeof req.body
            };
        });
        
        const response = await request
            .post('/api/string')
            .set('Content-Type', 'application/json')
            .send('"test string value"');
            
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ 
            success: true, 
            value: 'test string value',
            type: 'string'
        });
    });
    
    it('should handle number value in JSON body', async () => {
        cortex.post('/api/number', (req: RequestInterface<{}, number>) => {
            return { 
                success: true, 
                value: req.body,
                type: typeof req.body
            };
        });
        
        const response = await request
            .post('/api/number')
            .set('Content-Type', 'application/json')
            .send('42');
            
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ 
            success: true, 
            value: 42,
            type: 'number'
        });
    });
    
    it('should handle boolean value in JSON body', async () => {
        cortex.post('/api/boolean', (req: RequestInterface<{}, boolean>) => {
            return { 
                success: true, 
                value: req.body,
                type: typeof req.body
            };
        });
        
        const response = await request
            .post('/api/boolean')
            .set('Content-Type', 'application/json')
            .send('true');
            
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ 
            success: true, 
            value: true,
            type: 'boolean'
        });
    });
    
    it('should handle string value in TEXT body', async () => {
        cortex.post('/api/text-string', (req: RequestInterface<{}, string>) => {
            return { 
                success: true, 
                value: req.body,
                type: typeof req.body
            };
        });
        
        const response = await request
            .post('/api/text-string')
            .set('Content-Type', 'text/plain')
            .send('"test string with text type"');
            
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ 
            success: true, 
            value: 'test string with text type',
            type: 'string'
        });
    });
    
    it('should handle number value in TEXT body', async () => {
        cortex.post('/api/text-number', (req: RequestInterface<{}, number>) => {
            return { 
                success: true, 
                value: req.body,
                type: typeof req.body
            };
        });
        
        const response = await request
            .post('/api/text-number')
            .set('Content-Type', 'text/plain')
            .send('123.45');
            
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ 
            success: true, 
            value: 123.45,
            type: 'number'
        });
    });
    
    it('should handle boolean value in TEXT body', async () => {
        cortex.post('/api/text-boolean', (req: RequestInterface<{}, boolean>) => {
            return { 
                success: true, 
                value: req.body,
                type: typeof req.body
            };
        });
        
        const response = await request
            .post('/api/text-boolean')
            .set('Content-Type', 'text/plain')
            .send('false');
            
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ 
            success: true, 
            value: false,
            type: 'boolean'
        });
    });

    it('should execute middleware in correct order', async () => {
        const executionOrder: number[] = [];
        
        cortex.use(async (_req, _res, next) => {
            executionOrder.push(1);
            await next();
        });
        
        cortex.use(async (_req, _res, next) => {
            executionOrder.push(2);
            await next();
        });
        
        cortex.get('/middleware-order', () => ({ success: true }));
        
        const response = await request.get('/middleware-order');
        
        expect(response.status).toBe(200);
        expect(executionOrder).toEqual([1, 2]);
    });

    it('should modify request in middleware and pass modified data to handler', async () => {
        cortex.use(async (req, _res, next) => {
            // @ts-ignore
            req.modifiedData = 'modified by middleware';
            await next();
        });
        
        cortex.get('/middleware-modify', (req: RequestInterface) => {
            // @ts-ignore
            return { success: true, data: req.modifiedData };
        });
        
        const response = await request.get('/middleware-modify');
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ 
            success: true, 
            data: 'modified by middleware'
        });
    });

    it('should stop middleware chain and return response', async () => {
        cortex.use(async (_req, res) => {
            // @ts-ignore
            res.response.setHeader('X-Stopped', 'true');
            return;
        });
        
        cortex.use(async (_req, _res, next) => {
            await next();
        });
        
        cortex.get('/middleware-stop', () => ({ success: true }));
        
        const response = await request.get('/middleware-stop');
        
        expect(response.headers['x-stopped']).toBe('true');
    });

    it('should handle middleware for all routes with wildcard path', async () => {
        // Create new instance to avoid middleware from other tests
        const newCortex = new Cortex({protocol: ProtocolEnum.HTTP, logger: TransportEnum.SILENT});
        newCortex.listen(port + 3);
        const newRequest = supertest(`http://localhost:${port + 3}`);
        
        // Add middleware with root path - should run for all routes
        newCortex.use('/', async (_req, res, next) => {
            // @ts-ignore
            res.response.setHeader('X-Global-Middleware', 'executed');
            await next();
        });
        
        // Add two different routes
        newCortex.get('/test-global-middleware', () => ({ success: true }));
        newCortex.get('/another-route', () => ({ success: true }));
        
        // Test first route
        const response1 = await newRequest.get('/test-global-middleware');
        expect(response1.status).toBe(200);
        expect(response1.headers['x-global-middleware']).toBe('executed');
        
        // Test second route
        const response2 = await newRequest.get('/another-route');
        expect(response2.status).toBe(200);
        expect(response2.headers['x-global-middleware']).toBe('executed');
        
        // Cleanup
        newCortex.close();
    });

    it('should handle middleware with path correctly', async () => {
        // Create new instance to avoid middleware from other tests
        const newCortex = new Cortex({protocol: ProtocolEnum.HTTP, logger: TransportEnum.SILENT});
        newCortex.listen(port + 2);
        const newRequest = supertest(`http://localhost:${port + 2}`);
        
        let apiPathExecuted = false;
        let rootPathExecuted = false;
        
        newCortex.use('/api', async (_req, _res, next) => {
            apiPathExecuted = true;
            await next();
        });
        
        newCortex.use('/', async (_req, _res, next) => {
            rootPathExecuted = true;
            await next();
        });
        
        newCortex.get('/api/data', () => ({ success: true }));
        
        const response = await newRequest.get('/api/data');
        
        expect(response.status).toBe(200);
        expect(apiPathExecuted).toBe(true);
        expect(rootPathExecuted).toBe(true);
        
        // Reset flags
        apiPathExecuted = false;
        rootPathExecuted = false;
        
        // Test path that doesn't match /api
        newCortex.get('/other/path', () => ({ success: true }));
        
        await newRequest.get('/other/path');
        
        expect(apiPathExecuted).toBe(false);
        expect(rootPathExecuted).toBe(true);
        
        // Cleanup
        newCortex.close();
    });
    
    it('should handle empty middleware chain', async () => {
        const newCortex = new Cortex({protocol: ProtocolEnum.HTTP, logger: TransportEnum.SILENT});
        newCortex.listen(port + 1);
        const newRequest = supertest(`http://localhost:${port + 1}`);
        
        newCortex.get('/no-middleware', () => ({ success: true }));
        
        const response = await newRequest.get('/no-middleware');
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true });
        
        // Cleanup
        newCortex.close();
    });

    it('should handle URL with query parameters', async () => {
        cortex.get('/api/search', (req: RequestInterface) => {
            return { 
                success: true, 
                query: req.query
            };
        });
        
        const response = await request.get('/api/search?q=test&page=1&limit=10');
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ 
            success: true, 
            query: {
                q: 'test',
                page: '1',
                limit: '10'
            }
        });
    });
    
    it('should handle multiple query parameters with the same name', async () => {
        cortex.get('/api/filter', (req: RequestInterface) => {
            return { 
                success: true, 
                filters: req.query.filter
            };
        });
        
        const response = await request.get('/api/filter?filter=red&filter=blue&filter=green');
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ 
            success: true, 
            filters: ['red', 'blue', 'green']
        });
    });
    
    it('should handle complex query parameters', async () => {
        cortex.get('/api/complex-query', (req: RequestInterface) => {
            return { 
                success: true, 
                query: req.query
            };
        });
        
        const response = await request.get('/api/complex-query?filter[name]=John&filter[age]=30&sort=asc&page=1');
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ 
            success: true, 
            query: {
                'filter[name]': 'John',
                'filter[age]': '30',
                sort: 'asc',
                page: '1'
            }
        });
    });
    
    it('should combine route parameters with query parameters', async () => {
        cortex.get('/api/users/:userId/posts/:postId', (req: RequestInterface<{userId: string, postId: string}>) => {
            return { 
                success: true, 
                userId: req.params.userId,
                postId: req.params.postId,
                query: req.query
            };
        });
        
        const response = await request.get('/api/users/123/posts/456?include=comments&sort=newest');
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ 
            success: true, 
            userId: '123',
            postId: '456',
            query: {
                include: 'comments',
                sort: 'newest'
            }
        });
    });
}); 