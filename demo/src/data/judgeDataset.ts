// A small, pre-labelled eval set (Lab 2): 16 support replies, each graded
// pass/fail by a HUMAN expert and by the LLM JUDGE. We compute Cohen's Kappa
// over this real table to tie the judge walkthrough to the agreement metric.
// Confusion matrix works out to [[8,2],[1,5]] → κ ≈ 0.61 (substantial).

export type Label = 'pass' | 'fail';

export interface Item {
  id: number;
  prompt: string;
  human: Label;
  judge: Label;
  note: string;
}

export const dataset: Item[] = [
  { id: 1, prompt: 'How do I reset my password?', human: 'pass', judge: 'pass', note: 'Both accept the clear step-by-step reply.' },
  { id: 2, prompt: 'Can I export my data to CSV?', human: 'pass', judge: 'pass', note: 'Correct menu path given.' },
  { id: 3, prompt: 'What plans do you offer?', human: 'pass', judge: 'pass', note: 'Accurate, concise tiers.' },
  { id: 4, prompt: 'How do I add a teammate?', human: 'pass', judge: 'pass', note: 'Exact invite flow described.' },
  { id: 5, prompt: 'Is there a mobile app?', human: 'pass', judge: 'pass', note: 'Correct yes + store links.' },
  { id: 6, prompt: 'How do I cancel my subscription?', human: 'pass', judge: 'pass', note: 'Right steps, mentions billing cut-off.' },
  { id: 7, prompt: 'Why was my card declined?', human: 'pass', judge: 'pass', note: 'Lists common causes + next step.' },
  { id: 8, prompt: 'How do I change my email?', human: 'pass', judge: 'pass', note: 'Accurate, with verification note.' },

  { id: 9, prompt: 'Do you support SSO?', human: 'pass', judge: 'fail', note: 'Correct but terse — judge wanted more detail (too harsh).' },
  { id: 10, prompt: 'How do I get a refund?', human: 'pass', judge: 'fail', note: 'Right policy, but judge dinged the brief tone (too harsh).' },

  { id: 11, prompt: 'What are your API rate limits?', human: 'fail', judge: 'pass', note: 'Wrong number quoted — judge missed it (too lenient).' },

  { id: 12, prompt: 'Is my data encrypted at rest?', human: 'fail', judge: 'fail', note: 'Vague, no real answer — both fail.' },
  { id: 13, prompt: 'Can I self-host?', human: 'fail', judge: 'fail', note: 'Confidently wrong — both fail.' },
  { id: 14, prompt: 'How do I downgrade my plan?', human: 'fail', judge: 'fail', note: 'Gives upgrade steps instead — both fail.' },
  { id: 15, prompt: 'Do you have a Zapier integration?', human: 'fail', judge: 'fail', note: 'Hallucinates a feature — both fail.' },
  { id: 16, prompt: 'How long is the free trial?', human: 'fail', judge: 'fail', note: 'States 30 days; it is 14 — both fail.' },
];

// Order of the two classes for building the confusion matrix.
export const classes: [Label, Label] = ['pass', 'fail'];
