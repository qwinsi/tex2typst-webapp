import assert from 'assert';
import { convertTex2Typst } from '../src/converter.js';
import { tex2typst } from 'tex2typst';

describe('tex2typst', function () {
    it('convert case', function() {
        const input = "\\zeta(s) = \\sum_{n=1}^{\\infty}\\frac{1}{n^s}";
        const expectedOutput = "zeta(s) = sum_(n = 1)^infinity frac(1, n^s)";
        assert.strictEqual(convertTex2Typst(input), expectedOutput);
    })

    it('convert binom', function() {
        const input = "\\binom{n}{k}";
        const expectedOutput = "binom(n, k)";
        assert.strictEqual(convertTex2Typst(input), expectedOutput);
    })

    it('sech', function() {
        const input = "\\sech(x)";
        const expectedOutput = "sech(x)";
        assert.strictEqual(convertTex2Typst(input), expectedOutput);
    })

    it('throw error for input (\\right)', function () {
        assert.throws(() => tex2typst("\\right"), Error);
    });
});
