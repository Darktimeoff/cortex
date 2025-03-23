import { HttpProtocol } from '@/protocol';
import { ControllerRegistry } from '@/controller-registry';
import { ServerResponse } from 'http';
import { HttpInterface } from './http.interface';

const mockRequest = (method: string = 'GET', url: string = '/test') => ({
  method,
  url,
  headers: {}
});

const mockResponse = () => {
  const res: Partial<ServerResponse> = {
    statusCode: 200,
    end: jest.fn(),
    setHeader: jest.fn(),
    getHeader: jest.fn().mockReturnValue(null)
  };
  return res as ServerResponse;
};

describe('HttpProtocol', () => {
  let httpProtocol: HttpProtocol;
  let registry: ControllerRegistry;
  
  beforeEach(() => {
    registry = new ControllerRegistry();
    httpProtocol = new HttpProtocol(registry);
  });
  
  afterEach(() => {
    httpProtocol.close();
  });
  
  it('should return self when calling listen', () => {
    const result = httpProtocol.listen(0);
    expect(result).toBe(httpProtocol);
  });
  
  it('should return self when calling close', () => {
    const result = httpProtocol.close();
    expect(result).toBe(httpProtocol);
  });
  
  describe('handleResponse', () => {
    it('should handle JSON response', () => {
      const protocol = httpProtocol as HttpProtocol;
      const res = mockResponse();
      const response = { data: 'test' };

      // @ts-ignore
      protocol.handleResponse(response, res);
      
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(res.setHeader).toHaveBeenCalledWith('Powered-By', 'Cortex');
      expect(res.end).toHaveBeenCalledWith(JSON.stringify(response));
    });
    
    it('should handle text response', () => {
      const protocol = httpProtocol as HttpInterface;
      const res = mockResponse();
      const response = 'test';
      
      //@ts-expect-error
      protocol.handleResponse(response, res);
      
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
      expect(res.end).toHaveBeenCalledWith('test');
    });
    
    it('should use existing content-type if already set', () => {
      const protocol = httpProtocol as HttpInterface;
      const res = mockResponse();
      (res.getHeader as jest.Mock).mockReturnValue('application/xml');
      const response = { data: 'test' };
      
      //@ts-expect-error
      protocol.handleResponse(response, res);
      
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/xml');
    });
  });
  
  describe('getContentType', () => {
    it('should return application/json for object', () => {
      const protocol = httpProtocol as HttpInterface;
      //@ts-expect-error
      const result = protocol.getContentType({ key: 'value' });
      expect(result).toBe('application/json');
    });
    
    it('should return text/plain for string', () => {
      const protocol = httpProtocol as HttpInterface;
      //@ts-expect-error
      const result = protocol.getContentType('text');
      expect(result).toBe('text/plain');
    });
  });
  
  describe('convertResponseToBody', () => {
    it('should convert object to JSON string', () => {
      const protocol = httpProtocol as HttpInterface
      const obj = { key: 'value' };
    //@ts-expect-error
      const result = protocol.convertResponseToBody(obj);
      expect(result).toBe(JSON.stringify(obj));
    });
    
    it('should return empty string for null', () => {
      const protocol = httpProtocol as HttpInterface;
      //@ts-expect-error
      expect(protocol.convertResponseToBody(null)).toBe('');
    });
    
    it('should return empty string for undefined', () => {
      const protocol = httpProtocol as HttpInterface;
      //@ts-expect-error
      expect(protocol.convertResponseToBody(undefined)).toBe('');
    });
    
    it('should convert non-object to string', () => {
      const protocol = httpProtocol as HttpInterface;
      //@ts-expect-error
      expect(protocol.convertResponseToBody(123)).toBe('123');
      //@ts-expect-error
      expect(protocol.convertResponseToBody(true)).toBe('true');
    });
  });
  
  describe('handleNotFoundHandler', () => {
    it('should set 404 status and end response', () => {
      const protocol = httpProtocol as HttpInterface;
      const res = mockResponse();
      //@ts-expect-error
      protocol.handleNotFoundHandler(res);
      
      expect(res.statusCode).toBe(404);
      expect(res.end).toHaveBeenCalledWith('Not Found');
    });
  });
  
  describe('getHandler', () => {
    it('should return null for invalid method', () => {
      const protocol = httpProtocol as HttpInterface;
      const req = mockRequest('INVALID', '/test');
      //@ts-expect-error
      const result = protocol.getHandler(req);
      
      expect(result).toBeNull();
    });
    
    it('should return null for null path', () => {
      const protocol = httpProtocol as HttpInterface;
      const req = mockRequest('GET', null as unknown as string);
      //@ts-expect-error
      const result = protocol.getHandler(req);
      
      expect(result).toBeNull();
    });
  });
}); 