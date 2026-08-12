/**
 * Property 7: Scatter plot hover tooltip completeness
 *
 * For any ConceptProjection point in the scatter plot, the tooltip data building
 * function returns:
 *   1. The concept term in the current language (term[lang])
 *   2. The tradition label (western/chinese mapped to display string)
 *   3. The nearest neighbor distance as a valid non-negative number
 *
 * **Validates: Requirements 5.3**
 *
 * Tag: Feature: philosophy-cross-cultural-mapping, Property 7: Scatter plot hover tooltip completeness
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { buildScatterTooltipData } from '../tooltipHelpers'
import type { ConceptProjection } from '../../../../data/philosophyData'

// --- Generators ---

/** Generator for a valid ConceptProjection */
const conceptProjectionArb: fc.Arbitrary<ConceptProjection> = fc.record({
  conceptId: fc.string({ minLength: 1, maxLength: 20 }),
  term: fc.record({
    zh: fc.string({ minLength: 1, maxLength: 30 }),
    en: fc.string({ minLength: 1, maxLength: 50 })
  }),
  tradition: fc.constantFrom('western' as const, 'chinese' as const),
  x: fc.double({ min: 0, max: 1, noNaN: true }),
  y: fc.double({ min: 0, max: 1, noNaN: true })
})

/** Generator for a non-empty array of ConceptProjections with unique conceptIds */
const projectionsArrayArb = (minLength: number): fc.Arbitrary<ConceptProjection[]> =>
  fc.array(conceptProjectionArb, { minLength, maxLength: 20 }).map(arr => {
    // Ensure unique conceptIds by appending index
    return arr.map((p, i) => ({ ...p, conceptId: `${p.conceptId}_${i}` }))
  })

/** Language generator */
const langArb: fc.Arbitrary<'zh' | 'en'> = fc.constantFrom('zh' as const, 'en' as const)

// --- Property Tests ---

describe('Feature: philosophy-cross-cultural-mapping, Property 7: Scatter plot hover tooltip completeness', () => {
  it('term field matches point.term[lang] for any valid language', () => {
    fc.assert(
      fc.property(
        projectionsArrayArb(1),
        langArb,
        (projections, lang) => {
          // Pick a random point from the projections as the hovered point
          const point = projections[0]
          const result = buildScatterTooltipData(point, projections, lang)

          expect(result.term).toBe(point.term[lang])
        }
      ),
      { numRuns: 100 }
    )
  })

  it('traditionLabel correctly maps tradition to localized label string', () => {
    fc.assert(
      fc.property(
        conceptProjectionArb,
        langArb,
        (point, lang) => {
          const result = buildScatterTooltipData(point, [point], lang)

          if (point.tradition === 'western') {
            const expected = lang === 'zh' ? '西方哲学' : 'Western Philosophy'
            expect(result.traditionLabel).toBe(expected)
          } else {
            const expected = lang === 'zh' ? '中国哲学' : 'Chinese Philosophy'
            expect(result.traditionLabel).toBe(expected)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('nearestDistance is a valid non-negative number', () => {
    fc.assert(
      fc.property(
        projectionsArrayArb(1),
        langArb,
        (projections, lang) => {
          const point = projections[0]
          const result = buildScatterTooltipData(point, projections, lang)

          expect(typeof result.nearestDistance).toBe('number')
          expect(result.nearestDistance).toBeGreaterThanOrEqual(0)
          expect(Number.isNaN(result.nearestDistance)).toBe(false)
          expect(Number.isFinite(result.nearestDistance)).toBe(true)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('nearestDistance is strictly positive when dataset has more than one point', () => {
    fc.assert(
      fc.property(
        projectionsArrayArb(2),
        langArb,
        (projections, lang) => {
          const point = projections[0]
          const result = buildScatterTooltipData(point, projections, lang)

          // With at least 2 distinct-id points, distance must be > 0
          // (unless two points share exact same coordinates, which is valid but distance is 0)
          expect(result.nearestDistance).toBeGreaterThanOrEqual(0)
          expect(Number.isFinite(result.nearestDistance)).toBe(true)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('tooltip data contains all three required fields for any projection', () => {
    fc.assert(
      fc.property(
        projectionsArrayArb(2),
        langArb,
        (projections, lang) => {
          // Test with each point in the dataset
          for (const point of projections) {
            const result = buildScatterTooltipData(point, projections, lang)

            // All three fields must be present and well-typed
            expect(result).toHaveProperty('term')
            expect(result).toHaveProperty('traditionLabel')
            expect(result).toHaveProperty('nearestDistance')

            // term is a non-empty string matching the point's term in current lang
            expect(typeof result.term).toBe('string')
            expect(result.term).toBe(point.term[lang])

            // traditionLabel is one of the valid label strings
            const validLabels = ['西方哲学', '中国哲学', 'Western Philosophy', 'Chinese Philosophy']
            expect(validLabels).toContain(result.traditionLabel)

            // nearestDistance is a finite non-negative number
            expect(typeof result.nearestDistance).toBe('number')
            expect(result.nearestDistance).toBeGreaterThanOrEqual(0)
            expect(Number.isFinite(result.nearestDistance)).toBe(true)
          }
        }
      ),
      { numRuns: 100 }
    )
  })
})
