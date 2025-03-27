import { HttpProtocol } from './http';
import { ServerResponse, IncomingMessage } from 'http';
import { ControllerRegistry } from '@/controller-registry';
import { ParserFactory } from '@/parser';
import { Logger, TransportSilent } from '@/logger';
import { Readable } from 'stream';
import { Controller } from '@/controller';

class HttpError extends Error {
  constructor(
    message: string, 
    public readonly statusCode: number = 500,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

const mockRequest = (method: string = 'GET', url: string = '/test') => {
  const req = new Readable() as unknown as IncomingMessage;
  req.method = method;
  req.url = url;
  req.headers = {};
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

describe('HttpProtocol Error Handler', () => {
  let httpProtocol: HttpProtocol;
  let controller: Controller;
  let registry: ControllerRegistry;
  
  beforeEach(() => {
    registry = new ControllerRegistry();
    const parserFactory = new ParserFactory();
    const logger = new Logger(undefined, new TransportSilent());
    
    httpProtocol = new HttpProtocol(registry, parserFactory, logger);
    controller = new Controller();
    registry.add(controller);
  });
  
  afterEach(() => {
    httpProtocol.close();
  });
  
  it('should use exception filter to handle errors', async () => {
    const exceptionHandlerSpy = jest.fn().mockReturnValue({ 
      handled: true,
      error: 'Test error'
    });
    
    httpProtocol.useExceptionFilter(exceptionHandlerSpy);
    
    controller.get('/error', () => {
      throw new Error('Test error');
    });
    
    const req = mockRequest('GET', '/error');
    const res = mockResponse();
    

    // @ts-expect-error
    await httpProtocol.handleException(req, res);
    
    expect(exceptionHandlerSpy).toHaveBeenCalled();
    

    const errorArg = exceptionHandlerSpy.mock.calls[0][0];
    expect(errorArg).toBeInstanceOf(Error);
    expect(errorArg.message).toBe('Test error');
    

    expect(exceptionHandlerSpy.mock.calls[0][1]).toBe(req);
    expect(exceptionHandlerSpy.mock.calls[0][2]).toBe(res);
    
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ 
      handled: true,
      error: 'Test error'
    }));
  });
  
  it('should preserve status code from HttpError', async () => {
    httpProtocol.useExceptionFilter((error, _req, res) => {
      if (error instanceof HttpError) {
        res.statusCode = error.statusCode;
      }
      return { message: error.message };
    });
    
    controller.get('/not-found', () => {
      throw new HttpError('Not found', 404);
    });
    
    const req = mockRequest('GET', '/not-found');
    const res = mockResponse();
    
    // @ts-expect-error
    await httpProtocol.handleException(req, res);
    
    expect(res.statusCode).toBe(404);
    

    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ 
      message: 'Not found'
    }));
  });
  
  it('should handle async route handlers that reject', async () => {
    const exceptionHandlerSpy = jest.fn().mockReturnValue({ 
      handled: true,
      async: true
    });
    
    httpProtocol.useExceptionFilter(exceptionHandlerSpy);
    
    controller.get('/async-error', async () => {
      throw new Error('Async error');
    });
    
    const req = mockRequest('GET', '/async-error');
    const res = mockResponse();
    
    // @ts-expect-error
    await httpProtocol.handleException(req, res);
    
    expect(exceptionHandlerSpy).toHaveBeenCalled();
    
    const errorArg = exceptionHandlerSpy.mock.calls[0][0];
    expect(errorArg).toBeInstanceOf(Error);
    expect(errorArg.message).toBe('Async error');
  });
  
  it('should rethrow error if no exception handler is registered', async () => {
    controller.get('/unhandled-error', () => {
      throw new Error('Unhandled error');
    });
    
    const req = mockRequest('GET', '/unhandled-error');
    const res = mockResponse();
    
    // @ts-expect-error
    await expect(httpProtocol.handleException(req, res)).rejects.toThrow('Unhandled error');
  });
}); 