function getRandomInt(max) {
    let res = Math.floor(Math.random() * max);
    if (res === max) {
        res = 0;
    }
    return res;
}


export const EXAMPLE_FORMULAS_LATEX = [
    // base of natural logarithm
    String.raw`\mathrm{e} \overset{\text{def}}{=} \lim_{{n \to \infty}} \left(1 + \frac{1}{n}\right)^n`,
    // Euler's product formula
    String.raw`\prod_{p} \frac{1}{1-p^{-s}} = \sum_{n=1}^{\infty} \frac{1}{n^s}`,
    // Fermat's little theorem
    String.raw`a^{p-1} \equiv 1 \mod{p}`, // TODO: a^{p-1} \equiv 1 \pmod{p}
    // Maxwell's equations
    String.raw`\begin{aligned}
\nabla \times \boldsymbol{H} &= \boldsymbol{J} + \frac{\partial \boldsymbol{D}}{\partial t} \\
\nabla \times \boldsymbol{E} &= -\frac{\partial \boldsymbol{B}}{\partial t} \\
\nabla \cdot \boldsymbol{B} &= 0 \\
\nabla \cdot \boldsymbol{D} &= \rho
\end{aligned}`,
    // chemical equation example: bromoethane to ethanol
    String.raw`\rm{CH_3CH_2Br} + \rm{OH}^- \longrightarrow \rm{CH_3CH_2OH} + \rm{Br}^-`,
    // Chen's inequality
    String.raw`\yen 2000 > \$ 3000`,
    // harmonic series
    String.raw`\sum_{k=1}^n \frac{1}{k} = \ln n + \gamma + O\left(\frac{1}{n}\right)`,
    // Euler's complex exponential formula
    String.raw`\mathrm{e}^{\mathrm{i} x} = \cos x + \mathrm{i} \sin x`,
    // Gauss's divergence theorem
    String.raw`\iiint_{\Omega} \operatorname{div}(\vec{F}) \mathrm{d}V = \oiint_{\partial \Omega} \vec{F} \cdot \mathrm{d}\vec{S}`,
    // Stokes' theorem
    String.raw`\iint_{\Sigma} \operatorname{curl}(\vec{F}) \cdot \mathrm{d}\vec{S} = \oint_{\partial \Sigma} \vec{F} \times \mathrm{d}\vec{l}`,
    // Prime number theorem
    String.raw`\pi(x) \sim \frac{x}{\log x}`,
    // current-voltage characteristics of n-channel enhancement MOSFETs
    String.raw`i_D = \mu_n C_\text{ox} \frac{W}{L} \left[ (v_\text{GS} - V_t)v_\text{DS} - \frac{1}{2} v_\text{DS}^2 \right]`,
    // Black-Scholes formula for option pricing
    String.raw`\begin{aligned}
C &= N(d_1) S_t - N(d_2) K e^{-rt} \\
d_1 &= \frac{\ln \frac{S_t}{K} + (r + \frac{\sigma^2}{2}) t}{\sigma \sqrt{t}} \\
d_2 &= d_1 - \sigma\sqrt{t}
\end{aligned}`,
    // Cauchy's integral formula
    String.raw`f(z_0) = \frac{1}{2\pi \mathrm{i}} \oint_{C} \frac{f(z)}{z-z_0}\, \mathrm{d} z`,
    // determinant of a Vandermonde matrix
    String.raw`\begin{vmatrix}
1 & 1 & \dots & 1 \\
x_1 & x_2 & \dots & x_n \\
x_1^2 & x_2^2 & \dots & x_n^2 \\
\vdots & \vdots & \ddots & \vdots \\
x_1^{n-1} & x_2^{n-1} & \dots & x_n^{n-1}
\end{vmatrix}
= \prod_{1 \leq i < j \leq n} (x_j - x_i)`,
    // ReLU function
    String.raw`\operatorname{ReLU}(x) = \begin{cases}
x & \text{if } x > 0 \\
0 & \text{if } x \leq 0
\end{cases}`,
    // attention mechanism
    String.raw`\operatorname{Attention}(Q, K, V) = \operatorname{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right) V`,
];

const EXAMPLE_FORMULAS_TYPST = [
    'e eq.def lim_(n arrow.r infinity)(1 + 1/n)^n',
    'product_p 1/(1 - p^(-s)) = sum_(n = 1)^infinity 1/(n^s)',
    'a^(p - 1) equiv 1 mod p',
    String.raw`nabla times bold(H) & = bold(J) + (diff bold(D))/(diff t) \
nabla times bold(E) & = - (diff bold(B))/(diff t) \
nabla dot.op bold(B) & = 0 \
nabla dot.op bold(D) & = rho`,
    'upright(C H_3 C H_2 B r) + upright(O H)^- arrow.r.long upright(C H_3 C H_2 O H) + upright(B r)^-',
    String.raw`yen 2000 > \$ 3000`,
    'sum_(k = 1)^n 1/k = ln n + gamma + O(1/n)',
    'e^(i x) = cos x + i sin x',
    'integral.triple_Omega op("div")(arrow(F)) dif V = integral.surf_(diff Omega) arrow(F) dot.op dif arrow(S)',
    'integral.double_Sigma op("curl")(arrow(F)) dot.op dif arrow(S) = integral.cont_(diff Sigma) arrow(F) times dif arrow(l)',
    'pi(x) tilde.op x/(log x)',
    'i_D = mu_n C_"ox" W/L [(v_"GS" - V_t) v_"DS" - 1/2 v_"DS"^2 ]',
    String.raw`C & = N(d_1) S_t - N(d_2) K e^(-r t) \
d_1 & = frac(ln frac(S_t, K) +(r + sigma^2/2) t, sigma sqrt(t)) \
d_2 & = d_1 - sigma sqrt(t)`,
    'f(z_0) = 1/(2 pi upright(i)) integral.cont_C f(z)/(z - z_0) dif z',
    String.raw`mat(delim: "|", 1, 1, dots.h, 1;
x_1, x_2, dots.h, x_n;
x_1^2, x_2^2, dots.h, x_n^2;
dots.v, dots.v, dots.down, dots.v;
x_1^(n - 1), x_2^(n - 1), dots.h, x_n^(n - 1))
= product_(1 <= i < j <= n)(x_j - x_i)`,
    String.raw`op("ReLU")(x) = cases(x & "if " x > 0,
0 & "if " x <= 0)`,
    'op("Attention")(Q, K, V) = op("softmax")((Q K^T)/sqrt(d_k)) V',
];

let last_number = null;

export function getRandomFormula(wantLatex) {
    const examples = wantLatex ? EXAMPLE_FORMULAS_LATEX : EXAMPLE_FORMULAS_TYPST;
    const num_examples = examples.length;
    let r;
    do {
        r = getRandomInt(num_examples);
    } while (r === last_number);
    last_number = r;
    return examples[r];
}
