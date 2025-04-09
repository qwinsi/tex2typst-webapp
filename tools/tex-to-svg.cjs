/**
 * Adpated from https://github.com/mathjax/MathJax-demos-node/blob/master/direct/tex2svg
 */

// Load the packages needed for MathJax
const { mathjax } = require('mathjax-full/js/mathjax.js');
const { TeX } = require('mathjax-full/js/input/tex.js');
const { SVG } = require('mathjax-full/js/output/svg.js');
const { liteAdaptor } = require('mathjax-full/js/adaptors/liteAdaptor.js');
const {RegisterHTMLHandler} = require('mathjax-full/js/handlers/html.js');
const { AllPackages } = require('mathjax-full/js/input/tex/AllPackages.js');



// Create DOM adaptor and register it for HTML documents
const adaptor = liteAdaptor();
const handler = RegisterHTMLHandler(adaptor);
void handler;

// Create input and output jax and a document using them on the content from the HTML file
const tex = new TeX({ packages: AllPackages });
const svg = new SVG({ fontCache: 'local' });
const mathjax_document = mathjax.document('', { InputJax: tex, OutputJax: svg });


function convert_tex_to_svg(tex) {
  const node = mathjax_document.convert(tex, {
    display: true,
    em: 16,
    ex: 8,
  });

  return adaptor.innerHTML(node);
}

module.exports = {
  convert_tex_to_svg
};
