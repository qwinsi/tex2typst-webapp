import assert from 'assert';
import { convertTex2Typst } from '../src/converter.js';
import { tex2typst } from 'tex2typst';
import { EXAMPLE_FORMULAS } from '../src/random.js';


const TYPST_EXAMPLE_FORMULAS = [
    'e = lim_(n arrow.r infinity)(1 + frac(1, n))^n',
    'product_p frac(1, 1 - p^(-s)) = sum_(n = 1)^infinity frac(1, n^s)',
    'a^(p - 1) equiv 1 mod p',
    String.raw`nabla dot.op bold(E) & = frac(rho, epsilon_0) \
nabla dot.op bold(B) & = 0 \
nabla times bold(E) & = - frac(diff bold(B), diff t) \
nabla times bold(B) & = - mu_0 (bold(J) + epsilon frac(diff bold(E), diff t))`,
    'upright(C H_3 C H_2 B r) + upright(O H)^- arrow.long upright(C H_3 C H_2 O H) + upright(B r)^-',
    String.raw`yen 2000 > \$ 3000`,
    'sum_(k = 1)^n frac(1, k) = ln n + gamma + O(frac(1, n))',
    'e^(i x) = cos x + i sin x',
    'integral.triple_Omega op("div")(arrow(F)) dif V = integral.surf_(diff Omega) arrow(F) dot.op dif arrow(S)',
    'integral.double_Sigma op("curl")(arrow(F)) dot.op dif arrow(S) = integral.cont_(diff Sigma) arrow(F) times dif arrow(l)',
    'pi(x) tilde frac(x, log x)',
    'i_D = mu_n C_"ox" frac(W, L) [(v_"GS" - V_t) v_"DS" - frac(1, 2) v_"DS"^2 ]',
    String.raw`C & = N(d_1) S_t - N(d_2) K e^(-r t) \
d_1 & = frac(ln frac(S_t, K) +(r + frac(sigma^2, 2)) t, sigma sqrt(t)) \
d_2 & = d_1 - sigma sqrt(t)`,
    'f(z_0) = frac(1, 2 pi upright(i)) integral.cont_C frac(f(z), z - z_0) dif z'
];

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

    it('example formulas', function () {
        for (let i = 0; i < EXAMPLE_FORMULAS.length; i++) {
            const formula = EXAMPLE_FORMULAS[i];
            const res = convertTex2Typst(formula);
            assert.strictEqual(res, TYPST_EXAMPLE_FORMULAS[i]);
        }
    });
});
