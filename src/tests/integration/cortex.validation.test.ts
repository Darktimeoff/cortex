import supertest from 'supertest';
import { Cortex, CortexInterface } from '@/cortex';
import { RequestInterface } from '@/request';
import TestAgent from 'supertest/lib/agent';
import { ProtocolEnum } from '@/protocol';
import { TransportEnum } from '@/logger';
import * as yup from 'yup';
import { adaptYupSchema } from '@/validation/adapters/yup.adapter';

const port = 3001;

describe('Cortex Validation Integration Tests', () => {
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

    it('should validate request body with Yup schema', async () => {
        const userSchema = adaptYupSchema(yup.object().shape({
            name: yup.string().required(),
            age: yup.number().required().positive(),
            email: yup.string().email().required()
        }));

        cortex.post('/users', async (req: RequestInterface) => {
            return { success: true, data: req.body };
        }, { body: userSchema });

        const validData = {
            name: 'John',
            age: 30,
            email: 'john@example.com'
        };

        const response = await request
            .post('/users')
            .set('Content-Type', 'application/json')
            .send(validData);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true, data: validData });

        const invalidData = {
            name: 'John',
            age: -5,
            email: 'invalid-email'
        };

        const errorResponse = await request
            .post('/users')
            .set('Content-Type', 'application/json')
            .send(invalidData);

        expect(errorResponse.status).toBe(400);
        expect(errorResponse.body).toHaveProperty('errors');
        expect(errorResponse.body.errors).toHaveLength(2);
    });

    it('should validate request params with Yup schema', async () => {
        const paramsSchema = adaptYupSchema(yup.object().shape({
            id: yup.string().required().matches(/^\d+$/, 'ID must be numeric'),
            type: yup.string().required().oneOf(['user', 'admin'])
        }));

        cortex.get('/users/:id/:type', async (req: RequestInterface) => {
            return { success: true, params: req.params };
        }, { params: paramsSchema });

        const response = await request.get('/users/123/user');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ 
            success: true, 
            params: { id: '123', type: 'user' }
        });

        const errorResponse = await request.get('/users/abc/admin');
        expect(errorResponse.status).toBe(400);
        expect(errorResponse.body).toHaveProperty('errors');
        expect(errorResponse.body.errors[0].path).toBe('id');
    });

    it('should validate query parameters with Yup schema', async () => {
        const querySchema = adaptYupSchema(yup.object().shape({
            page: yup.number().required().positive(),
            limit: yup.number().required().positive().max(100),
            sort: yup.string().oneOf(['asc', 'desc'])
        }));

        cortex.get('/search', async (req: RequestInterface) => {
            return { success: true, query: req.query };
        }, { query: querySchema });

        const response = await request.get('/search?page=1&limit=50&sort=asc');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ 
            success: true, 
            query: { page: '1', limit: '50', sort: 'asc' }
        });

        const errorResponse = await request.get('/search?page=-1&limit=200');
        expect(errorResponse.status).toBe(400);
        expect(errorResponse.body).toHaveProperty('errors');
        expect(errorResponse.body.errors).toHaveLength(2);
    });

    it('should validate multiple schemas together', async () => {
        const bodySchema = adaptYupSchema(yup.object().shape({
            name: yup.string().required(),
            age: yup.number().required().positive()
        }));

        const paramsSchema = adaptYupSchema(yup.object().shape({
            id: yup.string().required().matches(/^\d+$/, 'ID must be numeric')
        }));

        const querySchema = adaptYupSchema(yup.object().shape({
            include: yup.string().oneOf(['profile', 'posts'])
        }));

        cortex.put('/users/:id', async (req: RequestInterface) => {
            return { 
                success: true, 
                params: req.params,
                body: req.body,
                query: req.query
            };
        }, {
            body: bodySchema,
            params: paramsSchema,
            query: querySchema
        });

        const validRequest = {
            name: 'John',
            age: 30
        };

        const response = await request
            .put('/users/123?include=profile')
            .set('Content-Type', 'application/json')
            .send(validRequest);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            params: { id: '123' },
            body: validRequest,
            query: { include: 'profile' }
        });

        const invalidRequest = {
            name: 'John',
            age: -5
        };

        const errorResponse = await request
            .put('/users/abc?include=invalid')
            .set('Content-Type', 'application/json')
            .send(invalidRequest);

        expect(errorResponse.status).toBe(400);
        expect(errorResponse.body).toHaveProperty('errors');
        expect(errorResponse.body.errors).toHaveLength(1);
        expect(errorResponse.body.errors[0].path).toBe('id');
    });

    it('should handle validation errors with custom messages', async () => {
        const schema = adaptYupSchema(yup.object().shape({
            name: yup.string().required('Name is required'),
            age: yup.number()
                .required('Age is required')
                .positive('Age must be positive')
                .max(120, 'Age must be less than 120')
        }));

        cortex.post('/custom-messages', async (req: RequestInterface) => {
            return { success: true, data: req.body };
        }, { body: schema });

        const invalidData = {
            name: '',
            age: -5
        };

        const response = await request
            .post('/custom-messages')
            .set('Content-Type', 'application/json')
            .send(invalidData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(2);
        expect(response.body.errors[0].message).toBe('Name is required');
        expect(response.body.errors[1].message).toBe('Age must be positive');
    });
}); 