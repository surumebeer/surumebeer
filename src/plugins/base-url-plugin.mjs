/**
 * Markdown 中のルート相対 URL (`/articles/`, `/images/x.png` など) に
 * base path を付与する Sätteri hast プラグイン。
 *
 * Astro が base を解決するのは .astro 側のリンクだけなので、
 * これがないと GitHub Pages 上で `/surumebeer` を欠いた URL になる。
 */

/** URL を 1 つ持つ要素と、その属性名 */
const URL_ATTRIBUTES = {
  a: 'href',
  area: 'href',
  link: 'href',
  form: 'action',
  object: 'data',
  img: 'src',
  source: 'src',
  video: 'src',
  audio: 'src',
  iframe: 'src',
  embed: 'src',
  track: 'src',
};

/** srcset を持つ要素（`src` とは別に処理する） */
const SRCSET_TAGS = ['img', 'source'];

/**
 * base を付けるべきルート相対 URL なら付けた値を、そうでなければ null を返す。
 *
 * @param {string} base 末尾スラッシュなしの base path
 * @param {unknown} value 元の URL
 * @returns {string | null}
 */
export function prefixBase(base, value) {
  if (typeof value !== 'string') return null;
  // プロトコル相対 URL (//example.com) は外部リンクなので触らない
  if (!value.startsWith('/') || value.startsWith('//')) return null;

  // すでに base が付いている URL を二重に処理しない。
  // `/surumebeer-old` のような別パスと区別するため、境界文字まで見る。
  if (value.startsWith(base)) {
    const boundary = value.charAt(base.length);
    if (boundary === '' || boundary === '/' || boundary === '?' || boundary === '#') {
      return null;
    }
  }

  return `${base}${value}`;
}

/**
 * srcset の各候補 (`/a.png 1x, /b.png 2x`) に base を付ける。
 * 付け替えるものがなければ null を返す。
 *
 * @param {string} base 末尾スラッシュなしの base path
 * @param {unknown} value 元の srcset
 * @returns {string | null}
 */
export function prefixSrcset(base, value) {
  if (typeof value !== 'string') return null;

  let changed = false;
  const candidates = value.split(',').map((candidate) => {
    const match = candidate.match(/^(\s*)(\S+)(.*)$/);
    if (match === null) return candidate;

    const [, leading, url, trailing] = match;
    const prefixed = prefixBase(base, url);
    if (prefixed === null) return candidate;

    changed = true;
    return `${leading}${prefixed}${trailing}`;
  });

  return changed ? candidates.join(',') : null;
}

/*
 * 生 HTML の走査用パターン。
 * 先頭の 2 つの選択肢でコメントと script / style の中身を丸ごと読み飛ばし、
 * 3 つ目でだけ開始タグを捕まえる。属性の外にある JS・CSS・本文テキストを
 * 誤って書き換えないための切り分け。
 */
const RAW_SCAN_PATTERN =
  /<!--[\s\S]*?-->|<(script|style)\b[\s\S]*?<\/\1\s*>|<([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g;

/** 開始タグの中から属性を 1 つずつ取り出す。値はクォートあり・なしの両方を許す。 */
const RAW_ATTRIBUTE_PATTERN =
  /([a-zA-Z_:][a-zA-Z0-9_.:-]*)(\s*=\s*)("[^"]*"|'[^']*'|[^\s"'=<>`]+)/g;

/**
 * 開始タグの属性部分に base を付ける。
 * 書き換えたら新しい属性文字列を、何もなければ null を返す。
 *
 * @param {string} base
 * @param {string} tagName 小文字化済みのタグ名
 * @param {string} attrs 開始タグのうち属性が並ぶ部分
 * @returns {string | null}
 */
function prefixTagAttributes(base, tagName, attrs) {
  const urlAttribute = URL_ATTRIBUTES[tagName];
  const allowsSrcset = SRCSET_TAGS.includes(tagName);
  if (urlAttribute === undefined && !allowsSrcset) return null;

  let changed = false;
  const result = attrs.replace(
    RAW_ATTRIBUTE_PATTERN,
    (match, name, equals, value) => {
      const lowered = name.toLowerCase();
      const isSrcset = allowsSrcset && lowered === 'srcset';
      if (!isSrcset && lowered !== urlAttribute) return match;

      const quote = value.startsWith('"') || value.startsWith("'") ? value.charAt(0) : '';
      const url = quote === '' ? value : value.slice(1, -1);
      const prefixed = isSrcset ? prefixSrcset(base, url) : prefixBase(base, url);
      if (prefixed === null) return match;

      changed = true;
      // クォートなしの値は空白を含められないので、書き戻すときは必ずクォートする
      const wrap = quote === '' ? '"' : quote;
      return `${name}${equals}${wrap}${prefixed}${wrap}`;
    },
  );

  return changed ? result : null;
}

/**
 * 生 HTML 文字列中の URL 属性に base を付ける。
 * 書き換えるものがなければ null を返す。
 *
 * Sätteri は既定で Markdown 中の生 HTML を不透明な `raw` ノードとして扱うため、
 * 要素の visitor では届かない。`features: { rawHtml: true }` を使えば要素として
 * 解析されるが、その再パースでコードフェンスの言語情報 (`code.data.lang`) が
 * 失われてシンタックスハイライトが全部 plaintext になるので、有効にできない。
 *
 * @param {string} base 末尾スラッシュなしの base path
 * @param {unknown} html 元の生 HTML
 * @returns {string | null}
 */
export function prefixRawHtml(base, html) {
  if (typeof html !== 'string') return null;

  let changed = false;
  const result = html.replace(
    RAW_SCAN_PATTERN,
    // 2 番目のグループ (script / style のタグ名) は位置合わせ用で読まない
    (match, _skipped, tagName, attrs) => {
      // コメントと script / style は素通し
      if (tagName === undefined) return match;

      const prefixed = prefixTagAttributes(base, tagName.toLowerCase(), attrs);
      if (prefixed === null) return match;

      changed = true;
      return `<${tagName}${prefixed}>`;
    },
  );

  return changed ? result : null;
}

/** @param {string} base Astro の `base` 設定値 */
export function baseUrlPlugin(base) {
  const normalized = base.replace(/\/$/, '');

  return {
    name: 'base-url',
    element: {
      filter: [...new Set([...Object.keys(URL_ATTRIBUTES), ...SRCSET_TAGS])],
      visit(node, ctx) {
        if (normalized === '') return;

        const attribute = URL_ATTRIBUTES[node.tagName];
        if (attribute !== undefined) {
          const prefixed = prefixBase(normalized, node.properties?.[attribute]);
          if (prefixed !== null) {
            ctx.setProperty(node, attribute, prefixed);
          }
        }

        if (SRCSET_TAGS.includes(node.tagName)) {
          const prefixed = prefixSrcset(normalized, node.properties?.srcSet);
          if (prefixed !== null) {
            ctx.setProperty(node, 'srcSet', prefixed);
          }
        }
      },
    },
    // Markdown 中の生 HTML は要素にならず raw ノードのまま届く
    raw(node) {
      if (normalized === '') return;

      const prefixed = prefixRawHtml(normalized, node.value);
      if (prefixed !== null) {
        return /** @type {{ type: 'raw'; value: string }} */ ({
          type: 'raw',
          value: prefixed,
        });
      }
    },
  };
}
