function getRandomInt(max) {
    let res = Math.floor(Math.random() * max);
    if (res === max) {
        res = 0;
    }
    return res;
}


export const EXAMPLE_FORMULAS = [
    // base of natural logarithm
    String.raw`e = \lim_{{n \to \infty}} \left(1 + \frac{1}{n}\right)^n`,
    // Euler's product formula
    String.raw`\prod_{p} \frac{1}{1-p^{-s}}= \sum_{n=1}^{\infty} \frac{1}{n^s}`,
    // Fermat's little theorem
    String.raw`a^{p-1} \equiv 1 \mod{p}`, // TODO: a^{p-1} \equiv 1 \pmod{p}
    // Maxwell's equations
    String.raw`\begin{aligned}
\nabla \times \boldsymbol{H} &= \boldsymbol{J} + \frac{\partial \boldsymbol{D}}{\partial t} \\
\nabla \times \boldsymbol{E} &= -\frac{\partial \boldsymbol{B}}{\partial t} \\
\nabla \cdot \boldsymbol{B} &= 0 \\
\nabla \cdot \boldsymbol{D}  &= \rho
\end{aligned}`,
    // chemical equation example： bromoethane to ethanol
    String.raw`\mathrm{CH_3CH_2Br} + \mathrm{OH}^- \longrightarrow \mathrm{CH_3CH_2OH} + \mathrm{Br}^-`,
    // Chen's inequality
    String.raw`\yen 2000 > \$ 3000`,
    // harmonic series
    String.raw`\sum_{k=1}^n \frac{1}{k} = \ln n + \gamma + O\left(\frac{1}{n}\right)`,
    // Euler's complex exponential formula
    String.raw`e^{ix} \overset{\text{def}}{=} \cos x + i \sin x`,
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
d_2 &= d_1-\sigma\sqrt{t}
\end{aligned}`,
    // Cauchy's integral formula
    String.raw`f(z_0) = \frac{1}{2\pi \mathrm{i}} \oint_{C} \frac{f(z)}{z-z_0}\, \mathrm{d} z`
];

const NUM_EXAMPLES = EXAMPLE_FORMULAS.length;
let last_number = null;

export function getRandomFormula() {
    let r;
    do {
        r = getRandomInt(NUM_EXAMPLES);
    } while (r === last_number);
    last_number = r;
    return EXAMPLE_FORMULAS[r];
}
