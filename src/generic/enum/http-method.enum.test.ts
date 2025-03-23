import { HttpMethod } from './http-method.enum';

describe('HttpMethod Enum', () => {
  it('should have the correct values', () => {
    expect(HttpMethod.GET).toBe('GET');
    expect(HttpMethod.POST).toBe('POST');
    expect(HttpMethod.PUT).toBe('PUT');
    expect(HttpMethod.DELETE).toBe('DELETE');
  });
}); 