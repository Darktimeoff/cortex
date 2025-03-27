import { Cortex } from './cortex';
import { ProtocolEnum } from '@/protocol';
import { TransportEnum } from '@/logger';
import { ProtocolInterface } from '@/protocol';

jest.mock('@/protocol/protocol-factory', () => {
  const mockUseExceptionFilter = jest.fn().mockReturnThis();
  const mockListen = jest.fn().mockReturnThis();
  const mockClose = jest.fn().mockReturnThis();
  
  return {
    ProtocolFactory: {
      getProtocol: jest.fn().mockReturnValue({
        listen: mockListen,
        close: mockClose,
        useExceptionFilter: mockUseExceptionFilter
      })
    }
  };
});

const mockProtocolFactory = jest.requireMock('@/protocol/protocol-factory').ProtocolFactory;
const mockProtocol = mockProtocolFactory.getProtocol();

describe('Cortex Error Handler', () => {
  let cortex: Cortex;

  beforeEach(() => {
    jest.clearAllMocks();
    cortex = new Cortex({protocol: ProtocolEnum.HTTP, logger: TransportEnum.SILENT});
  });

  it('should register exception filter with protocol', () => {
    const exceptionHandler = jest.fn();
    cortex.useExceptionFilter(exceptionHandler);
    
    expect(mockProtocol.useExceptionFilter).toHaveBeenCalledWith(exceptionHandler);
  });

  it('should chain useExceptionFilter method', () => {
    const exceptionHandler = jest.fn();
    const result = cortex.useExceptionFilter(exceptionHandler);
    
    expect(result).toBe(cortex);
  });

  it('should delegate exception filter to protocol', () => {
    const protocol = cortex['protocol'] as jest.Mocked<ProtocolInterface>;
    const spy = jest.spyOn(protocol, 'useExceptionFilter');
    
    const exceptionHandler = jest.fn();
    cortex.useExceptionFilter(exceptionHandler);
    
    expect(spy).toHaveBeenCalledWith(exceptionHandler);
  });
  
  it('should register exception filter before listening', () => {
    const exceptionHandler = jest.fn();
    
    cortex.useExceptionFilter(exceptionHandler);
    cortex.listen(3000);
    
    expect(mockProtocol.useExceptionFilter).toHaveBeenCalled();
    expect(mockProtocol.listen).toHaveBeenCalled();
    
    const useExceptionFilterCallIndex = 
      mockProtocol.useExceptionFilter.mock.invocationCallOrder[0];
    const listenCallIndex = 
      mockProtocol.listen.mock.invocationCallOrder[0];
    
    expect(useExceptionFilterCallIndex).toBeLessThan(listenCallIndex);
  });
}); 