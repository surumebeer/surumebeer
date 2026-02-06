export function CSSProperty({ property, value, description }: {
  property: string
  value: string
  description?: string
}) {
  return (
    <div className="border border-border rounded-lg p-4 my-4">
      <div className="font-mono text-sm mb-2">
        <span className="text-blue-600 dark:text-blue-400">{property}</span>
        <span className="text-muted-foreground">: </span>
        <span className="text-green-600 dark:text-green-400">{value}</span>
        <span className="text-muted-foreground">;</span>
      </div>
      {description && (
        <div className="text-sm text-muted-foreground">{description}</div>
      )}
    </div>
  )
}
