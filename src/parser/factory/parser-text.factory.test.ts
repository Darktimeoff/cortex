import { ParserTextFactory } from './parser-text.factory';
import { IncomingMessage } from 'node:http';
import { ContentTypeEnum } from '@/generic/enum/content-type.enum';
import { Readable } from 'node:stream';

describe('ParserTextFactory', () => {
  let parserFactory: ParserTextFactory;
  let mockRequest: IncomingMessage;

  beforeEach(() => {
    parserFactory = new ParserTextFactory();
  });

  it('should parse JSON text as JSON object', async () => {
    mockRequest = new Readable() as unknown as IncomingMessage;
    mockRequest.push('{"name": "test", "value": 123}');
    mockRequest.push(null);

    const result = await parserFactory.parse(ContentTypeEnum.TEXT, mockRequest);
    
    expect(result).toEqual({ name: 'test', value: 123 });
  });

  it('should throw error on invalid JSON', async () => {
    mockRequest = new Readable() as unknown as IncomingMessage;
    mockRequest.push('plain text without json format');
    mockRequest.push(null);

    await expect(parserFactory.parse(ContentTypeEnum.TEXT, mockRequest))
      .rejects
      .toThrow(SyntaxError);
  });
}); 