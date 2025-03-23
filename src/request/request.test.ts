import { Request } from './request';
import { IncomingMessage } from 'http';

describe('Request', () => {
  let mockIncomingMessage: IncomingMessage;
  
  beforeEach(() => {
    mockIncomingMessage = {
      method: 'GET',
      url: '/test',
      headers: {}
    } as IncomingMessage;
  });
  
  it('should store params passed to constructor', () => {
    const params = { id: '123', name: 'test' };
    const body = { id: '123', name: 'test' };
    const request = new Request(params, mockIncomingMessage, body);
    
    expect(request.params).toBe(params);
    expect(request.body).toBe(body);
  });
  
  it('should provide access to original IncomingMessage', () => {
    const params = { id: '123' };
    const body = { id: '123', name: 'test' };

    const request = new Request(params, mockIncomingMessage, body);
    
    expect(request.request).toBe(mockIncomingMessage);
  });
  
  it('should work with empty params', () => {
    const params = {};
    const body = null;
    
    const request = new Request(params, mockIncomingMessage, body);
 
    expect(request.params).toEqual({});
    expect(request.body).toBeNull();
  });

  it('should handle typed params correctly', () => {
    type UserParams = {
      id: string;
      role: string;
    };
    type UserBody = {
      id: string;
      role: string;
    };

    const params: UserParams = { id: '123', role: 'admin' };
    const body: UserBody = { id: '123', role: 'admin' };

    const request = new Request(params, mockIncomingMessage, body);
    
    expect(request.params.id).toBe('123');
    expect(request.params.role).toBe('admin');
    //@ts-expect-error
    expect(request.body?.id).toBe('123');
    //@ts-expect-error
    expect(request.body?.role).toBe('admin');
  });
}); 