// Cohen's Kappa — agreement between two raters, corrected for chance.
// Pure functions, shared by the live calculator and the dataset demo, unit-tested.

export type Matrix = number[][];

/** Total number of rated items in a confusion matrix. */
export function total(m: Matrix): number {
  return m.reduce((s, row) => s + row.reduce((a, b) => a + (b || 0), 0), 0);
}

/** p_o — observed agreement: share of items both raters labelled the same. */
export function observedAgreement(m: Matrix): number {
  const t = total(m);
  if (t === 0) return 0;
  let diag = 0;
  for (let i = 0; i < m.length; i++) diag += m[i]?.[i] ?? 0;
  return diag / t;
}

/** p_e — agreement expected purely by chance, from each rater's base rates. */
export function expectedAgreement(m: Matrix): number {
  const t = total(m);
  if (t === 0) return 0;
  const n = m.length;
  const rowSums = m.map((r) => r.reduce((a, b) => a + (b || 0), 0));
  const colSums = Array.from({ length: n }, (_, j) =>
    m.reduce((s, r) => s + (r[j] ?? 0), 0),
  );
  let pe = 0;
  for (let i = 0; i < n; i++) pe += (rowSums[i] / t) * (colSums[i] / t);
  return pe;
}

/** Cohen's Kappa: (p_o − p_e) / (1 − p_e). */
export function cohenKappa(m: Matrix): number {
  const po = observedAgreement(m);
  const pe = expectedAgreement(m);
  if (1 - pe === 0) return po === 1 ? 1 : 0; // degenerate: everything one class
  return (po - pe) / (1 - pe);
}

export interface Band {
  label: string;
  min: number;
  max: number;
  color: string;
}

// Landis & Koch (1977) interpretation bands.
const BANDS: Band[] = [
  { label: 'Poor', min: -Infinity, max: 0.0, color: '#8a8a84' },
  { label: 'Slight', min: 0.0, max: 0.2, color: '#b08a3e' },
  { label: 'Fair', min: 0.2, max: 0.4, color: '#c9762e' },
  { label: 'Moderate', min: 0.4, max: 0.6, color: '#d8531f' },
  { label: 'Substantial', min: 0.6, max: 0.8, color: '#1f8a4c' },
  { label: 'Almost perfect', min: 0.8, max: 1.0001, color: '#0f6b3a' },
];

export function landisKoch(k: number): Band {
  return BANDS.find((b) => k > b.min && k <= b.max) ?? BANDS[0];
}

export function allBands(): Band[] {
  return BANDS;
}

/** Build a 2×2 confusion matrix from two parallel arrays of binary labels. */
export function confusionFromLabels(
  rater1: string[],
  rater2: string[],
  classes: [string, string],
): Matrix {
  const idx = (v: string) => (v === classes[0] ? 0 : 1);
  const m: Matrix = [
    [0, 0],
    [0, 0],
  ];
  for (let i = 0; i < rater1.length; i++) m[idx(rater1[i])][idx(rater2[i])]++;
  return m;
}
