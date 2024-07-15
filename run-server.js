import { startServer } from './server.js';

async function main() {
  const isProduction = process.env.NODE_ENV === 'production'
  const { server, baseUrl } = await startServer(isProduction);
  void server;
  console.log(`Server started at ${baseUrl}`);
}

main();

