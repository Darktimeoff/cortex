import { Cortex } from '@/cortex';
import { TransportEnum } from '@/logger';
import { ProtocolEnum } from '@/protocol';
import autocannon from 'autocannon';

async function startServer() {
  // Запуск сервера как отдельный процесс
  const server = new Cortex({logger: TransportEnum.SILENT, protocol: ProtocolEnum.HTTP})
    .get('/', () => ({
      message: 'Hello World'
    }))
    .listen(3000, () => {
      console.log('Server started. Running benchmarks...');
    });
  
  
  return server;
}

const AUTOCANNON_CONFIG = {
  connections: 100,
  duration: 30,
  pipelining: 10,
}
const BASE_URL = 'http://localhost:3000/';

async function runBenchmark() {
  const server = await startServer();
  
  try {
    const result = await autocannon({
      url: BASE_URL,
      ...AUTOCANNON_CONFIG,
      title: 'Root Endpoint'
    });
    
    console.log('BENCHMARK RESULTS:');
    console.log('===================');
    console.log(autocannon.printResult(result));
  } catch (error) {
    console.error('Error running benchmark:', error);
  } finally {
    server.close();
    console.log('Server stopped.');
  }
}

runBenchmark().catch(console.error); 