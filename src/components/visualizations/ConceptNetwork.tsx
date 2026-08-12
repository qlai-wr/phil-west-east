'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import * as d3 from 'd3'
import { conceptNodes, conceptEdges, getConceptById } from '../../../data/philosophyData'
import type { ConceptNode, ConceptEdge } from '../../../data/philosophyData'
import { useLanguage } from '../LanguageContext'

interface NetworkNode extends d3.SimulationNodeDatum {
  id: string
  term: { zh: string; en: string }
  tradition: 'western' | 'chinese'
  definition: { zh: string; en: string }
  source: { work: { zh: string; en: string }; chapter?: string }
  coOccurrence: string[]
  weight: number
}

interface NetworkLink extends d3.SimulationLinkDatum<NetworkNode> {
  relation: 'evolution' | 'influence' | 'contrast'
}

export default function ConceptNetwork() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedConcept, setSelectedConcept] = useState<ConceptNode | null>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 })
  const { lang, t } = useLanguage()

  // 响应式尺寸
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect()
        setDimensions({
          width: Math.max(400, width - 48),
          height: Math.max(400, Math.min(600, window.innerHeight * 0.6))
        })
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // D3 力导向图
  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const { width, height } = dimensions

    // 准备数据
    const nodes: NetworkNode[] = conceptNodes.map(n => ({ ...n }))
    const links: NetworkLink[] = conceptEdges.map(e => ({
      source: e.source,
      target: e.target,
      relation: e.relation
    }))

    // 跨文化对照说明（hover时展示）
    // 创建缩放行为
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoom)

    // 主容器
    const g = svg.append('g')

    // 箭头标记
    const defs = svg.append('defs')
    
    const markerColors = {
      evolution: '#4A5568',
      influence: '#8B4513',
      contrast: '#2F4F4F'
    }

    Object.entries(markerColors).forEach(([type, color]) => {
      defs.append('marker')
        .attr('id', `arrow-${type}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 25)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', color)
    })

    // 力模拟
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink<NetworkNode, NetworkLink>(links)
        .id(d => d.id)
        .distance(130)
      )
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(45))
      .force('x', d3.forceX(width / 2).strength(0.02))
      .force('y', d3.forceY(height / 2).strength(0.02))

    // 绘制边
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', d => markerColors[d.relation])
      .attr('stroke-width', d => d.relation === 'evolution' ? 2 : 1.5)
      .attr('stroke-dasharray', d => d.relation === 'contrast' ? '5,5' : 'none')
      .attr('marker-end', d => d.relation === 'contrast' ? '' : `url(#arrow-${d.relation})`)

    // 给对照边加粗的悬停区域（提升可交互性）
    link.filter(d => d.relation === 'contrast')
      .attr('stroke-width', 2.5)
      .attr('opacity', 0.7)

    // 绘制节点
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll<SVGGElement, NetworkNode>('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'pointer')

    // 添加拖拽行为
    node.call(d3.drag<SVGGElement, NetworkNode>()
      .on('start', (event: any, d: any) => {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      })
      .on('drag', (event: any, d: any) => {
        d.fx = event.x
        d.fy = event.y
      })
      .on('end', (event: any, d: any) => {
        if (!event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      })
    )

    // 节点圆形
    node.append('circle')
      .attr('r', d => 12 + d.weight * 8)
      .attr('fill', d => d.tradition === 'western' ? '#2B4C7E' : '#C53030')
      .attr('stroke', '#F0F2F5')
      .attr('stroke-width', 2)
      .attr('opacity', 0.9)

    // 节点标签
    node.append('text')
      .attr('dy', d => 22 + d.weight * 8)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('fill', '#1A202C')
      .text(d => lang === 'zh' ? d.term.zh : d.term.en)

    // 点击事件
    node.on('click', (event, d) => {
      event.stopPropagation()
      const concept = getConceptById(d.id)
      if (concept) setSelectedConcept(concept)
    })

    // 点击空白关闭
    svg.on('click', () => setSelectedConcept(null))

    // 更新位置
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as NetworkNode).x!)
        .attr('y1', d => (d.source as NetworkNode).y!)
        .attr('x2', d => (d.target as NetworkNode).x!)
        .attr('y2', d => (d.target as NetworkNode).y!)

      node.attr('transform', d => `translate(${d.x},${d.y})`)
    })

    // 模拟结束后自动缩放适配视口
    simulation.on('end', () => {
      const padding = 40
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
      nodes.forEach(n => {
        if (n.x! < minX) minX = n.x!
        if (n.y! < minY) minY = n.y!
        if (n.x! > maxX) maxX = n.x!
        if (n.y! > maxY) maxY = n.y!
      })
      const graphWidth = maxX - minX + padding * 2
      const graphHeight = maxY - minY + padding * 2
      const scale = Math.min(width / graphWidth, height / graphHeight, 1.2)
      const translateX = (width - graphWidth * scale) / 2 - (minX - padding) * scale
      const translateY = (height - graphHeight * scale) / 2 - (minY - padding) * scale

      svg.transition().duration(500).call(
        zoom.transform,
        d3.zoomIdentity.translate(translateX, translateY).scale(scale)
      )
    })

    return () => {
      simulation.stop()
    }
  }, [dimensions, lang])

  const handleHighlightConcept = useCallback((term: string) => {
    // 在图中高亮共现词汇对应的节点
    const svg = d3.select(svgRef.current)
    svg.selectAll<SVGCircleElement, unknown>('circle')
      .attr('stroke', function() {
        const parent = this.parentNode as Element | null
        if (!parent) return '#F0F2F5'
        const text = d3.select(parent).select('text').text()
        return text.includes(term) ? '#E53E3E' : '#F0F2F5'
      })
      .attr('stroke-width', function() {
        const parent = this.parentNode as Element | null
        if (!parent) return 2
        const text = d3.select(parent).select('text').text()
        return text.includes(term) ? 4 : 2
      })
  }, [])

  return (
    <div ref={containerRef} className="chart-container p-6">
      <h2 className="text-xl font-serif text-ink mb-2">{t('概念网络拓扑图', 'Concept Network Topology')}</h2>

      {/* 图例 */}
      <div className="flex flex-wrap gap-4 mb-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-western" />
          <span>{t('西方概念', 'Western Concepts')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-chinese" />
          <span>{t('中国概念', 'Chinese Concepts')}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="28" height="10"><defs><marker id="legend-arrow" viewBox="0 -3 6 6" refX="6" refY="0" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,-3L6,0L0,3" fill="#1A202C"/></marker></defs><line x1="0" y1="5" x2="22" y2="5" stroke="#1A202C" strokeWidth="2" markerEnd="url(#legend-arrow)" /></svg>
          <span>{t('演变', 'Evolution')}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="28" height="10"><defs><marker id="legend-arrow-dash" viewBox="0 -3 6 6" refX="6" refY="0" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,-3L6,0L0,3" fill="#1A202C"/></marker></defs><line x1="0" y1="5" x2="24" y2="5" stroke="#1A202C" strokeWidth="1.5" strokeDasharray="4,3" /></svg>
          <span>{t('对照', 'Contrast')}</span>
        </div>
      </div>

      {/* 说明文字 */}
      <p className="text-xs text-ink-lighter mb-4">
        {t(
          '「演变」表示概念间的主题发展关系（非线性进步）；「对照」表示跨文化的探索性对等假说——点击节点可查看对照说明。',
          '"Evolution" indicates thematic development (not linear progress); "Contrast" indicates exploratory cross-cultural parallel hypotheses—click nodes to see contrast explanations.'
        )}
      </p>

      {/* SVG 画布 */}
      <div className="relative bg-parchment rounded-lg overflow-hidden">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          role="img"
          aria-label="哲学概念网络拓扑图，展示西方和中国哲学概念的演变关系"
        />
        
        {/* 操作提示 */}
        <div className="absolute bottom-2 right-2 text-xs text-ink-lighter">
          {t('拖拽平移 · 滚轮缩放 · 点击查看详情', 'Drag to pan · Scroll to zoom · Click for details')}
        </div>
      </div>

      {/* 概念详情面板 */}
      {selectedConcept && (
        <ConceptDetailPanel
          concept={selectedConcept}
          onClose={() => setSelectedConcept(null)}
          onHighlight={handleHighlightConcept}
        />
      )}
    </div>
  )
}

function ConceptDetailPanel({
  concept,
  onClose,
  onHighlight
}: {
  concept: ConceptNode
  onClose: () => void
  onHighlight: (term: string) => void
}) {
  const { lang, t } = useLanguage()

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="concept-name"
    >
      <div
        className="bg-ivory rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          {/* 头部 */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 id="concept-name" className="text-xl font-serif text-ink">
                {lang === 'zh' ? concept.term.zh : concept.term.en}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-ink-lighter hover:text-ink p-1"
              aria-label={t('关闭详情面板', 'Close detail panel')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 传统标签 */}
          <span className={`
            inline-block px-2 py-1 rounded text-xs mb-4
            ${concept.tradition === 'western' ? 'bg-western/10 text-western' : 'bg-chinese/10 text-chinese'}
          `}>
            {concept.tradition === 'western' ? t('西方哲学', 'Western Philosophy') : t('中国哲学', 'Chinese Philosophy')}
          </span>

          {/* 概念释义 */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-ink mb-2">{t('概念释义', 'Definition')}</h4>
            <p className="text-sm text-ink-light leading-relaxed">{lang === 'zh' ? concept.definition.zh : concept.definition.en}</p>
          </div>

          {/* 文本出处 */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-ink mb-2">{t('文本出处', 'Source')}</h4>
            <p className="text-sm text-ink-light">
              {lang === 'zh' ? (
                <>《{concept.source.work.zh}》{concept.source.chapter && <span className="text-ink-lighter"> · {concept.source.chapter.zh}</span>}</>
              ) : (
                <>{concept.source.work.en}{concept.source.chapter && <span className="text-ink-lighter"> · {concept.source.chapter.en}</span>}</>
              )}
            </p>
          </div>

          {/* 共现词汇 */}
          <div>
            <h4 className="text-sm font-medium text-ink mb-2">{t('共现词汇', 'Co-occurrence')}</h4>
            <div className="flex flex-wrap gap-2">
              {concept.coOccurrence.map((term, i) => (
                <button
                  key={i}
                  onClick={() => onHighlight(lang === 'zh' ? term.zh : term.en)}
                  className="px-2 py-1 bg-parchment text-ink-light text-xs rounded hover:bg-ink/10 transition-colors"
                >
                  {lang === 'zh' ? term.zh : term.en}
                </button>
              ))}
            </div>
          </div>

          {/* 跨文化对照 */}
          <ContrastSection conceptId={concept.id} />
        </div>
      </div>
    </div>
  )
}

// 跨文化对照说明数据
const contrastData: Record<string, { partner: { zh: string; en: string }; explanation: { zh: string; en: string } }[]> = {
  being: [{
    partner: { zh: '道', en: 'Tao' },
    explanation: {
      zh: '功能对等：都是各自传统的终极追问起点。\n差异：Being导向系词逻辑（"X是什么"），道导向悖论式自否（"道可道非常道"）。',
      en: 'Parallel: Both serve as the ultimate starting point of inquiry.\nDifference: Being leads to propositional logic, Tao leads to paradoxical self-negation.'
    }
  }],
  dao: [{
    partner: { zh: '存在', en: 'Being' },
    explanation: {
      zh: '功能对等：都是各自传统的终极追问起点。\n差异：Being导向系词逻辑，道导向悖论式自否（"道可道非常道"）。',
      en: 'Parallel: Both are the ultimate starting point of inquiry.\nDifference: Being leads to logic, Tao leads to paradoxical self-negation.'
    }
  }, {
    partner: { zh: '物自体', en: 'Thing-in-itself' },
    explanation: {
      zh: '功能对等：都指向超越现象层的终极实在。\n限定：物自体"存在但不可知"，道"不可道但可体"。',
      en: 'Parallel: Both point to ultimate reality beyond phenomena.\nLimitation: Thing-in-itself "exists but is unknowable"; Tao "cannot be spoken but can be embodied".'
    }
  }],
  form: [{
    partner: { zh: '理', en: 'Li/Principle' },
    explanation: {
      zh: '功能对等：都是超越个体经验的普遍原则。\n差异：Form独立于事物存在（超越性），理内在于事物之中（理在气中）。',
      en: 'Parallel: Both are universal principles beyond individual experience.\nDifference: Form exists independently (transcendence), Li is inherent within things.'
    }
  }],
  li: [{
    partner: { zh: '理念/形式', en: 'Form/Idea' },
    explanation: {
      zh: '功能对等：都是超越个体经验的普遍原则。\n差异：Form独立于事物存在（超越性），理内在于事物之中（理在气中）。',
      en: 'Parallel: Both are universal principles.\nDifference: Form is transcendent, Li is immanent ("Li is within Qi").'
    }
  }],
  substance: [{
    partner: { zh: '气', en: 'Qi' },
    explanation: {
      zh: '探索性对照：都涉及"万物由什么构成"。\n争议：Substance是变化中的持存者，气是聚散变化本身。这组对照的困难恰恰揭示了中西方对"基底"的不同想象。',
      en: 'Exploratory: Both address "what things are made of".\nDebatable: Substance persists through change; Qi IS the process of change. This difficulty reveals different intuitions about "ground".'
    }
  }],
  qi: [{
    partner: { zh: '实体', en: 'Substance' },
    explanation: {
      zh: '探索性对照：都涉及"万物由什么构成"。\n争议：Substance要求持存性，气拥抱流变性。',
      en: 'Exploratory: Both concern what constitutes things.\nDebatable: Substance requires permanence; Qi embraces flux.'
    }
  }],
  cogito: [{
    partner: { zh: '心', en: 'Mind/Xin' },
    explanation: {
      zh: '功能对等：都是认知主体的确立。\n差异：我思纯粹认知性，心兼具认知与道德（心即理）。',
      en: 'Parallel: Both establish the knowing subject.\nDifference: Cogito is purely cognitive; Xin integrates cognition and morality.'
    }
  }],
  xin: [{
    partner: { zh: '我思', en: 'Cogito' },
    explanation: {
      zh: '功能对等：都是主体性的确立。\n差异：我思纯粹认知性，心兼具认知与道德。',
      en: 'Parallel: Both establish subjectivity.\nDifference: Cogito is cognitive only; Xin unifies cognition and morality.'
    }
  }, {
    partner: { zh: '主体', en: 'Subject' },
    explanation: {
      zh: '功能对等：主体性问题的不同回答。',
      en: 'Parallel: Different answers to the question of subjectivity.'
    }
  }],
  subject: [{
    partner: { zh: '心', en: 'Mind/Xin' },
    explanation: {
      zh: '功能对等：主体性问题的不同回答。西方主体从认知建立，中国"心"从道德-认知统一建立。',
      en: 'Parallel: Different answers to subjectivity. Western subject is built from cognition; Chinese "Xin" from moral-cognitive unity.'
    }
  }],
  noumenon: [{
    partner: { zh: '无', en: 'Wu/Nothingness' },
    explanation: {
      zh: '功能对等：都标示认识的边界——不可知者与不可名者。\n限定：仅在"认识论界限概念"的功能角色上平行。',
      en: 'Parallel: Both mark the boundary of knowledge.\nLimitation: Parallel only as epistemological limit-concepts.'
    }
  }, {
    partner: { zh: '道', en: 'Tao' },
    explanation: {
      zh: '功能对等：都指向超越现象层的终极实在。\n限定：物自体"存在但不可知"，道"不可道但可体"。',
      en: 'Parallel: Both point to reality beyond phenomena.\nLimitation: Thing-in-itself is unknowable; Tao can be embodied.'
    }
  }],
  wu: [{
    partner: { zh: '物自体', en: 'Thing-in-itself' },
    explanation: {
      zh: '功能对等：都标示认识的边界。\n限定：仅在"认识论界限概念"的角色上平行。',
      en: 'Parallel: Both mark cognitive boundaries.\nLimitation: Parallel only as limit-concepts.'
    }
  }],
  will: [{
    partner: { zh: '良知', en: 'Liangzhi' },
    explanation: {
      zh: '⚠️ 争议性对照：表面上都是"行动的内在驱力"，但权力意志超善恶、指向扩张，良知至善、指向克己。这组对照因过度抽象而值得质疑。',
      en: '⚠️ Controversial: Both are "inner driving forces" superficially, but Will to Power is beyond good/evil while Liangzhi is supremely moral. This contrast is debatable.'
    }
  }],
  liangzhi: [{
    partner: { zh: '权力意志', en: 'Will to Power' },
    explanation: {
      zh: '⚠️ 争议性对照：表面上都是"行动的内在驱力"，但良知至善、指向克己，权力意志超善恶、指向扩张。',
      en: '⚠️ Controversial: Both are "driving forces" but Liangzhi is moral self-restraint while Will to Power is amoral expansion.'
    }
  }],
}

function ContrastSection({ conceptId }: { conceptId: string }) {
  const { lang, t } = useLanguage()
  const contrasts = contrastData[conceptId]

  if (!contrasts || contrasts.length === 0) return null

  return (
    <div className="mt-4 pt-4 border-t border-ink-faint">
      <h4 className="text-sm font-medium text-ink mb-3">{t('跨文化对照', 'Cross-Cultural Contrasts')}</h4>
      <div className="space-y-3">
        {contrasts.map((c, i) => (
          <div key={i} className="bg-parchment rounded-lg p-3">
            <p className="text-xs font-medium text-ink mb-1">
              ↔ {lang === 'zh' ? c.partner.zh : c.partner.en}
            </p>
            <p className="text-xs text-ink-light whitespace-pre-line leading-relaxed">
              {lang === 'zh' ? c.explanation.zh : c.explanation.en}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
