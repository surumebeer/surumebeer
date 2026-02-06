import { ContentNotFound } from '@/app/components/content-not-found'

export default function ProductNotFound() {
  return (
    <ContentNotFound
      title="商品が見つかりません"
      message="指定された商品は存在しないか、現在公開されていません。"
      backLink={{ href: '/products', label: '商品一覧に戻る' }}
    />
  )
}
