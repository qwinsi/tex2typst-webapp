import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function copy_images() {
    const images = [
        "cancelto-example.svg",
    ];

    const src_dir = path.join(__dirname, "../src/template/");
    const dest_dir = path.join(__dirname, "../public/");
    for (const image of images) {
        const src_path = path.join(src_dir, image);
        const dest_path = path.join(dest_dir, image);
        fs.copyFileSync(src_path, dest_path);
    }
}

function main() {
    const md_file_path = path.join(__dirname, "../src/template/impl-in-typst.md");
    const md_wrapper_html_path = path.join(__dirname, "../src/template/markdown-wrapper.html");
    const dest_html_path = path.join(__dirname, "../public/impl-in-typst.html");

    const md_wrapper_html = fs.readFileSync(md_wrapper_html_path, { encoding: "utf-8" });

    // Run the following command to generate HTML
    // pandoc --to html5 --no-highlight --standalone --katex impl-in-typst.md
    const pandoc_cmd = `pandoc --to html5 --no-highlight --katex ${md_file_path}`;
    const pandoc_output = execSync(pandoc_cmd, { encoding: "utf-8" });

    // wrapper HTML should contain <!-- HTML_FROM_MARKDOWN --> to which pandoc output will be inserted
    const final_html = md_wrapper_html.replace("<!-- HTML_FROM_MARKDOWN -->", pandoc_output);

    fs.writeFileSync(dest_html_path, final_html);

    copy_images();
}

main();
