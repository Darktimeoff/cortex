import { ResponseInterface } from './response.interface';

describe('ResponseInterface', () => {
  it('should be defined', () => {
    // Проверяем, что интерфейс определен
    const responseType: ResponseInterface = {};
    expect(responseType).toBeDefined();
  });
}); 