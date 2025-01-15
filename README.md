# tex2typst-webapp

Translate LaTeX or TeX math markup to typst in your browser.

Demo screenshot:

![Screenshot](./screenshot.png)

This project is a Web UI wrapper. The core algorithm is implemented in [qwinsi/tex2typst](https://github.com/qwinsi/tex2typst).

## Trying Online

A static web App is deployed on [Github page](https://qwinsi.github.io/tex2typst-webapp/).

## Development

### Installing Dependencies and Running

```sh
yarn install # or npm install
npm run make:sw
npm run make:html
npm run dev
```

### Building

```sh
npm run build
```
