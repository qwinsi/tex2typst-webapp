# Implementing LaTeX macros unsupported by Typst

## Background

There is not always a Typst equivalent for every LaTeX macro. This document provides a guide on how to implement unsupported LaTeX macros in Typst.

## The `\mathscr` macro

LaTeX: `\mathscr`

Implementation in Typst [^1]

```
#let scr(it) = text(
  features: ("ss01",),
  box($cal(it)$),
)
```

Usage example:

```
$
y = scr(A) x
$
```

## The `\LaTeX` and `\TeX` macro

LaTeX: `\LaTeX` and `\TeX`

Implementation in Typst [^2]

```
#let TeX = context {
  set text(font: "New Computer Modern")
  let e = measure("E")
  let T = "T"
  let E = text(1em, baseline: e.height * 0.31, "E")
  let X = "X"
  box(T + h(-0.15em) + E + h(-0.125em) + X)
}

#let LaTeX = context {
  set text(font: "New Computer Modern")
  let a-size = 0.66em
  let l = measure("L")
  let a = measure(text(a-size, "A"))
  let L = "L"
  let A = box(scale(x: 105%, text(a-size, baseline: a.height - l.height, "A")))
  box(L + h(-a.width * 0.67) + A + h(-a.width * 0.25) + TeX)
}
```

Usage example:

```
You can use #LaTeX in text environments.
You can use $#LaTeX$ in math environments as well.
```

## Using the `op` function to define custom operators

For example, if you want to define a custom operator `\myopr`.

LaTeX: `\newcommand{\myopr}{\operatorname{myopr}}`

Equivalent in Typst:

```
#let myopr = op("myopr");
```

Usage example:

```
$
y = myopr x
$
```

## A vertical bar for evaluation

It's common to use a vertical bar to denote the evaluation of a function at a point. e.g.

$$
f(x) \bigg\rvert_{x = x_0}
$$

➣ LaTeX:

```
f(x) \bigg\rvert_{x = x_0}
```

Where `\bigg\rvert` may be replaced with `\bigg\vert`, `\bigg|` etc.

➣ Walkaround in Typst:

```
f(x) lr(| vec(delim: #none, , , x = x_0))
```

Also it's common to use a vertical bar to denote the deference of function values at two points, especially when calculating definite integrals. e.g. [^3]

$$
F(x) \bigg\rvert_{a}^{b}
$$

➣ LaTeX:

```
F(x) \bigg\rvert_{a}^{b}
```

Where `\bigg\rvert` may be replaced with `\bigg\vert` , `\bigg|` etc.


➣ Walkaround in Typst:

```
F(x) lr(| vec(delim: #none, b, , a))
```

## The `\cancelto` macro

`\cancelto{value}{expression}` is a LaTeX command provided by the `cancel` package. It is used to place an arrow through an expression and annotate it with a value to which the expression is be evaluated.

![img](cancelto-example.svg)

➣ LaTeX:

```
\cancelto{0}{\frac{\partial^2 Q}{\partial r^2}}
```

➣ Implementation in Typst (adapted from [^4] ):

```
#let cancelto(to, body) = {
  let max(a, b) = if a > b { a } else { b };
  context {
    let m = measure(body)
    let (w, h) = (m.width, m.height * 2)
    let arrow = rotate(-55deg, math.stretch(sym.arrow.r, size: max(h*1.8, w*2.0)))
    set place(center + horizon)
    body
    place(dx: -w * 0.5, dy: -h * 0.1, arrow)
    place(dx: w * 0.3, dy: -h * 1.1, to)
  }
}
```

➣ Usage example:

```
$
cancelto(0, (diff^2 Q)/(diff r^2))
$
```

## References and Credits

The following resources were used to create this document:

[^1]: `\mathscr`: [Variants Functions – Typst Documentation](https://typst.app/docs/reference/math/variants#functions-cal)

[^2]: `\TeX` and `\LaTeX`: [How do I insert the `LaTeX` symbol in Typst? · typst/typst · Discussion #1732](https://github.com/typst/typst/discussions/1732#discussioncomment-6566999)

[^3]: `\bigg\rvert` for evaluation: [Math symbol: Vertical bar for ''evaluated at …'' Limits are not apart enough - TeX - LaTeX Stack Exchange](https://tex.stackexchange.com/questions/552807/math-symbol-vertical-bar-for-evaluated-at-limits-are-not-apart-enough)

[^4]: `\cancelto`: [Is there an equivalent to Latex's \cancelto in Typst? - Questions - Typst Forum](https://forum.typst.app/t/is-there-an-equivalent-to-latexs-cancelto-in-typst/536)