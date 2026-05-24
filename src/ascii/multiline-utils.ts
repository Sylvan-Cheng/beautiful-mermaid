// ============================================================================
// ASCII renderer — multi-line text utilities
//
// Shared utilities for handling multi-line labels (containing \n from <br> tags)
// in ASCII/Unicode rendering. Provides consistent text splitting, sizing, and
// centered rendering across all diagram types.
//
// Also provides CJK/wide character-aware drawing via drawCJKText.
// ============================================================================

import type { Canvas } from './types.ts'
import { increaseSize } from './canvas.ts'
import { CJK_PAD, isWideChar, visualWidth } from './cjk.ts'

// Re-export CJK utilities for convenience
export { CJK_PAD, isWideChar, charVisualWidth, visualWidth } from './cjk.ts'

// ============================================================================
// CJK-aware text drawing
// ============================================================================

/**
 * Draw text onto the canvas with CJK-awareness.
 * Wide characters occupy 2 columns — the character itself goes in the first
 * column, and a sentinel (CJK_PAD) goes in the second.
 * Sentinels are stripped by canvasToString.
 */
export function drawCJKText(
  canvas: Canvas,
  x: number,
  y: number,
  text: string,
  forceOverwrite = false
): void {
  const totalWidth = visualWidth(text)
  increaseSize(canvas, x + totalWidth, y)
  let cx = x
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!
    const current = canvas[cx]?.[y]
    if (forceOverwrite || current === ' ' || current === undefined || current === CJK_PAD) {
      canvas[cx]![y] = ch
    }
    cx++
    if (isWideChar(ch)) {
      if (cx < canvas.length) {
        const nextCell = canvas[cx]?.[y]
        if (forceOverwrite || nextCell === ' ' || nextCell === undefined || nextCell === CJK_PAD) {
          canvas[cx]![y] = CJK_PAD
        }
      }
      cx++
    }
  }
}

// ============================================================================
// Line splitting and sizing
// ============================================================================

/**
 * Split a label into lines.
 * Labels are already normalized by parsers (br tags → \n).
 */
export function splitLines(label: string): string[] {
  return label.split('\n')
}

/**
 * Get the maximum line visual width for sizing calculations.
 * Uses visualWidth() to correctly account for CJK characters.
 */
export function maxLineWidth(label: string): number {
  const lines = splitLines(label)
  return Math.max(...lines.map(l => visualWidth(l)), 0)
}

/**
 * Get the number of lines for height calculations.
 * Used to determine row heights for multi-line labels.
 */
export function lineCount(label: string): number {
  return splitLines(label).length
}

/**
 * Draw multi-line text centered at (cx, cy).
 * Expands vertically from the center point.
 * Each line is horizontally centered independently using visual width.
 */
export function drawMultilineTextCentered(
  canvas: Canvas,
  label: string,
  cx: number,
  cy: number
): void {
  const lines = splitLines(label)
  const totalHeight = lines.length
  const startY = cy - Math.floor((totalHeight - 1) / 2)

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!
    const startX = cx - Math.floor(visualWidth(line) / 2)
    drawCJKText(canvas, startX, startY + i, line, true)
  }
}

/**
 * Draw multi-line text left-aligned starting at (x, y).
 * Each subsequent line is placed one row below.
 */
export function drawMultilineTextLeft(
  canvas: Canvas,
  label: string,
  x: number,
  y: number
): void {
  const lines = splitLines(label)
  for (let i = 0; i < lines.length; i++) {
    drawCJKText(canvas, x, y + i, lines[i]!, true)
  }
}
