import * as yup from 'yup';
import { YupSchemaAdapter, adaptYupSchema } from './yup.adapter';

describe('YupSchemaAdapter', () => {
  it('should create an instance of YupSchemaAdapter', () => {
    const schema = yup.object().shape({
      name: yup.string().required(),
    });
    const adapter = new YupSchemaAdapter(schema);
    
    expect(adapter).toBeInstanceOf(YupSchemaAdapter);
  });

  it('should return empty errors array for valid data', async () => {
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
    });
    const adapter = new YupSchemaAdapter(schema);
    
    const result = await adapter.validate({ name: 'John', email: 'john@example.com' });
    
    expect(result).toEqual({ errors: [] });
  });

  it('should return errors for invalid data', async () => {
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
    });
    const adapter = new YupSchemaAdapter(schema);
    
    const result = await adapter.validate({ name: 'John' });
    
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toHaveProperty('path', 'email');
    expect(result.errors[0]).toHaveProperty('message');
  });

  it('should return errors for multiple validation failures', async () => {
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
      age: yup.number().positive().integer().required(),
    });
    const adapter = new YupSchemaAdapter(schema);
    
    const result = await adapter.validate({ name: 'John', email: 'not-an-email', age: -5 });
    
    expect(result.errors.length).toBeGreaterThan(1);
  });

  it('should handle non-Yup errors', async () => {
    const mockSchema = {
      validate: jest.fn().mockImplementation(() => {
        throw new Error('Unexpected error');
      })
    };
    const adapter = new YupSchemaAdapter(mockSchema as unknown as yup.Schema);
    
    const result = await adapter.validate({});
    
    expect(result.errors.length).toBe(1);
    expect(result.errors[0]).toHaveProperty('message', 'Unexpected error');
  });

  it('should handle unknown errors', async () => {
    const mockSchema = {
      validate: jest.fn().mockImplementation(() => {
        throw 'Not an error object';
      })
    };
    const adapter = new YupSchemaAdapter(mockSchema as unknown as yup.Schema);
    
    const result = await adapter.validate({});
    
    expect(result.errors.length).toBe(1);
    expect(result.errors[0]).toHaveProperty('message', 'Unknown validation error');
  });
});

describe('adaptYupSchema', () => {
  it('should return a ValidationSchemaInterface instance', () => {
    const schema = yup.object().shape({
      name: yup.string().required(),
    });
    const result = adaptYupSchema(schema);
    
    expect(result).toBeInstanceOf(YupSchemaAdapter);
    expect(result).toHaveProperty('validate');
    expect(typeof result.validate).toBe('function');
  });
}); 