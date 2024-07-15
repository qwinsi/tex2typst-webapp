import { startServer } from './server.js';

async function main() {
  const { server, baseUrl } = await startServer();
  void server;
  console.log(`Server started at ${baseUrl}`);
}

main();

