import { describe, expect, test } from "bun:test";
import { convertTex2Typst } from '../src/converter.js';
import { tex2typst } from 'tex2typst';
import { EXAMPLE_FORMULAS_LATEX  } from '../src/random.js';


const EXPECTED_TYPST_FORMULAS = [
    'upright(e) eq.def lim_(n -> infinity) (1 + 1/n)^n',
    'product_p 1/(1 - p^(-s)) = sum_(n = 1)^infinity 1/(n^s)',
    'a^(p - 1) equiv 1 mod p',
    String.raw`nabla times bold(H) &= bold(J) + (partial bold(D))/(partial t) \
nabla times bold(E) &= - (partial bold(B))/(partial t) \
nabla dot.op bold(B) &= 0 \
nabla dot.op bold(D) &= rho`,
    'upright(C H_3 C H_2 B r) + upright(O H)^- --> upright(C H_3 C H_2 O H) + upright(B r)^-',
    String.raw`#text(fill: red)[$yen$]2000 > #text(fill: green)[$\$$]3000`,
    'sum_(k = 1)^n 1/k = ln n + gamma + O(1/n)',
    'upright(e)^(upright(i) x) = cos x + upright(i) sin x',
    'integral.triple_Omega op("div")(arrow(F)) dif V = integral.surf_(partial Omega) arrow(F) dot.op dif arrow(S)',
    'integral.double_Sigma op("curl")(arrow(F)) dot.op dif arrow(S) = integral.cont_(partial Sigma) arrow(F) times dif arrow(l)',
    'pi(x) ~ x/(log x)',
    'i_D = mu_n C_"ox" W/L [(v_"GS" - V_t) v_"DS" - 1/2 v_"DS"^2]',
    String.raw`C &= N(d_1) S_t - N(d_2) K e^(-r t) \
d_1 &= (ln (S_t)/K +(r + (sigma^2)/2) t)/(sigma sqrt(t)) \
d_2 &= d_1 - sigma sqrt(t)`,
    'f(z_0) = 1/(2 pi upright(i)) integral.cont_C (f(z))/(z - z_0) dif z',
    // TODO: There should no spaces after x_n and x_n^2
    String.raw`mat(delim: "|", 1, 1, ..., 1;
x_1, x_2, ..., x_n;
x_1^2, x_2^2, ..., x_n^2;
dots.v, dots.v, dots.down, dots.v;
x_1^(n - 1), x_2^(n - 1), ..., x_n^(n - 1))
= product_(1 <= i < j <= n) (x_j - x_i)`,
    String.raw`op("ReLU")(x) = cases(x & "if " x > 0,
0 & "if " x <= 0)`,
    'op("Attention")(Q, K, V) = op("softmax")((Q K^T)/sqrt(d_k)) V',
];

describe('tex2typst', function () {
    test('convert case', function() {
        const input = "\\zeta(s) = \\sum_{n=1}^{\\infty}\\frac{1}{n^s}";
        const expectedOutput = "zeta(s) = sum_(n = 1)^infinity 1/(n^s)";
        expect(convertTex2Typst(input)).toBe(expectedOutput);
    })

    test('convert binom', function() {
        const input = "\\binom{n}{k}";
        const expectedOutput = "binom(n, k)";
        expect(convertTex2Typst(input)).toBe(expectedOutput);
    })

    test('sech', function() {
        const input = "\\sech(x)";
        const expectedOutput = "sech(x)";
        expect(convertTex2Typst(input)).toBe(expectedOutput);
    })

    test('throw error for input (\\right)', function () {
        expect(() => tex2typst("\\right")).toThrow(Error);
    });

    test('example formulas', function () {
        for (let i = 0; i < EXAMPLE_FORMULAS_LATEX.length; i++) {
            const formula = EXAMPLE_FORMULAS_LATEX[i];
            const res = convertTex2Typst(formula);
            expect(res).toBe(EXPECTED_TYPST_FORMULAS[i]);
        }
    });
});
