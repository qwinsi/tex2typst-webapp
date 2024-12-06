import * as Sqrl from 'squirrelly'
import { fileURLToPath } from 'url';
import path from 'path';
import toml from 'toml';
import fs from 'node:fs';
import { tex2typst, symbolMap } from 'tex2typst';

// TODO: https://personal.math.ubc.ca/~cautis/tools/latexmath.html
//       https://www.cmor-faculty.rice.edu/~heinken/latex/symbols.pdf
//       https://typst.app/docs/reference/symbols/sym/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const lowercase_greek_letters = [
    'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi',
    'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega',
    'varepsilon', 'vartheta', 'varpi', 'varrho', 'varsigma', 'varphi',
]

const uppercase_greek_letters = [
    'Gamma', 'Delta', 'Theta', 'Lambda', 'Xi', 'Pi', 'Sigma', 'Upsilon', 'Phi', 'Psi', 'Omega',
]

const arrows = [
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
    'leadsto',
    'leftleftarrows',
    'rightrightarrows',
]

function main() {
    const cheatSheetTomlFile = path.join(__dirname, '../src/template/cheat-sheet.toml');
    const data = toml.parse(fs.readFileSync(cheatSheetTomlFile, { encoding: 'utf-8' }));

    // void data.math_commands;

    const symbols_unsupported_by_katex = [
        'iiiint',
        'slash',
    ]
    for (const symbol of symbols_unsupported_by_katex) {
        delete data.math_symbols[symbol];
    }

    data.lowercase_greek_letters = {};
    for(const letter of lowercase_greek_letters) {
        data.lowercase_greek_letters[letter] = tex2typst(`\\${letter}`);
    }

    data.uppercase_greek_letters = {};
    for(const letter of uppercase_greek_letters) {
        data.uppercase_greek_letters[letter] = tex2typst(`\\${letter}`);
    }

    data.arrow_symbols = {};
    for(const arrow of arrows) {
        if (!symbolMap.has(arrow)) {
            throw new Error(`Symbol not found: ${arrow}`);
        }
        data.arrow_symbols[arrow] = symbolMap.get(arrow);
    }


    const cheatSheetTemplateFile = path.join(__dirname, '../src/template/cheat-sheet.tp.html');
    const template = fs.readFileSync(cheatSheetTemplateFile, { encoding: 'utf-8' });
    const output = Sqrl.render(template, data);

    const outputHtmlFile = path.join(__dirname, '../public/cheat-sheet.html');
    fs.writeFileSync(outputHtmlFile, output);
}

main();
