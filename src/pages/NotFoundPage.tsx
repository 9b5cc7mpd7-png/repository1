import { Link } from 'react-router-dom'

export const NotFoundPage = () => {
  return (
    <section className="rounded-2xl border border-border/70 bg-surface/70 p-8 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">404</p>
      <h2 className="mt-2 font-display text-3xl font-semibold">Page not found</h2>
      <p className="mt-3 text-sm text-muted">The route you requested does not exist.</p>
      <Link
        to="/overview"
        className="mt-5 inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-surface"
      >
        Return to overview
      </Link>
    </section>
  )
}
