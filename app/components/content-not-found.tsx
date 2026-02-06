import Link from 'next/link'

interface ContentNotFoundProps {
  title: string
  message: string
  backLink?: { href: string; label: string }
}

export function ContentNotFound({ title, message, backLink }: ContentNotFoundProps) {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground mb-8">{message}</p>
      {backLink && (
        <Link
          href={backLink.href}
          className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          {backLink.label}
        </Link>
      )}
    </div>
  )
}
