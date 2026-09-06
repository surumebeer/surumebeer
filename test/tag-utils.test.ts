import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  groupByTag,
  normalizeTagName,
  normalizeTags,
  tagToSlug,
} from '../src/lib/tag-utils.ts';

describe('normalizeTagName', () => {
  it('前後の空白を落とす', () => {
    assert.equal(normalizeTagName('  Astro  '), 'Astro');
  });

  it('連続する空白を 1 つにまとめる', () => {
    assert.equal(normalizeTagName('GitHub   Pages'), 'GitHub Pages');
  });
});

describe('tagToSlug', () => {
  it('小文字化する', () => {
    assert.equal(tagToSlug('Astro'), 'astro');
  });

  it('空白とアンダースコアをハイフンにする', () => {
    assert.equal(tagToSlug('GitHub Pages'), 'github-pages');
    assert.equal(tagToSlug('github_pages'), 'github-pages');
  });

  it('記号を URL で扱える形に落とす', () => {
    assert.equal(tagToSlug('C++'), 'cplusplus');
    assert.equal(tagToSlug('C#'), 'csharp');
  });

  it('日本語はそのまま残す', () => {
    assert.equal(tagToSlug('日記'), '日記');
  });

  it('slug にできない場合は空文字を返す', () => {
    assert.equal(tagToSlug('   '), '');
  });
});

describe('groupByTag', () => {
  it('タグごとに記事をまとめる', () => {
    const groups = groupByTag([
      { item: 'a', tags: ['Astro', 'TypeScript'] },
      { item: 'b', tags: ['Astro'] },
    ]);

    assert.deepEqual(
      groups.map((g) => [g.name, g.slug, g.items]),
      [
        ['Astro', 'astro', ['a', 'b']],
        ['TypeScript', 'typescript', ['a']],
      ],
    );
  });

  it('記事数の多い順、同数なら名前順に並べる', () => {
    const groups = groupByTag([
      { item: 'a', tags: ['b-tag', 'a-tag', 'many'] },
      { item: 'b', tags: ['many'] },
    ]);

    assert.deepEqual(
      groups.map((g) => g.name),
      ['many', 'a-tag', 'b-tag'],
    );
  });

  it('大文字小文字違いのタグを 1 つにまとめ、最初の表記を採用する', () => {
    const groups = groupByTag([
      { item: 'a', tags: ['Astro'] },
      { item: 'b', tags: ['astro'] },
    ]);

    assert.equal(groups.length, 1);
    assert.equal(groups[0]?.name, 'Astro');
    assert.deepEqual(groups[0]?.items, ['a', 'b']);
  });

  it('同じ記事内の重複タグを二重に数えない', () => {
    const groups = groupByTag([{ item: 'a', tags: ['Astro', 'astro', ' Astro '] }]);

    assert.equal(groups.length, 1);
    assert.deepEqual(groups[0]?.items, ['a']);
  });

  it('slug にできないタグは無視する', () => {
    const groups = groupByTag([{ item: 'a', tags: ['   ', 'Astro'] }]);

    assert.deepEqual(
      groups.map((g) => g.name),
      ['Astro'],
    );
  });

  it('空白・アンダースコア・ハイフンの表記ゆれを統合する', () => {
    const groups = groupByTag([
      { item: 'a', tags: ['GitHub Pages'] },
      { item: 'b', tags: ['github_pages'] },
      { item: 'c', tags: ['github-pages'] },
    ]);

    assert.equal(groups.length, 1);
    assert.equal(groups[0]?.name, 'GitHub Pages');
    assert.deepEqual(groups[0]?.items, ['a', 'b', 'c']);
  });

  it('異なるタグが同じ slug になる場合はエラーにする', () => {
    assert.throws(
      () => groupByTag([{ item: 'a', tags: ['C++', 'Cplusplus'] }]),
      /slug/,
    );
  });
});

describe('normalizeTags', () => {
  it('表示用に整形し、重複と空タグを取り除く', () => {
    assert.deepEqual(normalizeTags(['Astro', 'astro', '   ', ' TypeScript ']), [
      'Astro',
      'TypeScript',
    ]);
  });

  it('slug にできないタグを落とす', () => {
    assert.deepEqual(normalizeTags(['!!!', 'Astro']), ['Astro']);
  });

  it('元の配列を破壊しない', () => {
    const tags = ['Astro', 'astro'];
    normalizeTags(tags);
    assert.deepEqual(tags, ['Astro', 'astro']);
  });
});
