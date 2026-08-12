import type { ConceptProjection } from '../../../data/philosophyData'

export interface ScatterTooltipData {
  term: string
  traditionLabel: string
  nearestDistance: number
}

/**
 * Builds tooltip data for a scatter plot point.
 * Extracts the concept term in the given language, maps tradition to a display label,
 * and computes the Euclidean distance to the nearest neighbor in the projection space.
 *
 * @param point - The hovered ConceptProjection
 * @param allProjections - All projections in the scatter plot (used for nearest-neighbor calculation)
 * @param lang - Current display language ('zh' | 'en')
 * @returns ScatterTooltipData with term, traditionLabel, and nearestDistance
 */
export function buildScatterTooltipData(
  point: ConceptProjection,
  allProjections: ConceptProjection[],
  lang: 'zh' | 'en'
): ScatterTooltipData {
  // 1. Extract the term in the current language
  const term = point.term[lang]

  // 2. Map tradition to a human-readable label
  const traditionLabel = point.tradition === 'western'
    ? (lang === 'zh' ? '西方哲学' : 'Western Philosophy')
    : (lang === 'zh' ? '中国哲学' : 'Chinese Philosophy')

  // 3. Compute nearest neighbor distance (Euclidean)
  let minDist = Infinity

  for (const p of allProjections) {
    if (p.conceptId === point.conceptId) continue
    const dist = Math.sqrt(
      Math.pow(p.x - point.x, 2) + Math.pow(p.y - point.y, 2)
    )
    if (dist < minDist) {
      minDist = dist
    }
  }

  // If the point is alone (no neighbors), distance remains Infinity → treat as 0
  const nearestDistance = minDist === Infinity ? 0 : minDist

  return { term, traditionLabel, nearestDistance }
}
