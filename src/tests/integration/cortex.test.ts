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
}); 