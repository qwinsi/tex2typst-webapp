/**
 * Note: You need to have pandoc installed to run this script.
 */
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { convert_tex_to_svg } from './tex-to-svg.cjs';
import { parse } from 'node-html-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


function render_math(inputHtml) {
    const root = parse(inputHtml);
    const math_elements = root.querySelectorAll("span.math.display");
    for (const math_element of math_elements) {
        const tex = math_element.textContent;
        const svg = convert_tex_to_svg(tex);
        math_element.replaceWith(`<figure>${svg}</figure>`);
    }
    return root.toString();
}

function main() {
    const md_file_path = path.join(__dirname, "../src/template/impl-in-typst.md");
    const md_wrapper_html_path = path.join(__dirname, "../src/template/markdown-wrapper.html");
    const dest_html_path = path.join(__dirname, "../public/impl-in-typst.html");

    const md_wrapper_html = fs.readFileSync(md_wrapper_html_path, { encoding: "utf-8" });

    // Run the following command to generate HTML
    // pandoc --to html5 --no-highlight --katex impl-in-typst.md
    const pandoc_cmd = `pandoc --to html5 --no-highlight --katex ${md_file_path}`;
    const working_dir = path.join(__dirname, "../src/template/");
    const pandoc_output = execSync(pandoc_cmd, { encoding: "utf-8", cwd: working_dir });

    // wrapper HTML should contain <!-- HTML_FROM_MARKDOWN --> to which pandoc output will be inserted
    const html = md_wrapper_html.replace("<!-- HTML_FROM_MARKDOWN -->", pandoc_output);
    const final_html = render_math(html);

    fs.writeFileSync(dest_html_path, final_html);
}

main();
