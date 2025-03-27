import { ValidationRequest } from './validation-request';
import { ValidationError } from './validation.error';
import { ValidationSchemaInterface } from './validation.interface';
import { RequestInterface } from '@/request';

describe('ValidationRequest', () => {
  let validationRequest: ValidationRequest;
  let mockRequest: jest.Mocked<RequestInterface>;
  let mockSchema: {
    params?: jest.Mocked<ValidationSchemaInterface>;
    body?: jest.Mocked<ValidationSchemaInterface>;
    query?: jest.Mocked<ValidationSchemaInterface>;
  };

  beforeEach(() => {
    mockRequest = {
      params: {},
      body: {},
      query: {},
    } as jest.Mocked<RequestInterface>;

    mockSchema = {
      params: { validate: jest.fn() },
      body: { validate: jest.fn() },
      query: { validate: jest.fn() },
    };

    validationRequest = new ValidationRequest(mockRequest, mockSchema);
  });

  it('should create instance of ValidationRequest', () => {
    expect(validationRequest).toBeInstanceOf(ValidationRequest);
  });

  it('should validate all schemas successfully', async () => {
    mockRequest.params = { id: '123' };
    mockRequest.body = { name: 'John' };
    mockRequest.query = { filter: 'active' };

    mockSchema.params?.validate.mockResolvedValue({ errors: [] });
    mockSchema.body?.validate.mockResolvedValue({ errors: [] });
    mockSchema.query?.validate.mockResolvedValue({ errors: [] });

    await expect(validationRequest.validate()).resolves.not.toThrow();
  });

  it('should throw ValidationError when params validation fails', async () => {
    mockRequest.params = { id: '123' };
    const validationErrors = [{ path: 'id', message: 'Invalid ID format' }];
    mockSchema.params?.validate.mockResolvedValue({ errors: validationErrors });

    await expect(validationRequest.validate()).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError when body validation fails', async () => {
    mockRequest.body = { name: 'John' };
    const validationErrors = [{ path: 'name', message: 'Name is required' }];
    mockSchema.body?.validate.mockResolvedValue({ errors: validationErrors });

    await expect(validationRequest.validate()).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError when query validation fails', async () => {
    mockRequest.query = { filter: 'active' };
    const validationErrors = [{ path: 'filter', message: 'Invalid filter value' }];
    mockSchema.query?.validate.mockResolvedValue({ errors: validationErrors });

    await expect(validationRequest.validate()).rejects.toThrow(ValidationError);
  });

  it('should handle empty request data', async () => {
    mockRequest.params = {};
    mockRequest.body = {};
    mockRequest.query = {};

    mockSchema.params?.validate.mockResolvedValue({ errors: [] });
    mockSchema.body?.validate.mockResolvedValue({ errors: [] });
    mockSchema.query?.validate.mockResolvedValue({ errors: [] });

    await expect(validationRequest.validate()).resolves.not.toThrow();
  });

  it('should handle validation errors from schema', async () => {
    mockRequest.body = { name: 'John' };
    const error = new Error('Validation failed');
    //@ts-expect-error
    error.errors = [{ path: 'name', message: 'Name is required' }];
    mockSchema.body?.validate.mockRejectedValue(error);

    await expect(validationRequest.validate()).rejects.toThrow(ValidationError);
  });
}); 