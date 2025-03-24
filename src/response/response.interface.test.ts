import { ServerResponse } from 'node:http';
import { ResponseInterface } from './response.interface';
import { Response } from './response';

describe('ResponseInterface', () => {
  let mockServerResponse: ServerResponse;

  beforeEach(() => {
    mockServerResponse = {
      writeHead: jest.fn(),
      end: jest.fn(),
    } as unknown as ServerResponse;
  });
  it('should be defined', () => {
    const response: ResponseInterface = new Response(mockServerResponse);
    expect(response).toBeDefined();
    expect(response.response).toBe(mockServerResponse);
  });
}); 