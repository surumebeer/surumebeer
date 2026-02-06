export function ColorBox({ color, name }: { color: string; name: string }) {
  return (
    <div className="inline-flex items-center gap-2 p-2 border rounded-lg bg-background">
      <div
        className="w-8 h-8 rounded border"
        style={{ backgroundColor: color }}
      />
      <div>
        <div className="font-medium text-sm">{name}</div>
        <div className="text-xs text-muted-foreground">{color}</div>
      </div>
    </div>
  )
}
