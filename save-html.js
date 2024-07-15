import { startServer } from './server.js';
import http from 'node:http';

async function main() {
    const { server, baseUrl } = await startServer();
    
    http.get(baseUrl, (res) => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];
      
        // Any 2xx status code signals a successful response but
        // here we're only checking for 200.
        if (statusCode !== 200) {
          throw new Error(`Request Failed. Status Code: ${statusCode}`);
        } else if (!/^text\/html/.test(contentType)) {
          throw new Error(`Invalid content-type.\n Expecting text/html but received ${contentType}`);
        }
      
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            console.log(rawData);
        });
      });
}

main();
