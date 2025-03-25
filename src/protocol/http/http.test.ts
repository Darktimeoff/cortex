import { HttpProtocol, HttpInterface } from '@/protocol';
import { ControllerRegistry, ControllerRegistryInterface } from '@/controller-registry';
import { ServerResponse, IncomingMessage } from 'http';
import { ParserFactory, ParserFactoryInterface } from '@/parser';
import { ContentTypeEnum } from '@/generic/enum/content-type.enum';
import { Readable } from 'stream';
import { Controller } from '@/controller';
import { MiddlewareHandler } from '@/middleware';
import { Logger, LoggerInterface, TransportEnum, TransportSilent } from '@/logger';

const mockRequest = (method: string = 'GET', url: string = '/test', contentType?: ContentTypeEnum, body?: string) => {
  const req = new Readable() as unknown as IncomingMessage;
  
  req.method = method;
  req.url = url;
  req.headers = {};
  
  if (contentType) {
    req.headers['content-type'] = contentType;
  }
  
  if (body) {
    req.push(body);
  }
  
  req.push(null);
  
  return req;
};

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
  let httpProtocol: HttpInterface;
  let registry: ControllerRegistryInterface;
  let parserFactory: ParserFactoryInterface;
  let logger: LoggerInterface
  
  beforeEach(() => {
    registry = new ControllerRegistry();
    parserFactory = new ParserFactory();
    logger = new Logger(undefined, new TransportSilent());
    httpProtocol = new HttpProtocol(registry, parserFactory, logger);
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
  
  describe('getBody', () => {
    it('should parse JSON body when content-type is application/json', async () => {
      const protocol = httpProtocol as HttpProtocol;
      const req = mockRequest('POST', '/test', ContentTypeEnum.JSON, '{"name":"test"}');
      
      //@ts-expect-error
      const result = await protocol.getBody(req);
      
      expect(result).toEqual({ name: 'test' });
    });
    
    it('should parse TEXT body when content-type is text/plain', async () => {
      const protocol = httpProtocol as HttpProtocol;
      const req = mockRequest('POST', '/test', ContentTypeEnum.TEXT, '{"name":"test"}');
      
      //@ts-expect-error
      const result = await protocol.getBody(req);
      
      expect(result).toEqual({ name: 'test' });
    });
    
    it('should parse JSON with string value', async () => {
      const protocol = httpProtocol as HttpProtocol;
      const req = mockRequest('POST', '/test', ContentTypeEnum.JSON, '"simple string"');
      
      //@ts-expect-error
      const result = await protocol.getBody(req);
      
      expect(result).toBe('simple string');
    });
    
    it('should parse JSON with number value', async () => {
      const protocol = httpProtocol as HttpProtocol;
      const req = mockRequest('POST', '/test', ContentTypeEnum.JSON, '42');
      
      //@ts-expect-error
      const result = await protocol.getBody(req);
      
      expect(result).toBe(42);
    });
    
    it('should parse JSON with boolean value', async () => {
      const protocol = httpProtocol as HttpProtocol;
      const req = mockRequest('POST', '/test', ContentTypeEnum.JSON, 'true');
      
      //@ts-expect-error
      const result = await protocol.getBody(req);
      
      expect(result).toBe(true);
    });
    
    it('should parse TEXT with string value', async () => {
      const protocol = httpProtocol as HttpProtocol;
      const req = mockRequest('POST', '/test', ContentTypeEnum.TEXT, '"simple string"');
      
      //@ts-expect-error
      const result = await protocol.getBody(req);
      
      expect(result).toBe('simple string');
    });
    
    it('should parse TEXT with number value', async () => {
      const protocol = httpProtocol as HttpProtocol;
      const req = mockRequest('POST', '/test', ContentTypeEnum.TEXT, '42');
      
      //@ts-expect-error
      const result = await protocol.getBody(req);
      
      expect(result).toBe(42);
    });
    
    it('should parse TEXT with boolean value', async () => {
      const protocol = httpProtocol as HttpProtocol;
      const req = mockRequest('POST', '/test', ContentTypeEnum.TEXT, 'true');
      
      //@ts-expect-error
      const result = await protocol.getBody(req);
      
      expect(result).toBe(true);
    });
    
    it('should return null when no content-type is provided', async () => {
      const protocol = httpProtocol as HttpProtocol;
      const req = mockRequest('POST', '/test');
      
      //@ts-expect-error
      const result = await protocol.getBody(req);
      
      expect(result).toBeNull();
    });
  });
  
  describe('handleRequest with body', () => {
    it('should pass request body to handler', async () => {
      const controller = new Controller(undefined, TransportEnum.SILENT);
      const handlerSpy = jest.fn().mockReturnValue('ok');
      
      controller.post('/test', handlerSpy);
      registry.add(controller);
      
      const req = mockRequest('POST', '/test', ContentTypeEnum.JSON, '{"data":"test"}');
      const res = mockResponse();
      
      // Имитируем событие 'request' для проверки обработки
      //@ts-expect-error
      httpProtocol.server.emit('request', req, res);
      
      // Даём время на асинхронную обработку
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(handlerSpy).toHaveBeenCalled();
      expect(handlerSpy.mock.calls[0][0].body).toEqual({ data: 'test' });
    });
    
    it('should pass TEXT content-type body to handler', async () => {
      const controller = new Controller(undefined, TransportEnum.SILENT);
      const handlerSpy = jest.fn().mockReturnValue('ok');
      
      controller.post('/test', handlerSpy);
      registry.add(controller);
      
      const req = mockRequest('POST', '/test', ContentTypeEnum.TEXT, '{"message":"hello"}');
      const res = mockResponse();
      
      // Имитируем событие 'request' для проверки обработки
      //@ts-expect-error
      httpProtocol.server.emit('request', req, res);
      
      // Даём время на асинхронную обработку
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(handlerSpy).toHaveBeenCalled();
      expect(handlerSpy.mock.calls[0][0].body).toEqual({ message: 'hello' });
    });
    
    it('should pass string value in JSON body to handler', async () => {
      const controller = new Controller(undefined, TransportEnum.SILENT);
      const handlerSpy = jest.fn().mockReturnValue('ok');
      
      controller.post('/test-string', handlerSpy);
      registry.add(controller);
      
      const req = mockRequest('POST', '/test-string', ContentTypeEnum.JSON, '"string value"');
      const res = mockResponse();
      
      // Имитируем событие 'request' для проверки обработки
      //@ts-expect-error
      httpProtocol.server.emit('request', req, res);
      
      // Даём время на асинхронную обработку
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(handlerSpy).toHaveBeenCalled();
      expect(handlerSpy.mock.calls[0][0].body).toBe('string value');
      expect(typeof handlerSpy.mock.calls[0][0].body).toBe('string');
    });
    
    it('should pass number value in JSON body to handler', async () => {
      const controller = new Controller(undefined, TransportEnum.SILENT);
      const handlerSpy = jest.fn().mockReturnValue('ok');
      
      controller.post('/test-number', handlerSpy);
      registry.add(controller);
      
      const req = mockRequest('POST', '/test-number', ContentTypeEnum.JSON, '42.5');
      const res = mockResponse();
      
      // Имитируем событие 'request' для проверки обработки
      //@ts-expect-error
      httpProtocol.server.emit('request', req, res);
      
      // Даём время на асинхронную обработку
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(handlerSpy).toHaveBeenCalled();
      expect(handlerSpy.mock.calls[0][0].body).toBe(42.5);
      expect(typeof handlerSpy.mock.calls[0][0].body).toBe('number');
    });
    
    it('should pass boolean value in JSON body to handler', async () => {
      const controller = new Controller(undefined, TransportEnum.SILENT);
      const handlerSpy = jest.fn().mockReturnValue('ok');
      
      controller.post('/test-boolean', handlerSpy);
      registry.add(controller);
      
      const req = mockRequest('POST', '/test-boolean', ContentTypeEnum.JSON, 'false');
      const res = mockResponse();
      
      // Имитируем событие 'request' для проверки обработки
      //@ts-expect-error
      httpProtocol.server.emit('request', req, res);
      
      // Даём время на асинхронную обработку
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(handlerSpy).toHaveBeenCalled();
      expect(handlerSpy.mock.calls[0][0].body).toBe(false);
      expect(typeof handlerSpy.mock.calls[0][0].body).toBe('boolean');
    });
    
    it('should pass string value in TEXT body to handler', async () => {
      const controller = new Controller(undefined, TransportEnum.SILENT);
      const handlerSpy = jest.fn().mockReturnValue('ok');
      
      controller.post('/test-text-string', handlerSpy);
      registry.add(controller);
      
      const req = mockRequest('POST', '/test-text-string', ContentTypeEnum.TEXT, '"text string"');
      const res = mockResponse();
      
      // Имитируем событие 'request' для проверки обработки
      //@ts-expect-error
      httpProtocol.server.emit('request', req, res);
      
      // Даём время на асинхронную обработку
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(handlerSpy).toHaveBeenCalled();
      expect(handlerSpy.mock.calls[0][0].body).toBe('text string');
      expect(typeof handlerSpy.mock.calls[0][0].body).toBe('string');
    });
    
    it('should pass number value in TEXT body to handler', async () => {
      const controller = new Controller(undefined, TransportEnum.SILENT);
      const handlerSpy = jest.fn().mockReturnValue('ok');
      
      controller.post('/test-text-number', handlerSpy);
      registry.add(controller);
      
      const req = mockRequest('POST', '/test-text-number', ContentTypeEnum.TEXT, '999');
      const res = mockResponse();
      
      // Имитируем событие 'request' для проверки обработки
      //@ts-expect-error
      httpProtocol.server.emit('request', req, res);
      
      // Даём время на асинхронную обработку
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(handlerSpy).toHaveBeenCalled();
      expect(handlerSpy.mock.calls[0][0].body).toBe(999);
      expect(typeof handlerSpy.mock.calls[0][0].body).toBe('number');
    });
    
    it('should pass boolean value in TEXT body to handler', async () => {
      const controller = new Controller(undefined, TransportEnum.SILENT);
      const handlerSpy = jest.fn().mockReturnValue('ok');
      
      controller.post('/test-text-boolean', handlerSpy);
      registry.add(controller);
      
      const req = mockRequest('POST', '/test-text-boolean', ContentTypeEnum.TEXT, 'true');
      const res = mockResponse();
      
      // Имитируем событие 'request' для проверки обработки
      //@ts-expect-error
      httpProtocol.server.emit('request', req, res);
      
      // Даём время на асинхронную обработку
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(handlerSpy).toHaveBeenCalled();
      expect(handlerSpy.mock.calls[0][0].body).toBe(true);
      expect(typeof handlerSpy.mock.calls[0][0].body).toBe('boolean');
    });
    
    it('should pass null body when no content-type', async () => {
      const controller = new Controller(undefined, TransportEnum.SILENT);
      const handlerSpy = jest.fn().mockReturnValue('ok');
      
      controller.post('/test', handlerSpy);
      registry.add(controller);
      
      const req = mockRequest('POST', '/test');
      const res = mockResponse();
      
      // Имитируем событие 'request' для проверки обработки
      //@ts-expect-error
      httpProtocol.server.emit('request', req, res);
      
      // Даём время на асинхронную обработку
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(handlerSpy).toHaveBeenCalled();
      expect(handlerSpy.mock.calls[0][0].body).toBeNull();
    });
  });

  it('should handle request with middleware', async () => {
    const handler = jest.fn();
    const mockReq = mockRequest('GET', '/test');
    const mockRes = mockResponse();
    
    const middlewareExecutionOrder: number[] = [];
    const middleware1: MiddlewareHandler = async (_req, _res, next) => {
      middlewareExecutionOrder.push(1);
      await next();
    };
    const middleware2: MiddlewareHandler = async (_req, _res, next) => {
      middlewareExecutionOrder.push(2);
      await next();
    };

    const controller = new Controller(undefined, TransportEnum.SILENT);
    controller.use(middleware1);
    controller.use(middleware2);
    controller.get('/test', handler);
    registry.add(controller);
    //@ts-expect-error
    await httpProtocol.handleRequest(mockReq, mockRes);

    expect(middlewareExecutionOrder).toEqual([1, 2]);
    expect(handler).toHaveBeenCalled();
  });

  it('should modify request object in middleware and pass modified data to handler', async () => {
    const handler = jest.fn();
    const mockReq = mockRequest('GET', '/test');
    const mockRes = mockResponse();
    
    const middleware: MiddlewareHandler = async (req, _res, next) => {
      // @ts-ignore
      req.modifiedData = 'modified by middleware';
      await next();
    };

    const controller = new Controller(undefined, TransportEnum.SILENT);
    controller.use(middleware);
    controller.get('/test', handler);
    registry.add(controller);
    //@ts-expect-error
    await httpProtocol.handleRequest(mockReq, mockRes);

    expect(handler).toHaveBeenCalled();
    // @ts-ignore
    expect(handler.mock.calls[0][0].modifiedData).toBe('modified by middleware');
  });
}); 