
import { Readable } from 'node:stream';
import { getDataFromStream } from './get-data-from-stream.util';

describe('getDataFromStream', () => {
  it('should collect data from stream', async () => {
    const testData = 'test data';
    const stream = Readable.from([Buffer.from(testData)]);

    const result = await getDataFromStream(stream);

    expect(result.toString()).toBe(testData);
  });

  it('should collect data from stream with multiple chunks', async () => {
    const chunks = ['chunk1', 'chunk2', 'chunk3'];
    const stream = Readable.from(chunks.map(chunk => Buffer.from(chunk)));

    const result = await getDataFromStream(stream);

    expect(result.toString()).toBe(chunks.join(''));
  });

  it('should handle empty stream', async () => {
    const stream = Readable.from([]);

    const result = await getDataFromStream(stream);

    expect(result.toString()).toBe('');
    expect(result.length).toBe(0);
  });

  it('should reject when stream emits error', async () => {
    const errorMessage = 'Test stream error';
    const stream = new Readable({
      read() {
        this.emit('error', new Error(errorMessage));
      }
    });

    await expect(getDataFromStream(stream)).rejects.toThrow(errorMessage);
  });

  it('should handle binary data correctly', async () => {
    const binaryData = Buffer.from([0x01, 0x02, 0x03, 0x04]);
    const stream = Readable.from([binaryData]);

    const result = await getDataFromStream(stream);

    expect(Buffer.compare(result, binaryData)).toBe(0);
  });
});