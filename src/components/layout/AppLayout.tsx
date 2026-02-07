import clsx from 'clsx'
import { NavLink, Outlet } from 'react-router-dom'

import { prefetchRouteModule } from '@/app/routeModules'
import { useUiPreferences } from '@/app/ui-preferences'
import { TopBar } from '@/components/layout/TopBar'

const navItems = [
  { to: '/overview', label: 'Overview', caption: 'Pulse and baseline' },
  { to: '/analytics', label: 'Analytics', caption: 'Trend deep-dive' },
  { to: '/customers', label: 'Customers', caption: 'Pipeline and health' },
  { to: '/settings', label: 'Settings', caption: 'Workspace controls' },
]

export const AppLayout = () => {
  const { sidebarCollapsed, toggleSidebar } = useUiPreferences()

  return (
    <div className="relative min-h-screen overflow-hidden bg-surface text-text">
      <a
        href="#main-content"
        className="skip-link absolute left-4 top-4 z-50 -translate-y-16 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-surface focus:translate-y-0"
      >
        Skip to main content
      </a>

      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_15%,hsla(19,88%,56%,0.2),transparent_40%),radial-gradient(circle_at_85%_0%,hsla(187,72%,44%,0.22),transparent_35%),linear-gradient(180deg,transparent_0%,hsla(210,40%,98%,0.65)_100%)]" />

      <div className="mx-auto flex w-full max-w-[1400px] gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <aside
          className={clsx(
            'sticky top-4 hidden h-[calc(100vh-2rem)] shrink-0 rounded-3xl border border-border/70 bg-panel/80 p-4 shadow-card backdrop-blur md:flex md:flex-col',
            sidebarCollapsed ? 'w-20' : 'w-72',
          )}
          aria-label="Sidebar"
        >
          <div className="mb-6 flex items-center justify-between">
            <div
              className={clsx(
                'overflow-hidden transition-all',
                sidebarCollapsed && 'w-0 opacity-0',
              )}
            >
              <p className="font-display text-lg font-semibold">Vertex Ops</p>
              <p className="text-xs text-muted">Command Surface</p>
            </div>
            <button
              type="button"
              onClick={toggleSidebar}
              className="rounded-lg border border-border bg-surface px-2 py-1 text-xs"
              aria-label="Toggle sidebar"
            >
              {sidebarCollapsed ? '>' : '<'}
            </button>
          </div>

          <nav aria-label="Main navigation" className="flex flex-1 flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onMouseEnter={() => {
                  prefetchRouteModule(item.to)
                }}
                onFocus={() => {
                  prefetchRouteModule(item.to)
                }}
                className={({ isActive }) =>
                  clsx(
                    'rounded-xl border px-3 py-2 transition',
                    isActive
                      ? 'border-accent/70 bg-accent/15'
                      : 'border-transparent hover:border-border hover:bg-surface/60',
                  )
                }
              >
                <p
                  className={clsx(
                    'text-sm font-semibold',
                    sidebarCollapsed && 'text-center',
                  )}
                >
                  {sidebarCollapsed ? item.label.slice(0, 1) : item.label}
                </p>
                {!sidebarCollapsed ? (
                  <p className="text-xs text-muted">{item.caption}</p>
                ) : null}
              </NavLink>
            ))}
          </nav>

          {!sidebarCollapsed ? (
            <section className="mt-auto rounded-2xl border border-border/70 bg-surface/80 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-muted">Status</p>
              <p className="mt-2 text-sm font-medium">All systems stable</p>
              <p className="text-xs text-muted">Mock backend healthy</p>
            </section>
          ) : null}
        </aside>

        <div className="min-h-[calc(100vh-2rem)] flex-1 rounded-3xl border border-border/70 bg-panel/85 p-4 shadow-card backdrop-blur-sm sm:p-6">
          <nav
            aria-label="Mobile navigation"
            className="mb-4 flex gap-2 overflow-x-auto pb-1 md:hidden"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onTouchStart={() => {
                  prefetchRouteModule(item.to)
                }}
                className={({ isActive }) =>
                  clsx(
                    'whitespace-nowrap rounded-lg border px-3 py-2 text-sm font-medium transition',
                    isActive
                      ? 'border-accent/70 bg-accent/15 text-text'
                      : 'border-border bg-surface/70 text-muted hover:text-text',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <TopBar />
          <main id="main-content" className="space-y-6" tabIndex={-1}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
