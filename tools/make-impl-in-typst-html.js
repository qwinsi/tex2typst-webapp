import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'node:fs';
import { convert_md_to_html } from '@qwinsi/mdc';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const PREAMBLE = `<meta name="darkreader-lock">`;
const HEADER = `<nav style="display: flex; justify-content: space-between; padding: 0.8em;">
  <a href="." target="_blank">Homepage</a>
  <a href="https://github.com/qwinsi/tex2typst-webapp" target="_blank">Source on Github</a>
</nav>`;


function main() {
    const md_file_path = path.join(__dirname, "../src/template/impl-in-typst.md");
    const dest_html_path = path.join(__dirname, "../public/impl-in-typst.html");

    const md_content = fs.readFileSync(md_file_path, { encoding: "utf-8" });
    const html = convert_md_to_html(md_content, { preambleHtml: PREAMBLE, headerHtml: HEADER });

    fs.writeFileSync(dest_html_path, html);
}

main();
