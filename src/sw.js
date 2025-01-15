import { setup } from "@qwinsi/utilities-js/sw";

const SUBDIRECTORY = "/tex2typst-webapp";

const precacheResources = [
    "/",
    "/index.html",
    "/main.js",
    "/main.css",
    "/manifest.json",
    "/favicon.png",
    "/impl-in-typst.html",
    "/cheat-sheet.html",
];

const prefixedResources = precacheResources.map((resource) => SUBDIRECTORY + resource);

setup(prefixedResources);
