import { setup } from "@qwinsi/utilities-js/sw";

const SUBDIRECTORY = "/tex2typst-webapp";
import { version as APP_VERSION } from "../package.json";

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

setup(APP_VERSION, prefixedResources);
