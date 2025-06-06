import assert from 'assert';
import { convertTex2Typst } from '../src/converter.js';
import { tex2typst } from 'tex2typst';
import { EXAMPLE_FORMULAS_LATEX  } from '../src/random.js';


const TYPST_EXAMPLE_FORMULAS = [
    'e eq.def lim_(n -> infinity)(1 + 1/n)^n',
    'product_p 1/(1 - p^(-s)) = sum_(n = 1)^infinity 1/n^s',
    'a^(p - 1) equiv 1 mod p',
    String.raw`nabla times bold(H) &= bold(J) + (diff bold(D))/(diff t) \
nabla times bold(E) &= -(diff bold(B))/(diff t) \
nabla dot.op bold(B) &= 0 \
nabla dot.op bold(D) &= rho`,
    'upright(C H_3 C H_2 B r) + upright(O H)^- arrow.r.long upright(C H_3 C H_2 O H) + upright(B r)^-',
    String.raw`yen 2000 > \$ 3000`,
    'sum_(k = 1)^n 1/(k) = ln n + gamma + O(1/n)',
    'e^(i x) = cos x + i sin x',
    'integral.triple_Omega op("div")(arrow(F)) dif V = integral.surf_(diff Omega) arrow(F) dot.op dif arrow(S)',
    'integral.double_Sigma op("curl")(arrow(F)) dot.op dif arrow(S) = integral.cont_(diff Sigma) arrow(F) times dif arrow(l)',
    'pi(x) tilde.op x/(log x)',
    'i_D = mu_n C_"ox" W/L [(v_"GS" - V_t) v_"DS" - 1/2 v_"DS"^2 ]',
    String.raw`C &= N(d_1) S_t - N(d_2) K e^(-r t) \
d_1 &= frac(ln S_t/K + (r + sigma^2/2)) t, sigma sqrt(t)) \
d_2 &= d_1 - sigma sqrt(t)`,
    'f(z_0) = 1/(2 pi upright(i)) integral.cont_C f(z)/(z - z_0) dif z',
    String.raw`lr(|
mat(delim: #none, 1, 1, dots.h, 1;
x_1, x_2, dots.h, x_n;
x_1^2, x_2^2, dots.h, x_n^2;
dots.v, dots.v, dots.down, dots.v;
x_1^(n - 1), x_2^(n - 1), dots.h, x_n^(n - 1))
|)
= product_(1 lt.eq i < j lt.eq n)(x_j - x_i)`
];

describe('tex2typst', function () {
    it('convert case', function() {
        const input = "\\zeta(s) = \\sum_{n=1}^{\\infty}\\frac{1}{n^s}";
        const expectedOutput = "zeta(s) = sum_(n = 1)^infinity 1/n^s";
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
        for (let i = 0; i < EXAMPLE_FORMULAS_LATEX.length; i++) {
            const formula = EXAMPLE_FORMULAS_LATEX[i];
            const res = convertTex2Typst(formula);
            assert.strictEqual(res, TYPST_EXAMPLE_FORMULAS[i]);
        }
    });
});
