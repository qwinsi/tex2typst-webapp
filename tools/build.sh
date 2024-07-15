echo "Hello"
exit
npm run build:client
npm run buid:server
cp -r dist/client/ dist/deploy/
rm -r dist/deploy/.vite
npx cross-env NODE_ENV=production node save-html.js > dist/deploy/index.html
cp dist/deploy/index.hml dist/deploy/offline.html
