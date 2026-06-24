---
theme: default
title: Evaluating LLMs — Evals 101
info: |
  ## Evals 101 — Evaluating LLMs
  A team briefing on LLM evaluation: LLM-as-a-judge, Cohen's Kappa,
  and Singapore's AI Verify. Theory here; worked examples in the demo site.
class: cover
transition: slide-left
mdc: true
colorSchema: light
routerMode: hash
fonts:
  sans: Inter
  mono: JetBrains Mono
  weights: '300,400,500,600,700,800'
---

<div class="kicker">A practical guide · Team briefing</div>

# Evaluating<br><span class="accent">Large Language Models</span>

<div class="rule-accent"></div>

<p class="muted" style="font-size:1.35rem; max-width:42ch">
How do we know an AI system is <strong>actually good</strong> — and prove it?
</p>

<div style="margin-top:2.2rem">
  <span class="pill">LLM-as-a-Judge</span>
  <span class="pill">Cohen's Kappa</span>
  <span class="pill">Judge biases</span>
  <span class="pill">Singapore AI Verify</span>
</div>

<div class="foot-tag">Evals 101 · press → to begin</div>

<!--
Welcome. This deck carries the theory; the companion website has live, clickable
examples — a real LLM judge, a Cohen's Kappa calculator, and a Moonshot map.
Look for the ▶ chips that link to a demo.
-->

---
layout: center
class: text-center
---

<div class="callout" style="font-size:2.2rem; border:none; max-width:24ch; margin:0 auto; text-align:left">
"If you can't <span class="accent">measure</span> it,<br>you can't <span class="accent">improve</span> it."
</div>

<p class="muted" style="margin-top:1.5rem">— and you certainly can't ship it with confidence.</p>

---

<div class="kicker">The problem</div>

## Why bother with evals?

<div class="cardrow cols-3">
  <div class="card"><div class="ct">01</div><h4>Ship with confidence</h4><p>"It looks good" doesn't scale past a handful of examples. Evals turn gut-feel into evidence.</p></div>
  <div class="card"><div class="ct">02</div><h4>Catch regressions</h4><p>A prompt tweak or model swap can quietly break things. Evals are your unit tests for AI.</p></div>
  <div class="card"><div class="ct">03</div><h4>Compare fairly</h4><p>Model A vs Model B, v1 vs v2 — only a repeatable eval lets you choose on facts, not vibes.</p></div>
</div>

<p v-click class="callout" style="margin-top:1.8rem">
Evals are the difference between <span class="accent">"trust me"</span> and <span class="accent">"here's the number."</span>
</p>

<!--
For a mixed audience: frame evals as the QA / test suite of the AI world.
No serious software ships without tests; AI shouldn't either.
-->

---
layout: center
class: section text-center
transition: fade
---

<div class="kicker">Part 01</div>

# How do we score an output?

<div class="rule-accent" style="margin:1rem auto"></div>

<p class="muted">Three families of methods — and when each one works.</p>

---

<div class="kicker">The landscape</div>

## Three ways to grade an answer

<div class="cardrow cols-3">
  <div class="card">
    <div class="ct">DETERMINISTIC</div>
    <h4>Code-based metrics</h4>
    <p>Exact match, F1, BLEU/ROUGE. Fast, free, repeatable — but only when there's one right answer.</p>
  </div>
  <div class="card">
    <div class="ct">HUMAN</div>
    <h4>Human review</h4>
    <p>People read and rate. The gold standard for quality — but slow, costly, and inconsistent.</p>
  </div>
  <div class="card">
    <div class="ct">MODEL-BASED</div>
    <h4>LLM-as-a-judge</h4>
    <p>A strong model grades the output. Scales like code, judges like a human — <em>mostly</em>.</p>
  </div>
</div>

<p v-click class="muted" style="margin-top:1.6rem">
The rest of this talk is about the <strong>third</strong> one — and how to keep it honest.
</p>

---

<div class="kicker">Why not just use code metrics?</div>

## Exact match falls apart on real language

<div class="grid grid-cols-2 gap-8" style="margin-top:1rem">
<div>

**Question** — *Capital of Australia?*

<div style="margin-top:1rem">
  <span class="pill">Reference: "Canberra"</span>
</div>

<div v-click style="margin-top:1.2rem">

| Model answer | Exact match |
|---|---|
| "Canberra" | ✅ |
| "It's Canberra." | ❌ |
| "The capital is Canberra." | ❌ |
| "Sydney" | ❌ |

</div>
</div>

<div v-click>

<p class="callout">
Three of those answers are <span class="accent">correct</span> — and the metric only liked one of them.
</p>

<p class="muted" style="margin-top:1rem">
For open-ended work — summaries, chat replies, code, advice — there are <strong>many</strong> good answers and infinite phrasings. String-matching can't see meaning.
</p>

</div>
</div>

<!--
The point: deterministic metrics are great for classification / extraction with a
fixed answer key. They're hopeless for generative, open-ended tasks.
-->

---

<div class="kicker">Why not just use humans?</div>

## Human eval is the gold standard — and a bottleneck

<div class="cardrow cols-3">
  <div class="card"><div class="ct">SLOW</div><h4>Hours, not seconds</h4><p>Rating 1,000 responses by hand stalls every experiment you want to run.</p></div>
  <div class="card"><div class="ct">COSTLY</div><h4>Expensive at scale</h4><p>Quality raters cost real money — and you need them again for every new version.</p></div>
  <div class="card"><div class="ct">NOISY</div><h4>Inconsistent</h4><p>Two people disagree; one person disagrees with themselves on a Friday afternoon.</p></div>
</div>

<p v-click class="callout" style="margin-top:1.8rem">
We want human-like judgement at <span class="accent">code-like speed</span>. Enter the LLM judge.
</p>

---
layout: center
class: section text-center
transition: fade
---

<div class="kicker">Part 02</div>

# LLM-as-a-Judge

<div class="rule-accent" style="margin:1rem auto"></div>

<p class="muted">Using a strong model to grade another model's work.</p>

---

<div class="kicker">The idea</div>

## Let a model be the grader

<div class="grid grid-cols-2 gap-10" style="margin-top:0.5rem; align-items:center">
<div>

<p style="font-size:1.3rem">
Give a capable LLM:
</p>

<ul>
  <li>the <strong>task</strong> and the <strong>output</strong> to grade</li>
  <li>a clear <strong>rubric</strong> (what "good" means)</li>
  <li>a request for a <strong>score + reason</strong></li>
</ul>

<p v-click class="muted">
It returns a structured verdict in seconds, for cents — across thousands of items.
</p>

</div>
<div v-click>

<div class="card" style="border:1px solid var(--ink)">
<div class="ct">JUDGE OUTPUT</div>

```json
{
  "score": 4,
  "criteria": {
    "correct": true,
    "helpful": true,
    "tone": "good"
  },
  "reason": "Accurate and clear;
   could add a backup step."
}
```
</div>

</div>
</div>

---

<div class="kicker">Three flavours</div>

## How judges are asked to grade

<div class="cardrow cols-3">
  <div class="card">
    <div class="ct">POINTWISE</div>
    <h4>Score one answer</h4>
    <p>"Rate this 1–5 on helpfulness." Simple; good for tracking a metric over time.</p>
  </div>
  <div class="card">
    <div class="ct">PAIRWISE</div>
    <h4>Pick the winner</h4>
    <p>"Which is better, A or B?" Easier and more reliable than absolute scores — great for A/B.</p>
  </div>
  <div class="card">
    <div class="ct">REFERENCE</div>
    <h4>Grade vs a gold answer</h4>
    <p>"Does this match the reference?" Anchors the judge when you have a known-good answer.</p>
  </div>
</div>

<p v-click class="muted" style="margin-top:1.6rem">
Rule of thumb: humans (and LLMs) are <strong>better at comparing</strong> than at assigning absolute scores.
</p>

---

<div class="kicker">Anatomy</div>

## What a good judge prompt contains

<div class="grid grid-cols-2 gap-10" style="margin-top:0.4rem">
<div>
<ul>
  <li v-click><strong>Role + task context</strong> — what is being graded and why</li>
  <li v-click><strong>An explicit rubric</strong> — define each score level, not just "rate 1–5"</li>
  <li v-click><strong>Concrete criteria</strong> — correctness, helpfulness, safety, tone…</li>
  <li v-click><strong>Reason before score</strong> — make it explain first, then commit</li>
  <li v-click><strong>Structured output</strong> — JSON you can parse and aggregate</li>
</ul>
</div>
<div v-click="3">

<p class="callout">
Vague rubric in → noisy scores out. The rubric <em>is</em> the eval.
</p>

<div style="margin-top:1.8rem">
<a class="demo-chip" href="../demo/judge/">See a real judge, step by step</a>
</div>

</div>
</div>

<!--
Point the audience at Lab 1 on the website, where they can walk a judge through
a real support-ticket example, prompt and verdict revealed step by step.
-->

---

<div class="kicker">The catch</div>

## Judges are confident — and biased

<div class="cardrow cols-2">
  <div class="card"><div class="ct">POSITION BIAS</div><h4>Order matters</h4><p>In pairwise mode, judges tend to prefer whichever answer is shown <em>first</em> — regardless of quality.</p></div>
  <div class="card"><div class="ct">VERBOSITY BIAS</div><h4>Longer looks smarter</h4><p>More words and more formatting get rated higher, even when they add nothing.</p></div>
  <div class="card"><div class="ct">SELF-PREFERENCE</div><h4>Likes its own kind</h4><p>A model tends to favour text written in its own style — including its own outputs.</p></div>
  <div class="card"><div class="ct">FORMAT BIAS</div><h4>Bullets &amp; bold win</h4><p>Pretty formatting can sway the score independent of substance.</p></div>
</div>

<p v-click style="margin-top:1.4rem">
<a class="demo-chip" href="../demo/judge/">Flip the answer order &amp; watch the verdict change</a>
</p>

---

<div class="kicker">Mitigations</div>

## Keeping the judge honest

<ul>
  <li v-click><strong>Randomise &amp; swap order</strong> — run A/B and B/A; only trust a winner that survives both</li>
  <li v-click><strong>Anchor with references</strong> — give a gold answer or few-shot examples to calibrate</li>
  <li v-click><strong>Control for length</strong> — instruct "ignore length"; sanity-check the length/score correlation</li>
  <li v-click><strong>Use a different model as judge</strong> — reduce self-preference</li>
  <li v-click><strong>Ensemble &amp; aggregate</strong> — multiple judges or repeated runs, then take a majority/mean</li>
</ul>

<p v-click="3" class="callout" style="margin-top:1.2rem">
But every mitigation begs the real question: <span class="accent">how do we know the judge is right at all?</span>
</p>

---
layout: center
class: section text-center
transition: fade
---

<div class="kicker">Part 03</div>

# Can we trust the judge?

<div class="rule-accent" style="margin:1rem auto"></div>

<p class="muted">Validate it the only honest way — against people.</p>

---

<div class="kicker">Validation</div>

## Treat the judge like a new hire

<div class="grid grid-cols-2 gap-10" style="margin-top:0.4rem; align-items:center">
<div>

<ol style="font-size:1.2rem; line-height:1.7">
  <li>Take a <strong>sample</strong> of real outputs.</li>
  <li>Have <strong>humans</strong> label them carefully.</li>
  <li>Have the <strong>judge</strong> label the same items.</li>
  <li>Measure <strong>how often they agree</strong>.</li>
</ol>

<p v-click class="muted">
If the judge agrees with your experts, you can trust it to scale. If not, fix the rubric and repeat.
</p>

</div>
<div v-click>
<p class="callout">
The judge isn't trustworthy because it's an AI.<br>
It's trustworthy because it <span class="accent">agrees with humans</span> you trust.
</p>
</div>
</div>

---

<div class="kicker">A trap</div>

## "They agreed 80% of the time!" — so what?

<div class="grid grid-cols-2 gap-10" style="margin-top:0.4rem">
<div>

<p>Imagine grading pass/fail, where <strong>90% of answers pass</strong>.</p>

<p v-click>Two raters who just say <em>"pass"</em> to everything — <strong>ignoring the content entirely</strong> — will agree about <strong>80%+</strong> of the time.</p>

<p v-click class="muted">High raw agreement can be almost <strong>entirely luck</strong>, driven by the common answer.</p>

</div>
<div v-click="3">
<p class="callout">
We need agreement <span class="accent">beyond what chance alone</span> would produce.
</p>

<p class="muted" style="margin-top:1rem">That correction is exactly what Cohen's Kappa gives us.</p>
</div>
</div>

<!--
This sets up the whole reason kappa exists: raw % agreement is inflated by the
base rate. Don't reward a rater for guessing the majority class.
-->

---

<div class="kicker">The metric</div>

## Cohen's Kappa, in one line

<div class="callout" style="font-size:1.7rem; margin:1rem 0 1.4rem">
κ = (p<sub>o</sub> − p<sub>e</sub>) ⁄ (1 − p<sub>e</sub>)
</div>

<div class="cardrow cols-3">
  <div class="card"><div class="ct">p<sub>o</sub></div><h4>Observed agreement</h4><p>How often the two raters actually agreed.</p></div>
  <div class="card"><div class="ct">p<sub>e</sub></div><h4>Expected by chance</h4><p>How often they'd agree just by guessing at their base rates.</p></div>
  <div class="card"><div class="ct">κ</div><h4>The credit that's left</h4><p>Agreement <em>above</em> chance, scaled so 1 = perfect, 0 = pure luck.</p></div>
</div>

<p v-click class="muted" style="margin-top:1.4rem">
Read it as: <strong>"of the agreement that wasn't guaranteed by luck, how much did they actually achieve?"</strong>
</p>

---

<div class="kicker">Worked example</div>

## Judge vs human on 100 answers

<div class="grid grid-cols-2 gap-10" style="margin-top:0.4rem; align-items:center">
<div>

<table class="mini">
  <tr><th></th><th>Judge: PASS</th><th>Judge: FAIL</th></tr>
  <tr><th>Human: PASS</th><td class="diag">45</td><td>10</td></tr>
  <tr><th>Human: FAIL</th><td>5</td><td class="diag">40</td></tr>
</table>

<p class="muted" style="margin-top:1rem; font-size:0.95rem">Diagonals = they agreed (85 of 100).</p>

</div>
<div>

<div v-click>
<p>p<sub>o</sub> = (45 + 40) / 100 = <strong>0.85</strong></p>
</div>
<div v-click>
<p>p<sub>e</sub> = <strong>0.50</strong> <span class="muted">(from each rater's pass/fail rate)</span></p>
</div>
<div v-click>
<p style="font-size:1.4rem">κ = (0.85 − 0.50) / (1 − 0.50) = <span class="accent"><strong>0.70</strong></span></p>
</div>

<p v-click="4" style="margin-top:1.2rem">
<a class="demo-chip" href="../demo/kappa/">Try the live Kappa calculator</a>
</p>

</div>
</div>

<!--
85% agreement, but kappa is 0.70 — because half of that agreement was expected by
chance. The calculator on the site lets them edit this matrix and watch kappa move.
-->

---

<div class="kicker">Interpreting κ</div>

## How good is "good enough"?

<div style="margin-top:0.6rem">

| κ range | Landis &amp; Koch label | Trust the judge? |
|---|---|---|
| < 0.00 | Poor | No — worse than chance |
| 0.01 – 0.20 | Slight | No |
| 0.21 – 0.40 | Fair | Not yet |
| 0.41 – 0.60 | Moderate | Borderline — improve the rubric |
| **0.61 – 0.80** | **Substantial** | **Usually yes** |
| 0.81 – 1.00 | Almost perfect | Yes |

</div>

<p v-click class="muted" style="margin-top:1rem">
These bands are a <strong>convention, not a law</strong> — but "aim for ≥ 0.6, celebrate ≥ 0.8" is a fine team rule.
</p>

---

<div class="kicker">The gotcha</div>

## The Kappa Paradox

<div class="grid grid-cols-2 gap-10" style="margin-top:0.4rem; align-items:center">
<div>

<table class="mini">
  <tr><th></th><th>Judge: PASS</th><th>Judge: FAIL</th></tr>
  <tr><th>Human: PASS</th><td class="diag">85</td><td>5</td></tr>
  <tr><th>Human: FAIL</th><td>5</td><td class="diag">5</td></tr>
</table>

<p class="muted" style="margin-top:1rem; font-size:0.95rem">They agreed on 90 of 100 answers.</p>

</div>
<div>

<div v-click><p>p<sub>o</sub> = <strong>0.90</strong> &nbsp;😀</p></div>
<div v-click><p>p<sub>e</sub> = <strong>0.82</strong> <span class="muted">(almost everything is "pass")</span></p></div>
<div v-click><p style="font-size:1.4rem">κ = (0.90 − 0.82)/(1 − 0.82) = <span class="accent"><strong>0.44</strong></span></p></div>

<p v-click="4" class="callout" style="margin-top:1rem">
90% agreement → only <span class="accent">"moderate"</span> κ. When one class dominates, kappa gets harsh.
</p>

</div>
</div>

<p v-click="5" style="margin-top:0.6rem">
<a class="demo-chip" href="../demo/kappa/">Load the "paradox" preset</a>
</p>

<!--
Lesson: always report BOTH raw agreement and kappa, and watch your class balance.
On highly imbalanced data, kappa can look alarmingly low even when raters basically agree.
-->

---

<div class="kicker">The wider toolbox</div>

## Beyond Cohen's Kappa

<div class="cardrow cols-3">
  <div class="card"><div class="ct">ORDINAL</div><h4>Weighted κ</h4><p>For ordered labels (1–5 stars), partial credit: "4 vs 5" beats "1 vs 5".</p></div>
  <div class="card"><div class="ct">&gt; 2 RATERS</div><h4>Fleiss' κ</h4><p>Cohen's only handles two raters. Fleiss' generalises to a whole panel.</p></div>
  <div class="card"><div class="ct">GENERAL</div><h4>Krippendorff's α</h4><p>Any number of raters, any scale, handles missing data. The Swiss-army knife.</p></div>
</div>

<p v-click class="muted" style="margin-top:1.6rem">
Same idea throughout: <strong>agreement, corrected for chance</strong>. Pick the one that fits your labels.
</p>

---

<div class="kicker">Putting it together</div>

## The judge-validation loop

<div class="grid grid-cols-4 gap-3" style="margin-top:1rem; text-align:center">
  <div v-click class="card"><div class="ct">1</div><h4>Sample &amp; label</h4><p>Humans grade a real slice.</p></div>
  <div v-click class="card"><div class="ct">2</div><h4>Run the judge</h4><p>Same items, same rubric.</p></div>
  <div v-click class="card"><div class="ct">3</div><h4>Measure κ</h4><p>Agreement beyond chance.</p></div>
  <div v-click class="card"><div class="ct">4</div><h4>Trust or fix</h4><p>κ high → scale. Low → fix rubric, repeat.</p></div>
</div>

<p v-click="5" class="callout" style="margin-top:1.8rem">
Once κ is high, the judge runs on <span class="accent">thousands</span> of items while the humans go home.
</p>

---
layout: center
class: section text-center
transition: fade
---

<div class="kicker">Part 04</div>

# Singapore: AI Verify

<div class="rule-accent" style="margin:1rem auto"></div>

<p class="muted">How a national programme turns these ideas into governance &amp; tooling.</p>

---

<div class="kicker">The context</div>

## Governance you can actually run

<div class="grid grid-cols-2 gap-10" style="margin-top:0.4rem">
<div>

<p><strong>AI Verify</strong> — launched by Singapore's <strong>IMDA</strong>, stewarded by the <strong>AI Verify Foundation</strong> (a public–private body; members include Google, IBM, Microsoft, Salesforce).</p>

<ul>
  <li v-click>An open-source <strong>testing framework + toolkit</strong></li>
  <li v-click>Checks AI against <strong>11 governance principles</strong> (fairness, robustness, transparency, accountability…)</li>
  <li v-click>Combines <strong>technical tests</strong> + <strong>process checks</strong></li>
</ul>

</div>
<div v-click="3">
<p class="callout">
Testing ≠ certification.<br>
AI Verify produces <span class="accent">evidence</span>, not a "safe" stamp.
</p>
<p class="muted" style="margin-top:1rem; font-size:0.95rem">
Passing the tests doesn't declare a system safe or ethical — it documents what was checked.
</p>
</div>
</div>

<!--
Key nuance for the audience: this is the most commonly misunderstood point.
AI Verify gives verifiability and documentation, not a guarantee.
-->

---

<div class="kicker">Two tools, two jobs</div>

## AI Verify vs Project Moonshot

<div class="cardrow cols-2">
  <div class="card">
    <div class="ct">AI VERIFY — 2022</div>
    <h4>Traditional ML</h4>
    <p>Classification &amp; regression, mostly on tabular data (limited image support). Fairness, robustness, explainability tests + governance process checks.</p>
  </div>
  <div class="card">
    <div class="ct">PROJECT MOONSHOT — 2024</div>
    <h4>Generative AI / LLMs</h4>
    <p>One of the first open LLM evaluation toolkits: benchmarking, red-teaming, and safety baselines for chatbots &amp; LLM apps.</p>
  </div>
</div>

<p v-click class="muted" style="margin-top:1.6rem">
Same foundation, different era: AI Verify for classic models, <strong>Moonshot for the LLMs we actually build today</strong>.
</p>

---

<div class="kicker">Inside Moonshot</div>

## And yes — it uses an LLM judge

<div class="grid grid-cols-2 gap-10" style="margin-top:0.3rem">
<div>

<p style="font-size:1.1rem">A recipe = a <strong>dataset</strong> + a <strong>metric</strong>:</p>

<div style="margin-top:0.6rem; font-family:'JetBrains Mono',monospace; font-size:0.95rem; line-height:1.9">
<span class="pill">Connector</span> → talk to any LLM<br>
<span class="pill">Dataset</span> → prompts + targets<br>
<span class="pill">Metric</span> → score (incl. <span class="accent">LLM-as-judge</span>)<br>
<span class="pill">Recipe</span> → dataset + metric<br>
<span class="pill">Cookbook</span> → a themed set of recipes
</div>

</div>
<div>

<ul>
  <li v-click><strong>Benchmarking</strong> — capability, quality, trust &amp; safety</li>
  <li v-click><strong>Red-teaming</strong> — automated adversarial prompts</li>
  <li v-click><strong>Baseline testing</strong> — a safety floor before you ship</li>
</ul>

<p v-click="4" style="margin-top:1.2rem">
<a class="demo-chip" href="../demo/moonshot/">Explore the Moonshot map</a>
</p>

</div>
</div>

<!--
Tie it back: everything earlier in the deck (judges, rubrics, agreement) is exactly
what a toolkit like Moonshot operationalises. The demo shows how a recipe runs.
-->

---

<div class="kicker">The 2025 finding</div>

## Risk is context-dependent

<div class="grid grid-cols-2 gap-10" style="margin-top:0.4rem; align-items:center">
<div>

<p>Singapore's <strong>Global AI Assurance Pilot</strong> (2025) ran the world's first technical testing of <strong>real-world</strong> GenAI apps — 17 organisations across 10 sectors.</p>

<p v-click class="muted">The headline lesson:</p>

</div>
<div v-click="2">
<p class="callout">
GenAI risk is <span class="accent">specific</span> — to your industry, use-case, language, culture and data.
</p>
<p class="muted" style="margin-top:1rem">
A generic benchmark won't tell you if <em>your</em> app is safe. You still need <strong>your own</strong> domain evals.
</p>
</div>
</div>

---

<div class="kicker">For your team</div>

## Build your own eval harness

<div class="grid grid-cols-4 gap-3" style="margin-top:0.8rem; text-align:center">
  <div class="card"><div class="ct">DATA</div><h4>A real dataset</h4><p>Representative prompts from your actual use-case.</p></div>
  <div class="card"><div class="ct">JUDGE</div><h4>A rubric'd judge</h4><p>Clear criteria, structured output, bias guards.</p></div>
  <div class="card"><div class="ct">CHECK</div><h4>An agreement gate</h4><p>Validate the judge with κ before trusting it.</p></div>
  <div class="card"><div class="ct">CI</div><h4>A regression gate</h4><p>Run it on every change; block drops in score.</p></div>
</div>

<p v-click class="callout" style="margin-top:1.6rem">
You don't need a national programme — you need <span class="accent">these four boxes</span> wired together.
</p>

---
layout: center
class: section text-center
transition: fade
---

<div class="kicker">Part 05</div>

# Evals in the real world

<div class="rule-accent" style="margin:1rem auto"></div>

<p class="muted">Four things that separate a demo from a system you can trust.</p>

---

<div class="kicker">Make it a habit</div>

## Eval-driven development

<div class="grid grid-cols-2 gap-10" style="margin-top:0.4rem">
<div>
<ul>
  <li v-click>Treat your eval set like a <strong>test suite</strong>.</li>
  <li v-click><strong>Golden set + thresholds</strong> → block any change that drops the score.</li>
  <li v-click>Every prompt tweak or model swap <strong>runs the evals automatically</strong> in CI.</li>
</ul>
</div>
<div v-click="3">
<p class="callout">
A green build should mean <span class="accent">"quality didn't regress"</span> — not just "it compiled".
</p>
</div>
</div>

<!--
This is the natural extension of "build your own harness": once you have data +
judge + agreement, wire it into CI so quality can't silently slip.
-->

---

<div class="kicker">The unglamorous part</div>

## Your eval is only as good as its data

<ul>
  <li v-click><strong>Sample real, representative inputs</strong> — including the hard, weird, and embarrassing ones.</li>
  <li v-click><strong>Write labelling guidelines</strong> so your humans actually agree (remember κ — measure it!).</li>
  <li v-click><strong>Refresh as usage drifts</strong>; watch for stale labels and label noise.</li>
</ul>

<p v-click="3" class="callout" style="margin-top:1.2rem">
A garbage golden set gives you <span class="accent">confident, wrong</span> numbers.
</p>

---

<div class="kicker">Beyond a single answer</div>

## Grading systems, not just replies

<div class="cardrow cols-2">
  <div class="card">
    <div class="ct">RAG</div>
    <h4>Retrieval-augmented</h4>
    <p>Two extra questions: is the answer <strong>faithful</strong> to the retrieved text? And was the retrieved context even <strong>relevant</strong>?</p>
  </div>
  <div class="card">
    <div class="ct">AGENTS</div>
    <h4>Multi-step / tool-using</h4>
    <p>Did it pick the <strong>right tools, in the right order</strong>? Judge the <strong>trajectory</strong>, not only the final output.</p>
  </div>
</div>

<p v-click class="callout" style="margin-top:1.6rem">
For multi-step systems, evaluate the <span class="accent">journey</span> — not just the destination.
</p>

---

<div class="kicker">Break it on purpose</div>

## Red-teaming &amp; safety

<div class="grid grid-cols-2 gap-10" style="margin-top:0.4rem">
<div>
<ul>
  <li v-click>Probe with <strong>adversarial prompts</strong>: jailbreaks, prompt injection, data leakage.</li>
  <li v-click>Use <strong>automated attack suites</strong> — exactly Moonshot's red-teaming.</li>
  <li v-click>Set a <strong>safety baseline before launch</strong>; re-run it after every change.</li>
</ul>
</div>
<div v-click="3">
<p class="callout">
Capability evals ask <span class="accent">"is it good?"</span><br>
Safety evals ask <span class="accent">"can it be made bad?"</span>
</p>
</div>
</div>

<!--
Ties straight back to the Moonshot section: benchmarking = capability,
red-teaming = safety. Both belong in your harness.
-->

---

<div class="kicker">Remember this</div>

## Six takeaways

<ul>
  <li v-click>Open-ended outputs need <strong>judgement</strong>, not string-matching.</li>
  <li v-click><strong>LLM-as-a-judge</strong> gives human-like grading at machine speed — if you write a real rubric.</li>
  <li v-click>Judges are <strong>biased</strong> (order, length, self-preference). Design around it.</li>
  <li v-click>Never trust a judge you haven't <strong>validated against humans</strong> — and use <strong>Cohen's Kappa</strong>, not raw %.</li>
  <li v-click>Risk is <strong>context-specific</strong>. Build <strong>your own</strong> evals; let AI Verify / Moonshot inspire the structure.</li>
  <li v-click>Evals aren't a one-off: <strong>wire them into CI</strong>, curate the golden set, and <strong>red-team</strong> before you ship.</li>
</ul>

---

<div class="kicker">Go deeper</div>

## Resources &amp; the live demos

<div class="cardrow cols-2">
  <div class="card">
    <div class="ct">THIS KIT</div>
    <h4>The interactive labs →</h4>
    <p><a href="../demo/">Judge walkthrough</a> · <a href="../demo/kappa/">Kappa calculator</a> · <a href="../demo/moonshot/">Moonshot map</a></p>
  </div>
  <div class="card">
    <div class="ct">SINGAPORE</div>
    <h4>Official sources</h4>
    <p>aiverifyfoundation.sg · github.com/aiverify-foundation/moonshot · assurance.aiverifyfoundation.sg</p>
  </div>
</div>

<p style="margin-top:2rem; font-size:1.5rem; font-weight:700; letter-spacing:-0.03em">
Now go measure something. <span class="accent">Thank you.</span>
</p>

<div class="foot-tag">Evals 101 · End of main deck — appendix follows</div>

---
layout: center
class: text-center
---

<div class="kicker">Appendix</div>

## The kappa arithmetic, in full

<div style="text-align:left; max-width:42ch; margin:0 auto; font-size:1.05rem">

For the worked example — matrix `[[45,10],[5,40]]`:

- Human says PASS: 55/100 → **0.55**; Judge says PASS: 50/100 → **0.50**
- Chance of both PASS = 0.55 × 0.50 = **0.275**
- Chance of both FAIL = 0.45 × 0.50 = **0.225**
- p<sub>e</sub> = 0.275 + 0.225 = **0.50**
- p<sub>o</sub> = (45 + 40)/100 = **0.85**
- κ = (0.85 − 0.50) / (1 − 0.50) = **0.70**

</div>

<p class="muted" style="margin-top:1.4rem; font-size:0.95rem">
p<sub>e</sub> multiplies each rater's marginal rates — that's the "by chance" model kappa corrects for.
</p>

<div class="foot-tag">Evals 101 · Appendix</div>

---

<div class="kicker">Appendix · Citations</div>

## Sources &amp; further reading

<div style="text-align:left; font-size:0.92rem; line-height:1.5; max-width:64ch">

**Singapore AI Verify / Moonshot**
- `aiverifyfoundation.sg` — framework, the 11 governance principles, Project Moonshot
- `github.com/aiverify-foundation/moonshot` — the open-source LLM evaluation toolkit
- `assurance.aiverifyfoundation.sg` — Global AI Assurance Pilot (2025)

**LLM-as-a-judge**
- Zheng et al. 2023, *Judging LLM-as-a-Judge with MT-Bench &amp; Chatbot Arena* — arXiv:2306.05685
- *Justice or Prejudice? Quantifying Biases in LLM-as-a-Judge* (2024) — arXiv:2410.02736

**Agreement &amp; Cohen's Kappa**
- Cohen 1960 (κ) · Cohen 1968 (weighted κ, *Psych. Bulletin* 70:213–220)
- Landis &amp; Koch 1977, *Biometrics* 33:159–174 — the interpretation bands
- Feinstein &amp; Cicchetti 1990, *J. Clin. Epidemiol.* 43:543–549 — the kappa paradox
- Krippendorff's α — any number of raters, any scale, tolerates missing data

</div>

<div class="foot-tag">Evals 101 · Appendix</div>

---

<div class="kicker">Appendix · For the eval nerds</div>

## Fine print &amp; honest caveats

<ul style="font-size:1.02rem; line-height:1.5; max-width:60ch">
  <li v-click><strong>Reference-guided</strong> grading is really a <em>variant</em> of single-answer grading (the judge is handed a gold answer) — not a separate third axis.</li>
  <li v-click><strong>Fleiss' κ</strong> extends to a whole panel but is <em>nominal-only</em> and assumes a fixed number of ratings per item; <strong>Krippendorff's α</strong> is the more general tool.</li>
  <li v-click><strong>Formatting / markdown bias</strong> is documented in <em>later</em> work — not the original MT-Bench paper.</li>
  <li v-click><strong>Landis–Koch bands are arbitrary</strong> (the authors said as much). Always read κ <em>next to</em> the confusion matrix — remember the paradox.</li>
</ul>

<div class="foot-tag">Evals 101 · Appendix</div>
