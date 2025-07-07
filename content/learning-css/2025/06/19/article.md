---
title: "Flexboxでセンタリングをマスターしよう"
date: 2025-06-20
isPublished: false
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

## test

<CodeDemo>
  <div style={{ resize: 'horizontal', overflow: 'auto', padding: '20px', backgroundColor: '#f5f5f5', border: '2px solid #ddd', borderRadius: '8px', minWidth: '300px', maxWidth: '100%' }}>
    <p style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>↔️ 右下の角をドラッグしてコンテナのサイズを変更してください</p>
    
    <div style={{ containerType: 'inline-size' }}>
      <div 
        style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          padding: '20px',
          backgroundColor: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <img 
          src="https://via.placeholder.com/200x150/007acc/ffffff?text=サンプル画像" 
          alt="コンテナクエリデモ画像"
          style={{ 
            width: '100%',
            height: 'auto',
            borderRadius: '6px',
            objectFit: 'cover'
          }}
        />
        <div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>レスポンシブカード</h3>
          <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
            このカードはコンテナのサイズに応じてレイアウトが変わります。コンテナを広げると横並びレイアウトになります。
          </p>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @container (min-width: 500px) {
          .demo-container > div > div {
            flex-direction: row !important;
          }
          .demo-container img {
            width: 200px !important;
            flex-shrink: 0;
          }
        }
      ` }} />
    </div>
  </div>
</CodeDemo>
