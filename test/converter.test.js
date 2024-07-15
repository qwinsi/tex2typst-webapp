import assert from 'assert';
import { convertTex2Typst, putPrimeBeforeUnderscore } from '../src/converter.js';
import { tex2typst } from 'tex2typst';

describe('tex2typst', function () {
    it('convert case', function() {
        const input = "\\zeta(s) = \\sum_{n=1}^{\\infty}\\frac{1}{n^s}";
        const expectedOutput = "zeta(s) = sum_(n = 1)^infinity frac(1, n^s)";
        assert.strictEqual(convertTex2Typst(input), expectedOutput);
    })
    it('throw error for input (\\right)', function () {
        assert.throws(() => tex2typst("\\right"), Error);
    });
});


describe('putPrimeBeforeUnderscore()', function () {
    it('put prime symbol before underscore', function () {
        const input = "y_1' y_{a_1}' y_{a + b}' {\\theta}_{1}'";
        const expectedOutput = "y'_1 y'_{a_1} y'_{a + b} {\\theta}'_{1}";
        assert.strictEqual(putPrimeBeforeUnderscore(input), expectedOutput);
    });
});
