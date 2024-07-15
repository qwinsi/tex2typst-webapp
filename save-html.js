/**
 * This program save the HTML content of the base URL to given file path.
 * node save-html.js <file-path>
 */
import http from 'node:http';
import fs from 'fs';

import { startServer } from './server.js';


async function main() {
    if (process.argv.length !== 3) {
        console.error('Usage: node save-html.js <file-path>');
        process.exit(1);
    }
    const filePath = process.argv[2];

    const { server, baseUrl } = await startServer(true);

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
            fs.writeFileSync(filePath, rawData);
            server.close();
            process.exit(0);
        });
      });
}

main();
