import { Cortex } from './cortex';
import { ProtocolEnum } from '@/protocol';
import { TransportEnum } from '@/logger';
import { ProtocolInterface } from '@/protocol';

const mockUseExceptionFilter = jest.fn(() => mockProtocol);
const mockListen = jest.fn(() => mockProtocol);
const mockClose = jest.fn(() => mockProtocol);

const mockProtocol: ProtocolInterface = {
  listen: mockListen,
  close: mockClose,
  useExceptionFilter: mockUseExceptionFilter
};


describe('Cortex Error Handler', () => {
  let cortex: Cortex;

  beforeEach(() => {
    mockListen.mockReset();
    mockClose.mockReset();
    mockUseExceptionFilter.mockReset();

    cortex = new Cortex({protocol: ProtocolEnum.HTTP, logger: TransportEnum.SILENT});
    cortex['protocol'] = mockProtocol;
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
      //@ts-expect-error
      mockProtocol.useExceptionFilter.mock.invocationCallOrder[0];
    const listenCallIndex = 
      //@ts-expect-error
      mockProtocol.listen.mock.invocationCallOrder[0];
    
    expect(useExceptionFilterCallIndex).toBeLessThan(listenCallIndex);
  });
}); 