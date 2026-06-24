// Pre-baked LLM-as-a-judge example for Lab 1 (no API calls).
// A real support task, two candidate answers, a rubric, pointwise scores,
// and a PAIRWISE verdict that flips when you swap the order — exposing position bias.

export interface Candidate {
  id: 'A' | 'B';
  label: string;
  text: string;
  scores: { correctness: number; helpfulness: number; tone: number };
  judgeReason: string;
}

export const task = {
  context: 'Customer-support assistant for a SaaS product.',
  question: 'A user writes: “I forgot my password and can’t log in. How do I reset it?”',
};

export const rubric = `You are grading a customer-support reply. Score each 1–5.

CRITERIA
- correctness: Are the steps accurate and complete?
- helpfulness: Does it actually unblock the user?
- tone: Is it clear, friendly, and concise?

First write a one-sentence reason, then return JSON:
{ "correctness": n, "helpfulness": n, "tone": n, "overall": n }`;

export const candidates: Candidate[] = [
  {
    id: 'A',
    label: 'Answer A — concise & correct',
    text: `Sure! To reset your password:
1. Go to the login page and click “Forgot password?”
2. Enter your account email — we’ll send a reset link.
3. Open the link (check spam if needed) and choose a new password.
The link expires in 30 minutes. If it doesn’t arrive, let me know and I’ll resend it.`,
    scores: { correctness: 5, helpfulness: 5, tone: 5 },
    judgeReason:
      'Accurate, complete, and anticipates the spam-folder and expiry edge cases — exactly what the user needs.',
  },
  {
    id: 'B',
    label: 'Answer B — padded & vaguer',
    text: `I completely understand how frustrating it can be to lose access to your account — passwords are tricky and it happens to everyone! Not to worry, we’ll get you sorted in no time.

Generally speaking, most modern applications provide some mechanism to recover access, and ours is no exception. You’ll want to look for an option related to password recovery somewhere around the sign-in experience, and from there simply follow the prompts that appear on your screen to regain entry to your account.`,
    scores: { correctness: 3, helpfulness: 2, tone: 4 },
    judgeReason:
      'Warm and well-written, but it never gives the actual steps — the user still doesn’t know exactly what to click.',
  },
];

// Pairwise verdicts. A POSITION-BIASED judge tends to favour whichever answer
// is shown FIRST. We pre-bake both orders so the bias is visible on a click.
export const pairwise = {
  // order = how the two answers were presented to the judge
  AB: {
    order: ['A', 'B'] as const,
    winner: 'A' as const,
    reason:
      'Answer A is concrete and complete; Answer B is friendly but never tells the user what to do. A wins clearly.',
  },
  BA: {
    order: ['B', 'A'] as const,
    winner: 'B' as const,
    reason:
      'Answer B opens with strong empathy and reads smoothly; it makes a better first impression. B edges ahead.',
  },
};

export const biasNote =
  'Same two answers, only the order changed — yet the “winner” flipped to whatever came first. That is position bias. The fix: run both orders (A/B and B/A) and only trust a winner that survives both.';
