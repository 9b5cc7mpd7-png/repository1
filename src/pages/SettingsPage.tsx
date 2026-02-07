import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { useUiPreferences } from '@/app/ui-preferences'
import { ErrorState } from '@/components/common/ErrorState'
import { LoadingState } from '@/components/common/LoadingState'
import type { UpdateSettingsPayload } from '@/lib/api/types'
import { queryKeys } from '@/lib/queryKeys'
import { settingsService } from '@/lib/services/settingsService'
import type { SettingsModel } from '@/types/domain'

export const SettingsPage = () => {
  const queryClient = useQueryClient()
  const { theme, density, setDensity, setTheme } = useUiPreferences()

  const settingsQuery = useQuery({
    queryKey: queryKeys.settings,
    queryFn: settingsService.get,
  })

  const [draft, setDraft] = useState<SettingsModel | null>(null)
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    if (!settingsQuery.data) {
      return
    }

    setDraft((current) => {
      if (current) {
        return current
      }

      return {
        ...settingsQuery.data,
        theme,
        density,
      }
    })
  }, [density, settingsQuery.data, theme])

  const updateMutation = useMutation({
    mutationFn: settingsService.update,
    onMutate: async (payload) => {
      setMessage('Saving...')
      await queryClient.cancelQueries({ queryKey: queryKeys.settings })

      const previous = queryClient.getQueryData<SettingsModel>(queryKeys.settings)
      if (previous) {
        queryClient.setQueryData<SettingsModel>(queryKeys.settings, {
          ...previous,
          ...payload,
          notifications: {
            ...previous.notifications,
            ...payload.notifications,
          },
        })
      }

      return { previous }
    },
    onError: (_error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.settings, context.previous)
        setDraft(context.previous)
        setTheme(context.previous.theme)
        setDensity(context.previous.density)
      }
      setMessage('Could not save settings. Restored previous state.')
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.settings, data)
      setDraft(data)
      setTheme(data.theme)
      setDensity(data.density)
      setMessage('Settings updated successfully.')
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.settings })
    },
  })

  if (settingsQuery.isLoading || !draft) {
    return <LoadingState message="Loading preferences..." />
  }

  if (settingsQuery.isError) {
    return (
      <ErrorState
        message="Failed to load settings."
        onRetry={() => {
          void settingsQuery.refetch()
        }}
      />
    )
  }

  const saveSettings = (payload: UpdateSettingsPayload) => {
    setDraft((current) => {
      if (!current) {
        return current
      }

      return {
        ...current,
        ...payload,
        notifications: {
          ...current.notifications,
          ...payload.notifications,
        },
      }
    })

    updateMutation.mutate(payload)
  }

  const commitLocale = () => {
    if (!draft) {
      return
    }

    const nextLocale = draft.locale.trim() || 'en-US'
    setDraft((current) => (current ? { ...current, locale: nextLocale } : current))
    saveSettings({ locale: nextLocale })
  }

  return (
    <section className="grid gap-4 md:grid-cols-[2fr,1fr]">
      <article className="rounded-2xl border border-border/70 bg-surface/70 p-5 shadow-card">
        <h2 className="font-display text-xl font-semibold">Workspace settings</h2>
        <p className="mt-1 text-sm text-muted">
          Adjust visual density, theme, and notifications.
        </p>

        <div className="mt-5 space-y-4">
          <label className="flex flex-col gap-2 text-sm">
            Theme
            <select
              aria-label="Theme"
              value={draft.theme}
              onChange={(event) => {
                const nextTheme = event.target.value as SettingsModel['theme']
                setTheme(nextTheme)
                saveSettings({ theme: nextTheme })
              }}
              className="rounded-lg border border-border bg-panel px-3 py-2"
            >
              <option value="sunrise">Sunrise</option>
              <option value="midnight">Midnight</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm">
            Density
            <select
              aria-label="Density"
              value={draft.density}
              onChange={(event) => {
                const nextDensity = event.target.value as SettingsModel['density']
                setDensity(nextDensity)
                saveSettings({ density: nextDensity })
              }}
              className="rounded-lg border border-border bg-panel px-3 py-2"
            >
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm">
            Locale
            <input
              aria-label="Locale"
              type="text"
              value={draft.locale}
              onChange={(event) => {
                const nextLocale = event.target.value
                setDraft((current) =>
                  current ? { ...current, locale: nextLocale } : current,
                )
              }}
              onBlur={commitLocale}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  commitLocale()
                }
              }}
              className="rounded-lg border border-border bg-panel px-3 py-2"
            />
          </label>

          <fieldset className="space-y-2 rounded-xl border border-border/70 bg-panel/60 p-4">
            <legend className="px-1 text-sm font-semibold">Notifications</legend>

            <label className="flex items-center gap-2 text-sm">
              <input
                aria-label="Email alerts"
                type="checkbox"
                checked={draft.notifications.email}
                onChange={(event) =>
                  saveSettings({ notifications: { email: event.target.checked } })
                }
              />
              Email alerts
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                aria-label="Push alerts"
                type="checkbox"
                checked={draft.notifications.push}
                onChange={(event) =>
                  saveSettings({ notifications: { push: event.target.checked } })
                }
              />
              Push alerts
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                aria-label="Weekly digest"
                type="checkbox"
                checked={draft.notifications.weeklyDigest}
                onChange={(event) =>
                  saveSettings({ notifications: { weeklyDigest: event.target.checked } })
                }
              />
              Weekly digest
            </label>
          </fieldset>
        </div>
      </article>

      <aside className="rounded-2xl border border-border/70 bg-surface/70 p-5 shadow-card">
        <h3 className="font-display text-lg font-semibold">Sync status</h3>
        <p aria-live="polite" className="mt-2 text-sm text-muted">
          {updateMutation.isPending
            ? 'Saving changes...'
            : message || 'Changes are autosaved through optimistic updates.'}
        </p>
      </aside>
    </section>
  )
}
