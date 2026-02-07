interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export const ErrorState = ({
  title = 'Unable to load this section',
  message = 'Try again in a moment.',
  onRetry,
}: ErrorStateProps) => {
  return (
    <div className="rounded-2xl border border-danger/30 bg-danger/10 p-6">
      <h2 className="font-display text-xl font-semibold text-text">{title}</h2>
      <p className="mt-2 text-sm text-muted">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-surface"
        >
          Retry
        </button>
      ) : null}
    </div>
  )
}
