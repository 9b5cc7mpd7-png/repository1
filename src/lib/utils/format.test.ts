import { describe, expect, it } from 'vitest'

import {
  formatCompactNumber,
  formatCurrency,
  formatDate,
  formatPercent,
} from '@/lib/utils/format'

describe('format helpers', () => {
  it('formats currency in standard notation for smaller values', () => {
    expect(formatCurrency(1200)).toBe('$1,200')
  })

  it('formats currency in compact notation for larger values', () => {
    expect(formatCurrency(125000)).toContain('K')
  })

  it('formats positive and negative percentages', () => {
    expect(formatPercent(2.34)).toBe('+2.3%')
    expect(formatPercent(-1)).toBe('-1.0%')
  })

  it('formats compact numbers and ISO dates', () => {
    expect(formatCompactNumber(15400)).toMatch(/15\.4K/)
    expect(formatDate('2026-02-06T12:00:00.000Z')).toContain('2026')
  })
})
