import * as Sqrl from 'squirrelly'
import { fileURLToPath } from 'url';
import path from 'path';
import toml from 'toml';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    const cheatSheetTemplateFile = path.join(__dirname, '../src/template/cheat-sheet.tp.html');
    const template = fs.readFileSync(cheatSheetTemplateFile, { encoding: 'utf-8' });
    const output = Sqrl.render(template, data);

    const outputHtmlFile = path.join(__dirname, '../public/cheat-sheet.html');
    fs.writeFileSync(outputHtmlFile, output);
}

main();
