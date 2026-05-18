'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import * as d3 from 'd3'
import { conceptNodes, conceptEdges, getConceptById } from '../../../data/philosophyData'
import type { ConceptNode, ConceptEdge } from '../../../data/philosophyData'

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
        .distance(120)
      )
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50))

    // 绘制边
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', d => markerColors[d.relation])
      .attr('stroke-width', d => d.relation === 'evolution' ? 2 : 1.5)
      .attr('stroke-dasharray', d => d.relation === 'contrast' ? '5,5' : 'none')
      .attr('marker-end', d => `url(#arrow-${d.relation})`)
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
      .attr('r', d => 15 + d.weight * 10)
      .attr('fill', d => d.tradition === 'western' ? '#1E40AF' : '#DC2626')
      .attr('stroke', '#FDFBF7')
      .attr('stroke-width', 2)
      .attr('opacity', 0.9)

    // 节点标签
    node.append('text')
      .attr('dy', d => 25 + d.weight * 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#2D3748')
      .text(d => d.term.zh)

    node.append('text')
      .attr('dy', d => 38 + d.weight * 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#718096')
      .text(d => d.term.en)

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

    return () => {
      simulation.stop()
    }
  }, [dimensions])

  const handleHighlightConcept = useCallback((term: string) => {
    // 在图中高亮共现词汇对应的节点
    const svg = d3.select(svgRef.current)
    svg.selectAll<SVGCircleElement, unknown>('circle')
      .attr('stroke', function() {
        const parent = this.parentNode as Element | null
        if (!parent) return '#FDFBF7'
        const text = d3.select(parent).select('text').text()
        return text.includes(term) ? '#E53E3E' : '#FDFBF7'
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
      <h2 className="text-xl font-serif text-ink mb-2">概念网络拓扑图</h2>
      <p className="text-sm text-ink-light mb-4">Concept Network Topology</p>

      {/* 图例 */}
      <div className="flex flex-wrap gap-4 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent-western" />
          <span>西方概念 Western</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent-chinese" />
          <span>中国概念 Chinese</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-ink" />
          <span>演变 Evolution</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-ink border-dashed border-t-2 border-ink" style={{ borderStyle: 'dashed' }} />
          <span>对照 Contrast</span>
        </div>
      </div>

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
          拖拽平移 · 滚轮缩放 · 点击查看详情
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
                {concept.term.zh}
              </h3>
              <p className="text-ink-light">{concept.term.en}</p>
            </div>
            <button
              onClick={onClose}
              className="text-ink-lighter hover:text-ink p-1"
              aria-label="关闭详情面板"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 传统标签 */}
          <span className={`
            inline-block px-2 py-1 rounded text-xs mb-4
            ${concept.tradition === 'western' ? 'bg-accent-western/10 text-accent-western' : 'bg-accent-chinese/10 text-accent-chinese'}
          `}>
            {concept.tradition === 'western' ? '西方哲学' : '中国哲学'}
          </span>

          {/* 概念释义 */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-ink mb-2">概念释义</h4>
            <p className="text-sm text-ink-light leading-relaxed">{concept.definition.zh}</p>
          </div>

          {/* 文本出处 */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-ink mb-2">文本出处</h4>
            <p className="text-sm text-ink-light">
              《{concept.source.work.zh}》
              {concept.source.chapter && <span className="text-ink-lighter"> · {concept.source.chapter}</span>}
            </p>
            <p className="text-xs text-ink-lighter">{concept.source.work.en}</p>
          </div>

          {/* 共现词汇 */}
          <div>
            <h4 className="text-sm font-medium text-ink mb-2">共现词汇 Co-occurrence</h4>
            <div className="flex flex-wrap gap-2">
              {concept.coOccurrence.map((term, i) => (
                <button
                  key={i}
                  onClick={() => onHighlight(term)}
                  className="px-2 py-1 bg-parchment text-ink-light text-xs rounded hover:bg-ink/10 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
