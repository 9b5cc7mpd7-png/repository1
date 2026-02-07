import { z } from 'zod'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ApiError, apiClient } from '@/lib/api/client'

const jsonResponse = (body: unknown, status = 200): Response => {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('apiClient', () => {
  it('builds request url with query params and validates response payload', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(jsonResponse({ data: { ok: true } }))

    const schema = z.object({
      data: z.object({
        ok: z.boolean(),
      }),
    })

    const result = await apiClient.get('/api/test', schema, {
      q: 'ops',
      page: 2,
      skip: '',
    })

    expect(result.data.ok).toBe(true)
    expect(fetchSpy).toHaveBeenCalledTimes(1)

    const [requestUrl] = fetchSpy.mock.calls[0] as [string | URL]
    const urlString = typeof requestUrl === 'string' ? requestUrl : requestUrl.toString()

    expect(urlString).toContain('/api/test')
    expect(urlString).toContain('q=ops')
    expect(urlString).toContain('page=2')
    expect(urlString).not.toContain('skip=')
  })

  it('throws ApiError for non-success responses', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({ error: 'boom' }, 500))

    const request = apiClient.get('/api/fail', z.object({ data: z.string() }))

    await expect(request).rejects.toBeInstanceOf(ApiError)
    await expect(request).rejects.toMatchObject({
      name: 'ApiError',
      status: 500,
    })
  })

  it('throws ApiError when payload does not match the schema', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({ nope: true }))

    const request = apiClient.get('/api/schema', z.object({ data: z.object({ ok: z.boolean() }) }))

    await expect(request).rejects.toBeInstanceOf(ApiError)
    await expect(request).rejects.toMatchObject({
      name: 'ApiError',
      status: 500,
    })
  })
})
