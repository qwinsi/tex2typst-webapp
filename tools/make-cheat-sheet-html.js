import * as Sqrl from 'squirrelly'
import { fileURLToPath } from 'url';
import path from 'path';
import toml from 'toml';
import fs from 'node:fs';
import { tex2typst, shorthandMap } from 'tex2typst';
import katex from 'katex';

// TODO:
// () https://github.com/siefkenj/latex-parser/blob/master/table-generation/data/katex-support-table.md
// () https://tug.ctan.org/info/undergradmath/undergradmath.pdf
// () https://personal.math.ubc.ca/~cautis/tools/latexmath.html
// () https://www.cmor-faculty.rice.edu/~heinken/latex/symbols.pdf
// () https://typst.app/docs/reference/symbols/sym/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

shorthandMap.set('infinity', 'oo');

// latex: \alpha \beta \gamma \delta \epsilon \zeta \eta \theta \iota \kappa \lambda \mu \nu \xi \omicron \pi \rho \sigma \tau \upsilon \phi \chi \psi \omega
// typst: alpha beta gamma delta epsilon.alt zeta eta theta iota kappa lambda mu nu xi omicron pi rho sigma tau upsilon phi.alt chi psi omega
// latex: \varepsilon \vartheta \varpi \varrho \varsigma \varphi
// typst: epsilon theta.alt pi.alt rho.alt sigma.alt phi
const lowercase_greek_letters = [
    'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi',
    'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega',
    'varepsilon', 'vartheta', 'varpi', 'varrho', 'varsigma', 'varphi',
];

// latex: \Gamma \Delta \Theta \Lambda \Xi \Pi \Sigma \Upsilon \Phi \Psi \Omega
// typst: Gamma Delta Theta Lambda Xi Pi Sigma Upsilon Phi Psi Omega
const uppercase_greek_letters = [
    'Gamma', 'Delta', 'Theta', 'Lambda', 'Xi', 'Pi', 'Sigma', 'Upsilon', 'Phi', 'Psi', 'Omega',
];


// Integral symbols
// latex:  \int \oint \iint \oiint \iiint \oiiint
// typst: integral integral.cont integral.double integral.surf integral.triple integral.vol
const integral_symbols = [
    'int', 'oint', 'iint', 'oiint', 'iiint', 'oiiint'
];

// Font symbols
// latex: \boldsymbol{A} \mathbb{A} \mathbf{A} \mathcal{A} \mathit{A} \mathfrak{A} \mathrm{A} \mathsf{A} \mathtt{A}
// typst: bold(A) bb(A) upright(bold(A)) cal(A) italic(A) frak(A) upright(A) sans(A) mono(A)
const font_symbols = [
    'boldsymbol{A}', 'mathbb{A}', 'mathbf{A}', 'mathcal{A}', 'mathit{A}', 'mathfrak{A}', 'mathrm{A}', 'mathsf{A}', 'mathtt{A}'
];


const arrow_symbols = [
    'leftarrow',
    'gets',
    'rightarrow',
    'to',
    'leftrightarrow',
    'Leftarrow',
    'Rightarrow',
    'Leftrightarrow',
    'mapsto',
    'hookleftarrow',
    'leftharpoonup',
    'leftharpoondown',
    'rightleftharpoons',
    'longleftarrow',
    'longrightarrow',
    'longleftrightarrow',
    'Longleftarrow',
    'Longrightarrow',
    'Longleftrightarrow',
    'longmapsto',
    'hookrightarrow',
    'rightharpoonup',
    'rightharpoondown',
    'iff',
    'implies',
    'uparrow',
    'downarrow',
    'updownarrow',
    'Uparrow',
    'Downarrow',
    'Updownarrow',
    'nearrow',
    'searrow',
    'swarrow',
    'nwarrow',
    // 'leftsquigarrow',
    // 'rightsquigarrow',
    'leadsto',
    'leftleftarrows',
    'rightrightarrows',
];

// Set and Elements
// latex: \in \subset \subseteq \supset \supseteq \varnothing
// typst: in subset subset.eq supset supset.eq diameter
const set_and_elements = [
    'in', 'subset', 'subseteq', 'supset', 'supseteq', 'varnothing'
];

// non-math symbols
// latex: \$ \pounds \yen \copyright \S \P
const non_math_symbols = [
    '$', 'pounds', 'yen', 'copyright', 'S', 'P'
];


// How do you insert unescaped HTML? · Issue #6 · nebrelbug/squirrelly.js.org
// https://github.com/nebrelbug/squirrelly.js.org/issues/6
function render(latex, displayMode = false) {
    const options = {
        displayMode: displayMode,
        output: 'html'
    }
    return katex.renderToString(latex, options);
}

function mapToLatexTypstPair(latexName) {
    const typst_name = tex2typst(`\\${latexName}`, { preferShorthands: false });
    return {
        latex: `\\${latexName}`,
        typst: typst_name,
        shorthand: shorthandMap.get(typst_name) || "",
    }
}

function main() {
    const data = {};
    data.lowercase_greek_letters = lowercase_greek_letters.map(mapToLatexTypstPair);
    data.uppercase_greek_letters = uppercase_greek_letters.map(mapToLatexTypstPair);
    data.integral_symbols = integral_symbols.map(mapToLatexTypstPair);
    data.font_symbols = font_symbols.map(mapToLatexTypstPair);
    data.arrow_symbols = arrow_symbols.map(mapToLatexTypstPair);
    data.set_and_elements = set_and_elements.map(mapToLatexTypstPair);
    data.non_math_symbols = non_math_symbols.map(mapToLatexTypstPair);

    const cheatSheetTomlFile = path.join(__dirname, '../src/template/cheat-sheet.toml');
    const toml_obj = toml.parse(fs.readFileSync(cheatSheetTomlFile, { encoding: 'utf-8' }));
    // void toml_obj.math_commands;
    const symbols_unsupported_by_katex = [
        'iiiint',
        'slash',
    ]
    for (const symbol of symbols_unsupported_by_katex) {
        delete toml_obj.math_symbols[symbol];
    }

    data.misc_symbols = Object.entries(toml_obj.math_symbols).filter(([latexName, typst]) => {
        // filter out symbols that are already included above
        void typst;
        const lists = [
            lowercase_greek_letters,
            uppercase_greek_letters,
            integral_symbols,
            font_symbols,
            arrow_symbols,
            set_and_elements,
            non_math_symbols,
        ];
        for (const list of lists) {
            if (list.includes(latexName)) {
                return false;
            }
        }
        return true;
    }).map(([latexName, typst]) => {
        return {
            latex: `\\${latexName}`,
            typst: typst,
            shorthand: shorthandMap.get(typst) || "",
        }
    });

    data.render = render;


    const cheatSheetTemplateFile = path.join(__dirname, '../src/template/cheat-sheet.tp.html');
    const template = fs.readFileSync(cheatSheetTemplateFile, { encoding: 'utf-8' });
    const output = Sqrl.render(template, data);

    const outputHtmlFile = path.join(__dirname, '../public/cheat-sheet.html');
    fs.writeFileSync(outputHtmlFile, output);
}

main();
