import { setup } from "@qwinsi/utilities-js/sw";
import { version as APP_VERSION } from "../package.json";

const SUBDIRECTORY = "/tex2typst-webapp";

const precacheResources = [
    "/",
    "/index.html",
    "/main.js",
    "/style.css",
    "/icons/github-mark-white.svg",
    "/icons/notebook-icon.svg",
    "/icons/settings-icon.svg",
    "/manifest.json",
    "/favicon.png",
    "/impl-in-typst.html",
    "/cheat-sheet.html",
];

const prefixedResources = precacheResources.map((resource) => SUBDIRECTORY + resource);

setup(APP_VERSION, prefixedResources);
