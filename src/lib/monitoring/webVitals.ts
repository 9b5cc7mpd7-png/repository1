import type { Metric } from 'web-vitals'

const getVitalsEndpoint = (): string => {
  return import.meta.env.VITE_WEB_VITALS_ENDPOINT ?? '/api/web-vitals'
}

const sendMetric = (endpoint: string, payload: Record<string, unknown>): void => {
  const body = JSON.stringify(payload)

  if (typeof navigator.sendBeacon === 'function') {
    const blob = new Blob([body], {
      type: 'application/json',
    })
    navigator.sendBeacon(endpoint, blob)
    return
  }

  void fetch(endpoint, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
    },
    keepalive: true,
  }).catch(() => undefined)
}

const reportMetric = (metric: Metric): void => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return
  }

  const endpoint = getVitalsEndpoint()
  sendMetric(endpoint, {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    path: window.location.pathname,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  })
}

export const reportWebVitals = async (): Promise<void> => {
  if (typeof window === 'undefined') {
    return
  }

  const { onCLS, onINP, onLCP, onFCP, onTTFB } = await import('web-vitals')

  onCLS(reportMetric)
  onINP(reportMetric)
  onLCP(reportMetric)
  onFCP(reportMetric)
  onTTFB(reportMetric)
}
