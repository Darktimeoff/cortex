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
    
    const request = new Request(params, mockIncomingMessage);
    
    expect(request.params).toBe(params);
  });
  
  it('should provide access to original IncomingMessage', () => {
    const params = { id: '123' };
    
    const request = new Request(params, mockIncomingMessage);
    
    expect(request.request).toBe(mockIncomingMessage);
  });
  
  it('should work with empty params', () => {
    const params = {};
    
    const request = new Request(params, mockIncomingMessage);
 
    expect(request.params).toEqual({});
  });

  it('should handle typed params correctly', () => {
    type UserParams = {
      id: string;
      role: string;
    };

    const params: UserParams = { id: '123', role: 'admin' };
    

    const request = new Request<UserParams>(params, mockIncomingMessage);
    
    expect(request.params.id).toBe('123');
    expect(request.params.role).toBe('admin');
  });
}); 