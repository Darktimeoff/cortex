import supertest from 'supertest';
import { Cortex, CortexInterface } from '@/cortex';
import { RequestInterface } from '@/request';
import { Controller } from '@/controller';
import TestAgent from 'supertest/lib/agent';

const port = 2000;

describe('Cortex Integration Tests', () => {
    let cortex: CortexInterface;
    let request: TestAgent;

    beforeAll(async () => {
        cortex = new Cortex();
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
        const otherController = new Controller('other');
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
}); 