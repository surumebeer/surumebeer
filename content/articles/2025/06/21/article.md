---
title: "Next.js 15の新機能"
date: 2025-06-21
isPublished: true
---

# Next.js 15 の新機能

Next.js 15 では多くの新機能と改善が追加されました。

## 主な新機能

### App Router の安定化

App Router が正式に安定版となり、本番環境での使用が推奨されています。

### React 18 サポート

React 18 の新機能を完全にサポートし、以下の機能が利用可能です：

- **Suspense** - 非同期コンポーネントの読み込み状態管理
- **Concurrent Features** - より良いユーザーエクスペリエンス
- **Automatic Batching** - 状態更新の最適化

### パフォーマンス改善

```typescript
// 新しいキャッシュシステム
import { cache } from "react";

const getData = cache(async (id: string) => {
  const response = await fetch(`/api/data/${id}`);
  return response.json();
});
```

### Server Actions

フォーム送信とサーバーサイド処理がより簡単になりました。

```typescript
async function createPost(formData: FormData) {
  "use server";

  const title = formData.get("title");
  // データベースに保存
}
```

## 移行のポイント

1. **段階的移行** - 既存の Pages Router から段階的に移行可能
2. **互換性** - 既存の API は引き続き利用可能
3. **TypeScript** - より強力な型サポート

Next.js 15 は開発者体験とパフォーマンスの両面で大幅な改善をもたらします。
