export function CodeDemo({ children, ...props }: { children: React.ReactNode }) {
  return (
    <div className="border border-border rounded-lg p-4 bg-muted/30 my-4" {...props}>
      <div className="mb-2 text-sm font-medium text-muted-foreground">Demo:</div>
      <div className="bg-background p-4 rounded border">
        {children}
      </div>
    </div>
  )
}
