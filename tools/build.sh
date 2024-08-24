rm -rf dist/deploy &&
npm run make:html &&
npm run build:client &&
npm run build:server &&
cp -r dist/client dist/deploy &&
rm -r dist/deploy/.vite &&
node save-html.js dist/deploy/index.html &&
cp dist/deploy/index.html dist/deploy/offline.html
