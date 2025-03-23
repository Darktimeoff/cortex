import { ParserFactory } from './parser-factory';
import { ContentTypeEnum } from '@/generic/enum/content-type.enum';
import { IncomingMessage } from 'node:http';
import { ParserJsonFactory } from './factory/parser-json.factory';
import { ParserTextFactory } from './factory/parser-text.factory';
import { ParserNotFoundError } from './parser.error';
import { Readable } from 'node:stream';

describe('ParserFactory', () => {
  let parserFactory: ParserFactory;
  let mockRequest: IncomingMessage;

  beforeEach(() => {
    parserFactory = new ParserFactory();
    mockRequest = new Readable() as unknown as IncomingMessage;
    mockRequest.push('{"test": "data"}');
    mockRequest.push(null);
  });

  it('should create parsers for supported content types', () => {
    //@ts-expect-error
    const jsonParser = parserFactory.parsers.get(ContentTypeEnum.JSON);
    //@ts-expect-error
    const textParser = parserFactory.parsers.get(ContentTypeEnum.TEXT);

    expect(jsonParser).toBeInstanceOf(ParserJsonFactory);
    expect(textParser).toBeInstanceOf(ParserTextFactory);
  });

  it('should parse JSON content type', async () => {
    const result = await parserFactory.parse(ContentTypeEnum.JSON, mockRequest);
    
    expect(result).toEqual({ test: 'data' });
  });

  it('should parse TEXT content type', async () => {
    const result = await parserFactory.parse(ContentTypeEnum.TEXT, mockRequest);
    
    expect(result).toEqual({ test: 'data' });
  });

  it('should throw ParserNotFoundError for unsupported content type', async () => {
    await expect(async () => {
      await parserFactory.parse(ContentTypeEnum.FORM_DATA, mockRequest);
    }).rejects.toThrow(ParserNotFoundError);
  });

  it('should throw error with correct content type property', async () => {
    let thrownError: Error | null = null;
    
    try {
      await parserFactory.parse(ContentTypeEnum.FORM_DATA, mockRequest);
    } catch (error) {
      thrownError = error as Error;
    }
    
    expect(thrownError).toBeInstanceOf(ParserNotFoundError);
    expect((thrownError as ParserNotFoundError).contentType).toBe(ContentTypeEnum.FORM_DATA);
  });
}); 