// ============================================================================
// CJK / wide character display width utilities
//
// CJK (Chinese/Japanese/Korean) and other fullwidth characters occupy
// 2 terminal columns, but JavaScript's .length counts them as 1.
// This module provides correct visual width calculation and canvas
// rendering support.
// ============================================================================

/** Sentinel character placed in the second column after a wide char. */
export const CJK_PAD = '\x00'

/** Unicode ranges for characters that occupy 2 terminal columns. */
const WIDE_RANGES: Array<[number, number]> = [
  [0x1100, 0x115F],
  [0x2329, 0x232A],
  [0x2E80, 0x303E],
  [0x3040, 0x33BF],
  [0x3400, 0x4DBF],
  [0x4E00, 0xA4CF],
  [0xA960, 0xA97F],
  [0xAC00, 0xD7AF],
  [0xD7B0, 0xD7FF],
  [0xF900, 0xFAFF],
  [0xFE10, 0xFE19],
  [0xFE30, 0xFE6F],
  [0xFF01, 0xFF60],
  [0xFFE0, 0xFFE6],
  [0x1B000, 0x1B2FF],
  [0x1F200, 0x1F2FF],
  [0x20000, 0x2FFFD],
  [0x30000, 0x3FFFD],
]

export function isWideChar(ch: string): boolean {
  const cp = ch.codePointAt(0)
  if (cp === undefined) return false
  for (const [lo, hi] of WIDE_RANGES) {
    if (cp >= lo && cp <= hi) return true
  }
  return false
}

export function charVisualWidth(ch: string): number {
  return isWideChar(ch) ? 2 : 1
}

export function visualWidth(str: string): number {
  let width = 0
  for (let i = 0; i < str.length; i++) {
    width += charVisualWidth(str[i]!)
  }
  return width
}
