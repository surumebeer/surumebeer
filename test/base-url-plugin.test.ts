import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  prefixBase,
  prefixRawHtml,
  prefixSrcset,
} from '../src/plugins/base-url-plugin.mjs';

describe('prefixBase', () => {
  const base = '/surumebeer';

  it('ルート相対 URL に base を付ける', () => {
    assert.equal(prefixBase(base, '/articles/'), '/surumebeer/articles/');
    assert.equal(prefixBase(base, '/images/x.png'), '/surumebeer/images/x.png');
  });

  it('絶対 URL には触らない', () => {
    assert.equal(prefixBase(base, 'https://example.com/foo'), null);
  });

  it('プロトコル相対 URL には触らない', () => {
    assert.equal(prefixBase(base, '//example.com/foo'), null);
  });

  it('相対 URL には触らない', () => {
    assert.equal(prefixBase(base, './foo'), null);
    assert.equal(prefixBase(base, 'foo/bar'), null);
  });

  it('ページ内アンカーには触らない', () => {
    assert.equal(prefixBase(base, '#section'), null);
  });

  it('すでに base が付いた URL を二重に処理しない', () => {
    assert.equal(prefixBase(base, '/surumebeer'), null);
    assert.equal(prefixBase(base, '/surumebeer/'), null);
    assert.equal(prefixBase(base, '/surumebeer/articles/'), null);
    assert.equal(prefixBase(base, '/surumebeer?tab=1'), null);
    assert.equal(prefixBase(base, '/surumebeer#top'), null);
  });

  it('base と紛らわしい別パスは処理する', () => {
    assert.equal(prefixBase(base, '/surumebeer-old/'), '/surumebeer/surumebeer-old/');
  });

  it('文字列以外は無視する', () => {
    assert.equal(prefixBase(base, undefined), null);
    assert.equal(prefixBase(base, 42), null);
  });
});

describe('prefixSrcset', () => {
  const base = '/surumebeer';

  it('各候補の URL に base を付ける', () => {
    assert.equal(
      prefixSrcset(base, '/a.png 1x, /b.png 2x'),
      '/surumebeer/a.png 1x, /surumebeer/b.png 2x',
    );
  });

  it('外部 URL の候補は残す', () => {
    assert.equal(
      prefixSrcset(base, '/a.png 1x, https://example.com/b.png 2x'),
      '/surumebeer/a.png 1x, https://example.com/b.png 2x',
    );
  });

  it('付け替えるものがなければ null を返す', () => {
    assert.equal(prefixSrcset(base, 'https://example.com/b.png 2x'), null);
  });
});

describe('prefixRawHtml', () => {
  const base = '/surumebeer';

  it('生 HTML の href / src に base を付ける', () => {
    assert.equal(
      prefixRawHtml(base, '<a href="/articles/">x</a>'),
      '<a href="/surumebeer/articles/">x</a>',
    );
    assert.equal(
      prefixRawHtml(base, '<img src="/a.png">'),
      '<img src="/surumebeer/a.png">',
    );
  });

  it('シングルクォートも扱う', () => {
    assert.equal(
      prefixRawHtml(base, "<a href='/articles/'>x</a>"),
      "<a href='/surumebeer/articles/'>x</a>",
    );
  });

  it('action / data / srcset も対象にする', () => {
    assert.equal(
      prefixRawHtml(base, '<form action="/search/">'),
      '<form action="/surumebeer/search/">',
    );
    assert.equal(
      prefixRawHtml(base, '<img srcset="/a.png 1x, /b.png 2x">'),
      '<img srcset="/surumebeer/a.png 1x, /surumebeer/b.png 2x">',
    );
  });

  it('外部 URL や相対 URL には触らない', () => {
    const html = '<a href="https://example.com/">x</a><img src="./a.png">';
    assert.equal(prefixRawHtml(base, html), null);
  });

  it('base 済み URL を二重に処理しない', () => {
    assert.equal(prefixRawHtml(base, '<a href="/surumebeer/articles/">x</a>'), null);
  });

  it('対象外の属性には触らない', () => {
    assert.equal(prefixRawHtml(base, '<div data-path="/articles/"></div>'), null);
  });

  it('書き換えるものがなければ null を返す', () => {
    assert.equal(prefixRawHtml(base, '<br>'), null);
  });

  it('script の中身は書き換えない', () => {
    const html = `<script>const x = ' href="/x"';</script>`;
    assert.equal(prefixRawHtml(base, html), null);
  });

  it('style の中身は書き換えない', () => {
    const html = '<style>.a { background: url("/x.png"); }</style>';
    assert.equal(prefixRawHtml(base, html), null);
  });

  it('コメントの中身は書き換えない', () => {
    assert.equal(prefixRawHtml(base, '<!-- <a href="/x">y</a> -->'), null);
  });

  it('タグの外側のテキストは書き換えない', () => {
    assert.equal(prefixRawHtml(base, '<p>href="/x" と書いただけ</p>'), null);
  });

  it('その属性を持たないタグでは書き換えない', () => {
    assert.equal(prefixRawHtml(base, '<div data="/x"></div>'), null);
    assert.equal(prefixRawHtml(base, '<script src="/x.js"></script>'), null);
    assert.equal(prefixRawHtml(base, '<div srcset="/a.png 1x"></div>'), null);
  });

  it('object の data は書き換える', () => {
    assert.equal(
      prefixRawHtml(base, '<object data="/x.pdf"></object>'),
      '<object data="/surumebeer/x.pdf"></object>',
    );
  });

  it('クォートなしの属性値も扱い、出力はクォートする', () => {
    assert.equal(
      prefixRawHtml(base, '<img src=/image.png>'),
      '<img src="/surumebeer/image.png">',
    );
  });

  it('自己終了タグを壊さない', () => {
    assert.equal(
      prefixRawHtml(base, '<img src="/a.png" />'),
      '<img src="/surumebeer/a.png" />',
    );
  });

  it('同じタグ内の他の属性を保持する', () => {
    assert.equal(
      prefixRawHtml(base, '<a class="x" href="/a/" title="y">z</a>'),
      '<a class="x" href="/surumebeer/a/" title="y">z</a>',
    );
  });
});
