import { Cortex } from './cortex';

// Мокируем модуль перед объявлением переменных
jest.mock('@/protocol/protocol-factory', () => {
  const mockListen = jest.fn().mockReturnThis();
  return {
    ProtocolFactory: {
      getProtocol: jest.fn().mockReturnValue({
        listen: mockListen
      })
    }
  };
});

// Получаем доступ к моку после его создания
const mockProtocolFactory = jest.requireMock('@/protocol/protocol-factory').ProtocolFactory;
const mockGetProtocol = mockProtocolFactory.getProtocol;

describe('Cortex', () => {
  let cortex: Cortex;

  beforeEach(() => {
    jest.clearAllMocks();
    cortex = new Cortex();
  });

  it('should create an instance of Cortex', () => {
    expect(cortex).toBeInstanceOf(Cortex);
  });

  it('should register GET route', () => {
    const handler = jest.fn();
    const result = cortex.get('/test', handler);
    
    expect(result).toBe(cortex);
  });

  it('should register POST route', () => {
    const handler = jest.fn();
    const result = cortex.post('/test', handler);
    
    expect(result).toBe(cortex);
  });

  it('should register PUT route', () => {
    const handler = jest.fn();
    const result = cortex.put('/test', handler);
    
    expect(result).toBe(cortex);
  });

  it('should register DELETE route', () => {
    const handler = jest.fn();
    const result = cortex.delete('/test', handler);
    
    expect(result).toBe(cortex);
  });

  it('should start server on specified port', () => {
    const callback = jest.fn();
    cortex.listen(3000, callback);
    
    expect(mockGetProtocol).toHaveBeenCalled();
  });
}); 