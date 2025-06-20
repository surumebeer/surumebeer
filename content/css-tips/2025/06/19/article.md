---
title: "Flexboxでセンタリングをマスターしよう"
date: 2025-06-20
isPublished: true
---

# Flexbox でセンタリングをマスターしよう

Flexbox を使ったセンタリングテクニックを学びましょう。React コンポーネントを使ってインタラクティブに説明します。

## 基本的なセンタリング

<CSSProperty 
  property="display" 
  value="flex" 
  description="要素をflexコンテナにします"
/>

<CSSProperty 
  property="justify-content" 
  value="center" 
  description="主軸方向（横軸）のセンタリング"
/>

<CSSProperty 
  property="align-items" 
  value="center" 
  description="交差軸方向（縦軸）のセンタリング"
/>

## デモ: 完全センタリング

<CodeDemo>
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    border: '2px dashed #ccc',
    backgroundColor: '#f9f9f9'
  }}>
    <div style={{
      padding: '20px',
      backgroundColor: '#007acc',
      color: 'white',
      borderRadius: '8px'
    }}>
      完全にセンタリングされたボックス
    </div>
  </div>
</CodeDemo>

## 色の使い方

Flexbox と組み合わせてよく使う色の例：

<div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', margin: '16px 0' }}>
  <ColorBox color="#007acc" name="Primary Blue" />
  <ColorBox color="#28a745" name="Success Green" />
  <ColorBox color="#dc3545" name="Danger Red" />
  <ColorBox color="#6c757d" name="Secondary Gray" />
</div>

## 実用的なレイアウト

<CodeDemo>
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '8px'
  }}>
    <div style={{ fontWeight: 'bold' }}>ロゴ</div>
    <div style={{ display: 'flex', gap: '16px' }}>
      <a href="#" style={{ textDecoration: 'none', color: '#007acc' }}>ホーム</a>
      <a href="#" style={{ textDecoration: 'none', color: '#007acc' }}>サービス</a>
      <a href="#" style={{ textDecoration: 'none', color: '#007acc' }}>お問い合わせ</a>
    </div>
  </div>
</CodeDemo>

## まとめ

Flexbox を使えば、複雑なレイアウトも簡単に実現できます：

- `display: flex` で Flex コンテナを作成
- `justify-content` で主軸方向の配置を制御
- `align-items` で交差軸方向の配置を制御
- `gap` で要素間の余白を設定

これらの基本を押さえておけば、モダンな Web レイアウトが簡単に作れます！
