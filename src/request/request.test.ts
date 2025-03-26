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

  it('should parse query parameters from URL', () => {
    mockIncomingMessage.url = '/test?name=John&age=30';
    const request = new Request({}, mockIncomingMessage, null);
    
    expect(request.query).toEqual({
      name: 'John',
      age: '30'
    });
  });

  it('should handle multiple query parameters with the same name', () => {
    mockIncomingMessage.url = '/test?tag=javascript&tag=typescript&tag=nodejs';
    const request = new Request({}, mockIncomingMessage, null);
    
    expect(request.query).toEqual({
      tag: ['javascript', 'typescript', 'nodejs']
    });
  });

  it('should handle empty query parameters', () => {
    mockIncomingMessage.url = '/test?empty=&name=John';
    const request = new Request({}, mockIncomingMessage, null);
    
    expect(request.query).toEqual({
      empty: '',
      name: 'John'
    });
  });

  it('should handle complex query strings', () => {
    mockIncomingMessage.url = '/test?filter[name]=John&filter[age]=30&sort=asc';
    const request = new Request({}, mockIncomingMessage, null);
    
    expect(request.query).toEqual({
      'filter[name]': 'John',
      'filter[age]': '30',
      'sort': 'asc'
    });
  });

  it('should return empty object for URL without query parameters', () => {
    mockIncomingMessage.url = '/test';
    const request = new Request({}, mockIncomingMessage, null);
    
    expect(request.query).toEqual({});
  });

  it('should handle URL with only query parameters', () => {
    mockIncomingMessage.url = '?page=1&limit=10';
    const request = new Request({}, mockIncomingMessage, null);
    
    expect(request.query).toEqual({
      page: '1',
      limit: '10'
    });
  });

  it('should handle undefined URL by using default fallback path', () => {
    mockIncomingMessage.url = undefined;
    const request = new Request({}, mockIncomingMessage, null);
    
    expect(request.query).toEqual({});
  });

  it('should handle null URL by using default fallback path', () => {
    //@ts-expect-error
    mockIncomingMessage.url = null;
    const request = new Request({}, mockIncomingMessage, null);
    
    expect(request.query).toEqual({});
  });

  it('should handle empty string URL', () => {
    mockIncomingMessage.url = '';
    const request = new Request({}, mockIncomingMessage, null);
    
    expect(request.query).toEqual({});
  });
}); 