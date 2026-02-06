import Link from "next/link"
import type { Metadata } from "next"
import { getCssTips } from '@/lib/content/loader'

export const metadata: Metadata = {
  title: "LEARNING CSS",
}

export default function CssTipsPage() {
  const cssTips = getCssTips()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">LEARNING CSS</h1>

      {cssTips.length === 0 ? (
        <p className="text-muted-foreground">LEARNING CSSコンテンツがありません。</p>
      ) : (
        <div className="grid gap-4">
          {cssTips.map((cssTip) => (
            <Link
              key={cssTip.slug}
              href={`/learning-css/${cssTip.slug}`}
              className="block p-6 border rounded-lg hover:bg-accent transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2">{cssTip.title}</h2>
              <time className="text-sm text-muted-foreground">
                {new Date(cssTip.date).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
