import assert from 'assert';
import { convertTex2Typst, remoteSpacesBetweenDigits, putPrimeBeforeUnderscore } from '../src/converter.js';
import { texToTypst } from "tex-to-typst";

describe('tex-to-typst', function () {
    it('add redundant spaces between digits', function () {
        assert.strictEqual(texToTypst("123"), "1 2 3");
    });

    it('throw error for input (\\right)', function () {
        assert.throws(() => texToTypst("\\right"), Error);
    });

    it('give wrong result for expression sqrt(1 / (x^2+y^2))', function () {
        const input = "\\sqrt{\\frac{1}{x^2 + y^2}}";
        const wrongResult = "sqrt(frac(1, x^2 + y^)";
        assert.strictEqual(texToTypst(input), wrongResult);
    });

});


describe('remoteSpacesBetweenDigits()', function () {
    it('remove spaces between digits', function () {
        const input = "A B C 113 1134 35 D E F 553 45 2 D P D";
        const expectedOutput = "A B C 113113435 D E F 553452 D P D";
        assert.strictEqual(remoteSpacesBetweenDigits(input), expectedOutput);
    });
})

describe('putPrimeBeforeUnderscore()', function () {
    it('put prime symbol before underscore', function () {
        const input = "y_1' y_{a_1}' y_{a + b}' {\\theta}_{1}'";
        const expectedOutput = "y'_1 y'_{a_1} y'_{a + b} {\\theta}'_{1}";
        assert.strictEqual(putPrimeBeforeUnderscore(input), expectedOutput);
    });
});
