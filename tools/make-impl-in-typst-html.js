import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'node:fs';
import { convert_tex_to_svg } from './tex-to-svg.cjs';

import markdownIt from "markdown-it";
import markdownItMath from "markdown-it-math";
import markdownItFootnote from "markdown-it-footnote";
import markdownItAnchor from "markdown-it-anchor";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mdIt = markdownIt()

mdIt.use(markdownItMath, {
    inlineRenderer: (src) => {
        return convert_tex_to_svg(src);
    },
    blockRenderer: (src) => {
        const svg = convert_tex_to_svg(src);
        return `<figure>${svg}</figure>`;
    },
});

mdIt.use(markdownItFootnote);

/*
By default, markdown-it-footnote the following in the end

<hr class="footnotes-sep">
<section class="footnotes">
  <ol> ... </ol>
</section>

We just want to keep the <ol> and remove the rest.
*/
mdIt.renderer.rules.footnote_block_open = () => (
    '<ol class="footnotes-list">\n'
);

mdIt.use(markdownItAnchor, {
    slugify: (s) => {
        // Replace all spaces with dashes
        s = s.replace(/\s+/g, "-");
        // Remove all non-alphanumeric characters (except dashes) and convert to lowercase
        return s.replace(/[^a-zA-Z0-9\-]/g, "").toLowerCase();
    }
});

function main() {
    const md_file_path = path.join(__dirname, "../src/template/impl-in-typst.md");
    const md_wrapper_html_path = path.join(__dirname, "../src/template/markdown-wrapper.html");
    const dest_html_path = path.join(__dirname, "../public/impl-in-typst.html");

    const md_wrapper_html = fs.readFileSync(md_wrapper_html_path, { encoding: "utf-8" });

    const md_content = fs.readFileSync(md_file_path, { encoding: "utf-8" });
    let html_segment = mdIt.render(md_content);

    // wrapper HTML should contain <!-- HTML_FROM_MARKDOWN --> to which html output will be inserted
    const html = md_wrapper_html.replace("<!-- HTML_FROM_MARKDOWN -->", html_segment);

    fs.writeFileSync(dest_html_path, html);
}

main();
