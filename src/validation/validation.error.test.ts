import { ValidationError } from './validation.error';

describe('ValidationError', () => {
  it('should create an instance of ValidationError', () => {
    const error = new ValidationError('Validation failed', []);
    
    expect(error).toBeInstanceOf(ValidationError);
    expect(error).toBeInstanceOf(Error);
  });
  
  it('should store message and errors', () => {
    const errorMessage = 'Validation failed';
    const errorsList = [
      { path: 'email', message: 'Email is required' },
      { path: 'name', message: 'Name is required' }
    ];
    
    const error = new ValidationError(errorMessage, errorsList);
    
    expect(error.message).toBe(errorMessage);
    expect(error.errors).toBe(errorsList);
  });
  
  it('should have errors property accessible', () => {
    const errors = [{ path: 'field', message: 'Error message' }];
    const error = new ValidationError('Test', errors);
    
    expect(error.errors).toEqual(errors);
  });
}); 