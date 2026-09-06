import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  formatDate,
  parseArticlePath,
  validateArticlePath,
} from '../src/lib/article-utils.ts';

describe('formatDate', () => {
  it('UTC の YYYY-MM-DD に整形する', () => {
    assert.equal(formatDate(new Date('2026-09-06')), '2026-09-06');
  });
});

describe('parseArticlePath', () => {
  it('YYYY/MM/DD/slug を分解する', () => {
    assert.deepEqual(parseArticlePath('2026/09/06/hello-astro'), {
      year: '2026',
      month: '09',
      day: '06',
      slug: 'hello-astro',
      date: '2026-09-06',
    });
  });

  it('slug にハイフンや数字を含められる', () => {
    assert.equal(parseArticlePath('2026/01/01/a-1-b')?.slug, 'a-1-b');
  });

  it('階層が足りない・多い場合は null', () => {
    assert.equal(parseArticlePath('hello-astro'), null);
    assert.equal(parseArticlePath('2026/09/hello-astro'), null);
    assert.equal(parseArticlePath('2026/09/06/nested/hello-astro'), null);
  });

  it('桁数が違う場合は null', () => {
    assert.equal(parseArticlePath('26/09/06/x'), null);
    assert.equal(parseArticlePath('2026/9/06/x'), null);
    assert.equal(parseArticlePath('2026/09/6/x'), null);
  });

  it('存在しない日付は null', () => {
    assert.equal(parseArticlePath('2026/02/30/x'), null);
    assert.equal(parseArticlePath('2026/13/01/x'), null);
    assert.equal(parseArticlePath('2026/00/01/x'), null);
    assert.equal(parseArticlePath('2026/01/00/x'), null);
  });

  it('うるう年を正しく判定する', () => {
    assert.notEqual(parseArticlePath('2024/02/29/x'), null);
    assert.equal(parseArticlePath('2026/02/29/x'), null);
  });

  it('slug が空の場合は null', () => {
    assert.equal(parseArticlePath('2026/09/06/'), null);
  });
});

describe('validateArticlePath', () => {
  it('パスと pubDate が一致していれば分解結果を返す', () => {
    const parsed = validateArticlePath('2026/09/06/hello', new Date('2026-09-06'));
    assert.equal(parsed.slug, 'hello');
    assert.equal(parsed.date, '2026-09-06');
  });

  it('パスの形が違えばエラーにする', () => {
    assert.throws(
      () => validateArticlePath('hello', new Date('2026-09-06')),
      /YYYY\/MM\/DD/,
    );
  });

  it('pubDate がパスと食い違えばエラーにする', () => {
    assert.throws(
      () => validateArticlePath('2026/09/06/hello', new Date('2026-01-02')),
      /2026-01-02/,
    );
  });
});
