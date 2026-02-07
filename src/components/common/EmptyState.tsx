interface EmptyStateProps {
  title: string
  message: string
}

export const EmptyState = ({ title, message }: EmptyStateProps) => {
  return (
    <div className="rounded-2xl border border-border/70 bg-surface/60 p-8 text-center">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <p className="mt-3 text-sm text-muted">{message}</p>
    </div>
  )
}
