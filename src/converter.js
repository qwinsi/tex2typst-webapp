/**
 * This file add some patches to the original function in tex-to-typst library.
 * A `convertTex2Typst` function is exported as the final converter implementation.
 */
import { texToTypst } from "tex-to-typst";

// symbol mapping which is not covered by tex-to-typst library.
// Typst symbol table https://typst.app/docs/reference/symbols/sym/
const symbolMap = new Map([
    ["bigcup", "union.big"],
    ["bigoplus", "xor.big"],
    ["iiint", "integral.triple"],
    ["oiint", "integral.surf"],
    ["oiiint", "integral.vol"],
]);

// Remove spaces between digits. This situation is caused by tex-to-typst library.
// e.g. "A B C 3 4 5 D E F" -> "A B C 345 D E F"
// Code from https://stackoverflow.com/questions/54764979/
function remoteSpacesBetweenDigits(text) {
    return text.replace(/(?<=\d)\s+(?=\d)/g, "");
}

// Remove single space before prime symbol. This situation is caused by tex-to-typst library.
// e.g. y ' -> y'
function removeSpaceBeforePrime(text) {
    return text.replace(/([^\s])\s'/g, "$1'");
}

// Put prime symbol before '_'. Because $y_1'$ is not displayed properly in Typst (so far)
// e.g. 
// y_1' -> y'_1
// y_{a_1}' -> y'_{a_1}
// y_{a + b}' -> y'_{a + b}
// {\theta}_{1}' -> {\theta}'_{1}
function putPrimeBeforeUnderscore(text) {
    return text.replace(/([\\\w]+|\{.*?\})_([\\\w]+|\{.*?\})'/g, "$1'_$2");
}

// @param input: string of TeX math formula code. 
export function convertTex2Typst(input) {
    let res = texToTypst(input);
    for (const [key, value] of symbolMap) {
        // When tex-to-typst library encounters a unknown symbol, it just drops leading backslash. e.g. "\bigcup" -> "bigcup"
        // We need to replace it with the proper symbol.
        // Replace only if the whole word is matched.
        // e.g. /(bigcup)[^a-zA-Z]/ matches "bigcup" but not "bigcups"
        res = res.replace(new RegExp(`(${key})(\\b|_)`, "g"), `${value}$2`);
    }
    res = res.replaceAll("upright(d)", "dif"); // Special case for the differential symbol
    res = remoteSpacesBetweenDigits(res);
    res = removeSpaceBeforePrime(res);
    res = putPrimeBeforeUnderscore(res);
    return res;
}

// function test1() {
//     console.assert("1 2 3" === texToTypst("123"));
//     const input = "A B C 113 1134 35 D E F 553 45 2 D P D";
//     const output = remoteSpacesBetweenDigits(input);
//     console.log(output);
//     console.assert(output === "A B C 113113435 D E F 553452 D P D");
// }

// function test2() {
//     const input = "y_1' y_{a_1}' y_{a + b}' {\\theta}_{1}'";
//     const output = putPrimeBeforeUnderscore(input);
//     console.log(output);
//     console.assert(output === "y'_1 y'_{a_1} y'_{a + b} {\\theta}'_{1}");
// }

// test1();
// test2();
