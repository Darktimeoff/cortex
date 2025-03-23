import { getPromisifiedValue } from './get-promisified-value.util';

describe('getPromisifiedValue', () => {
  it('should return the same value for non-promise values', async () => {
    // Arrange
    const numberValue = 42;
    const stringValue = 'test';
    const objectValue = { key: 'value' };
    const arrayValue = [1, 2, 3];
    
    // Act & Assert
    expect(await getPromisifiedValue(numberValue)).toBe(numberValue);
    expect(await getPromisifiedValue(stringValue)).toBe(stringValue);
    expect(await getPromisifiedValue(objectValue)).toBe(objectValue);
    expect(await getPromisifiedValue(arrayValue)).toBe(arrayValue);
  });

  it('should resolve promise and return the resolved value', async () => {
    // Arrange
    const promiseValue = Promise.resolve('resolved value');
    
    // Act
    const result = await getPromisifiedValue(promiseValue);
    
    // Assert
    expect(result).toBe('resolved value');
  });

  it('should handle promise rejection correctly', async () => {
    // Arrange
    const error = new Error('test error');
    const promiseValue = Promise.reject(error);
    
    // Act & Assert
    await expect(getPromisifiedValue(promiseValue)).rejects.toThrow('test error');
  });
}); 