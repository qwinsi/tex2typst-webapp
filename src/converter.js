/**
 * This file add some patches to the original function in tex2typst library.
 * A `convertTex2Typst` function is exported as the final converter implementation.
 */
import { tex2typst, symbolMap, typst2tex } from "tex2typst";


// Not used actually.
// Put prime symbol before '_'. Because $y_1'$ is not displayed properly in Typst (so far)
// e.g. 
// y_1' -> y'_1
// y_{a_1}' -> y'_{a_1}
// y_{a + b}' -> y'_{a + b}
// {\theta}_{1}' -> {\theta}'_{1}
function putPrimeBeforeUnderscore(text) {
    return text.replace(/([\\\w]+|\{.*?\})_([\\\w]+|\{.*?\})'/g, "$1'_$2");
}

export const customTexMacros = {
    "\\RR": "\\mathbb{R}",
    "\\NN": "\\mathbb{N}",
    "\\ZZ": "\\mathbb{Z}",
    "\\QQ": "\\mathbb{Q}",
    "\\CC": "\\mathbb{C}",
    "\\sech": "\\operatorname{sech}",
    "\\csch": "\\operatorname{csch}",
    "\\dim": "\\operatorname{dim}",
    "\\id": "\\operatorname{id}",
    "\\im": "\\operatorname{im}",
    "\\Pr": "\\operatorname{Pr}",
};

// @param input: string of TeX math formula code. 
export function convertTex2Typst(input) {
    const options = {
        nonStrict: true,
        preferTypstIntrinsic: true,
        customTexMacros: customTexMacros,
    };
    let res = tex2typst(input, options);
    res = res.replaceAll("upright(d)", "dif"); // \mathrm{d} -> dif
    res = res.replaceAll(" thin dif", " dif");
    res = res.replaceAll('op("d")', "dif"); // \operatorname("d") -> dif
    return res;
}

export function convertTypst2Tex(input) {
    input = input.replaceAll("<=", " lt.eq ");
    input = input.replaceAll(">=", " gt.eq ");
    input = input.replaceAll("->", " to ");

    return typst2tex(input);
}