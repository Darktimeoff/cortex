import { isHttpMethod } from './is-http-method.type-guard';
import { HttpMethod } from '../enum/http-method.enum';

describe('isHttpMethod', () => {
  it('should return true for valid HTTP methods', () => {
    // Arrange & Act & Assert
    expect(isHttpMethod(HttpMethod.GET)).toBe(true);
    expect(isHttpMethod(HttpMethod.POST)).toBe(true);
    expect(isHttpMethod(HttpMethod.PUT)).toBe(true);
    expect(isHttpMethod(HttpMethod.DELETE)).toBe(true);
    expect(isHttpMethod('GET')).toBe(true);
    expect(isHttpMethod('POST')).toBe(true);
    expect(isHttpMethod('PUT')).toBe(true);
    expect(isHttpMethod('DELETE')).toBe(true);
  });

  it('should return false for invalid HTTP methods', () => {
    // Arrange & Act & Assert
    expect(isHttpMethod('PATCH')).toBe(false);
    expect(isHttpMethod('OPTIONS')).toBe(false);
    expect(isHttpMethod('HEAD')).toBe(false);
    expect(isHttpMethod('TRACE')).toBe(false);
    expect(isHttpMethod('CONNECT')).toBe(false);
  });

  it('should return false for non-string values', () => {
    // Arrange & Act & Assert
    expect(isHttpMethod(null)).toBe(false);
    expect(isHttpMethod(undefined)).toBe(false);
    expect(isHttpMethod(123)).toBe(false);
    expect(isHttpMethod({})).toBe(false);
    expect(isHttpMethod([])).toBe(false);
    expect(isHttpMethod(true)).toBe(false);
  });

  it('should return false for empty string', () => {
    // Arrange & Act & Assert
    expect(isHttpMethod('')).toBe(false);
  });

  it('should return false for lowercase HTTP methods', () => {
    // Arrange & Act & Assert
    expect(isHttpMethod('get')).toBe(false);
    expect(isHttpMethod('post')).toBe(false);
    expect(isHttpMethod('put')).toBe(false);
    expect(isHttpMethod('delete')).toBe(false);
  });
}); 