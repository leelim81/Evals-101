// Pre-baked FORMAT-BIAS example for Lab 1 (no API calls).
// The SAME answer — identical facts — written two ways. Only the markdown
// differs, yet a judge scores the formatted version higher. That gap is the bias.

export interface FormatVariant {
  id: 'plain' | 'formatted';
  label: string;
  html: string; // rendered as-is (our own static content)
  scores: { correctness: number; completeness: number; clarity: number; overall: number };
  reason: string;
}

export const formatTask = {
  context: 'Product support · one question, written up two ways.',
  question: 'A user asks: “How do I export all of my data?”',
};

export const plain: FormatVariant = {
  id: 'plain',
  label: 'Plain prose',
  html: `To export your data, open Settings and go to the Privacy tab, then choose "Export data". You can pick CSV or JSON. We'll email you a download link when the file is ready, usually within a few minutes. The link expires after 24 hours, so download it promptly.`,
  scores: { correctness: 5, completeness: 5, clarity: 3, overall: 3 },
  reason: 'Accurate and complete — but it reads as one dense block, so it feels harder to follow.',
};

export const formatted: FormatVariant = {
  id: 'formatted',
  label: 'Formatted — same content',
  html: `<strong>Export your data in 3 steps</strong><ol style="margin:8px 0 4px 18px; padding:0"><li>Open <strong>Settings → Privacy</strong>.</li><li>Click <strong>Export data</strong> and choose <code>CSV</code> or <code>JSON</code>.</li><li>We'll <strong>email a download link</strong> (usually within minutes).</li></ol><span>⏱️ The link <strong>expires after 24 hours</strong> — download it promptly.</span>`,
  scores: { correctness: 5, completeness: 5, clarity: 5, overall: 5 },
  reason: 'Clear, well-structured, and easy to scan — it comes across as more helpful and professional.',
};

export const formatBiasNote =
  'Every fact is identical — same Settings → Privacy path, same CSV/JSON choice, same 24-hour expiry. Only the markdown changed (a heading, bold, a numbered list), yet the judge lifted clarity and overall from 3 to 5. That is format (a.k.a. markdown) bias. Fixes: instruct the judge to grade content and explicitly ignore formatting and length; normalise formatting before grading; and check whether score tracks length or markdown rather than substance.';
