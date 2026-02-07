interface LoadingStateProps {
  message?: string
}

export const LoadingState = ({ message = 'Loading data...' }: LoadingStateProps) => {
  return (
    <div className="flex min-h-[14rem] flex-col items-center justify-center gap-4 rounded-2xl border border-border/70 bg-surface/60 p-8">
      <div
        className="h-9 w-9 animate-spin rounded-full border-2 border-border border-t-accent"
        aria-hidden="true"
      />
      <p className="text-sm text-muted">{message}</p>
    </div>
  )
}
