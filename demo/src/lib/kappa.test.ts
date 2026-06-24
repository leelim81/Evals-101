import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cohenKappa,
  observedAgreement,
  expectedAgreement,
  landisKoch,
  confusionFromLabels,
} from './kappa.ts';

const round = (x: number) => Math.round(x * 100) / 100;

test('good-judge preset → κ = 0.70 (substantial)', () => {
  const m = [
    [45, 10],
    [5, 40],
  ];
  assert.equal(round(observedAgreement(m)), 0.85);
  assert.equal(round(expectedAgreement(m)), 0.5);
  assert.equal(round(cohenKappa(m)), 0.7);
  assert.equal(landisKoch(cohenKappa(m)).label, 'Substantial');
});

test('kappa-paradox preset → 90% agreement but κ = 0.44 (moderate)', () => {
  const m = [
    [85, 5],
    [5, 5],
  ];
  assert.equal(round(observedAgreement(m)), 0.9);
  assert.equal(round(expectedAgreement(m)), 0.82);
  assert.equal(round(cohenKappa(m)), 0.44);
  assert.equal(landisKoch(cohenKappa(m)).label, 'Moderate');
});

test('perfect agreement → κ = 1', () => {
  const m = [
    [30, 0],
    [0, 20],
  ];
  assert.equal(cohenKappa(m), 1);
});

test('random judge (independent) → κ ≈ 0', () => {
  const m = [
    [25, 25],
    [25, 25],
  ];
  assert.equal(round(cohenKappa(m)), 0);
});

test('confusionFromLabels builds the right 2×2 matrix', () => {
  const human = ['pass', 'pass', 'fail', 'fail'];
  const judge = ['pass', 'fail', 'fail', 'pass'];
  const m = confusionFromLabels(human, judge, ['pass', 'fail']);
  assert.deepEqual(m, [
    [1, 1],
    [1, 1],
  ]);
});
