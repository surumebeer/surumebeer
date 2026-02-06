---
title: "コンテナクエリの基礎"
date: 2025-07-08
isPublished: false
---

これまでの CSS のレイアウトは、分岐に[viewport](https://developer.mozilla.org/ja/docs/Web/CSS/CSSOM_view/Viewport_concepts)を使用していました。
しかし、再利用可能なコンポーネントが一般的になった現在では、親要素のサイズに応じた見た目の調整が求められ、コンテナクエリを利用することができます。

# コンテナクエリを使うための 2 ステップ

## 1. 親要素に container-type を指定

```css
.card {
  container-type: inline-size;
}
```

- inline-size は「幅」に基づいたクエリを使いたい時に指定できます。
- `container-type: size` は幅と高さ両方に対応できます。

## 2. 子要素に @container で条件分岐を書く

```css
@container ( min-width: 600px ) {
  .card-content {
    flex-direction: row;
  }
}
```

- 上記は、親要素が 600px 以上の場合のみ、子要素の `.card-content` に CSS を適用する書き方です。
- [メディアクエリ](https://developer.mozilla.org/ja/docs/Learn_web_development/Core/CSS_layout/Media_queries)と似た構文ですが、親要素のみを対象にします。

- コンテナクエリの実装例

```css
.card {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

@container (min-width: 600px) {
  .card {
    flex-direction: row;
  }
}
```

```html
<div class="card">
  <img src="https://via.placeholder.com/150" alt="thumbnail" />
  <div>
    <h2>タイトル</h2>
    <p>カードの説明テキストです。</p>
  </div>
</div>
```
