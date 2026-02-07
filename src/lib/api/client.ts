import type { ZodType } from 'zod'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

type QueryValue = string | number | boolean | null | undefined

interface RequestConfig<T> {
  path: string
  schema: ZodType<T>
  method?: 'GET' | 'POST' | 'PATCH'
  body?: unknown
  query?: Record<string, QueryValue>
}

const buildUrl = (path: string, query?: Record<string, QueryValue>): string => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin
  const url = new URL(path, baseUrl)

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value))
      }
    }
  }

  return url.toString()
}

const request = async <T>({
  path,
  schema,
  method = 'GET',
  body,
  query,
}: RequestConfig<T>): Promise<T> => {
  const init: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  }

  if (body !== undefined) {
    init.body = JSON.stringify(body)
  }

  const response = await fetch(buildUrl(path, query), init)

  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status)
  }

  const payload: unknown = await response.json()
  const parsed = schema.safeParse(payload)

  if (!parsed.success) {
    throw new ApiError('Invalid response schema', 500)
  }

  return parsed.data
}

export const apiClient = {
  get: <T>(
    path: string,
    schema: ZodType<T>,
    query?: Record<string, QueryValue>,
  ): Promise<T> =>
    request({
      path,
      schema,
      method: 'GET',
      ...(query ? { query } : {}),
    }),
  patch: <T>(path: string, schema: ZodType<T>, body: unknown): Promise<T> =>
    request({ path, schema, method: 'PATCH', body }),
}
