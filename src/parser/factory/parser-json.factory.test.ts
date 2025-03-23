import { ParserJsonFactory } from './parser-json.factory';
import { IncomingMessage } from 'node:http';
import { ContentTypeEnum } from '@/generic/enum/content-type.enum';
import { Readable } from 'node:stream';

describe('ParserJsonFactory', () => {
  let parserFactory: ParserJsonFactory;
  let mockRequest: IncomingMessage;

  beforeEach(() => {
    parserFactory = new ParserJsonFactory();
  });

  it('should parse JSON data correctly', async () => {
    mockRequest = new Readable() as unknown as IncomingMessage;
    mockRequest.push('{"name": "test", "value": 123}');
    mockRequest.push(null);

    const result = await parserFactory.parse(ContentTypeEnum.JSON, mockRequest);
    
    expect(result).toEqual({ name: 'test', value: 123 });
  });

  it('should throw error on invalid JSON', async () => {
    mockRequest = new Readable() as unknown as IncomingMessage;
    mockRequest.push('{"invalid JSON');
    mockRequest.push(null);

    await expect(parserFactory.parse(ContentTypeEnum.JSON, mockRequest))
      .rejects
      .toThrow(SyntaxError);
  });

  it('should handle empty body', async () => {
    mockRequest = new Readable() as unknown as IncomingMessage;
    mockRequest.push('');
    mockRequest.push(null);

    await expect(parserFactory.parse(ContentTypeEnum.JSON, mockRequest))
      .rejects
      .toThrow(SyntaxError);
  });

  it('should handle array data', async () => {
    mockRequest = new Readable() as unknown as IncomingMessage;
    mockRequest.push('[1, 2, 3, "test"]');
    mockRequest.push(null);

    const result = await parserFactory.parse(ContentTypeEnum.JSON, mockRequest);
    
    expect(result).toEqual([1, 2, 3, 'test']);
  });
}); 