const todayLabel = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
}).format(new Date())

export const TopBar = () => {
  return (
    <header className="mb-6 flex flex-col justify-between gap-4 border-b border-border/70 pb-5 md:flex-row md:items-center">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted">Ops Control</p>
        <h1 className="font-display text-2xl font-bold">Velocity Dashboard</h1>
      </div>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <p className="text-xs text-muted">{todayLabel}</p>
        <button
          type="button"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-surface"
        >
          New report
        </button>
      </div>
    </header>
  )
}
