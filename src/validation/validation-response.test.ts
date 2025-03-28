import { ControllerHandlerResponseType } from '@/controller/controller.type';
import { ValidationResponse } from './validation-response';
import { ValidationError } from './validation.error';
import { ValidationSchemaInterface } from './validation.interface';

describe('ValidationResponse', () => {
  let validationResponse: ValidationResponse;
  let mockSchema: {
    response?: jest.Mocked<ValidationSchemaInterface>;
  };
  let mockResponseBody: ControllerHandlerResponseType;

  beforeEach(() => {
    mockSchema = {
      response: { validate: jest.fn() }
    };

    mockResponseBody = {
      success: true,
      data: {
        id: 123,
        name: 'Test User'
      }
    };

    validationResponse = new ValidationResponse(mockResponseBody, mockSchema);
  });

  it('should create instance of ValidationResponse', () => {
    expect(validationResponse).toBeInstanceOf(ValidationResponse);
  });

  it('should validate response schema successfully', async () => {
    mockSchema.response?.validate.mockResolvedValue({ errors: [] });

    await expect(validationResponse.validate()).resolves.toBeUndefined();
    expect(mockSchema.response?.validate).toHaveBeenCalledWith(mockResponseBody);
  });

  it('should throw ValidationError when response validation fails', async () => {
    const validationErrors = [
      { path: 'data.id', message: 'ID must be positive' },
      { path: 'data.name', message: 'Name is required' }
    ];
    mockSchema.response?.validate.mockResolvedValue({ errors: validationErrors });

    await expect(validationResponse.validate()).rejects.toThrow(ValidationError);
  });

  it('should handle empty response body', async () => {
    const emptyBody = {};
    validationResponse = new ValidationResponse(emptyBody, mockSchema);
    
    mockSchema.response?.validate.mockResolvedValue({ errors: [] });

    await expect(validationResponse.validate()).resolves.toBeUndefined();
    expect(mockSchema.response?.validate).toHaveBeenCalledWith(emptyBody);
  });

  it('should handle null response schema', async () => {
    validationResponse = new ValidationResponse(mockResponseBody, {});
    
    await expect(validationResponse.validate()).resolves.toBeUndefined();
  });

  it('should handle undefined response schema', async () => {
    validationResponse = new ValidationResponse(mockResponseBody, { response: undefined });
    
    await expect(validationResponse.validate()).resolves.toBeUndefined();
  });

  it('should handle validation errors from schema', async () => {
    const errorData = [{ path: 'data.id', message: 'ID must be positive' }];
    const error = new ValidationError('Validation failed', errorData);
    
    mockSchema.response?.validate.mockRejectedValue(error);

    await expect(validationResponse.validate()).rejects.toThrow(ValidationError);
    await expect(validationResponse.validate()).rejects.toMatchObject({
      message: 'Validation failed',
      errors: errorData
    });
  });

  it('should handle complex nested response structures', async () => {
    const complexResponse = {
      success: true,
      data: {
        user: {
          id: 123,
          profile: {
            name: 'Test User',
            details: {
              age: 30,
              roles: ['admin', 'user']
            }
          }
        },
        meta: {
          timestamp: new Date(),
          version: '1.0.0'
        }
      }
    };

    validationResponse = new ValidationResponse(complexResponse, mockSchema);
    mockSchema.response?.validate.mockResolvedValue({ errors: [] });

    await expect(validationResponse.validate()).resolves.toBeUndefined();
    expect(mockSchema.response?.validate).toHaveBeenCalledWith(complexResponse);
  });
}); 