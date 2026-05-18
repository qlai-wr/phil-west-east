'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import * as d3 from 'd3'
import { 
  conceptProjections, 
  radarDimensions, 
  conceptNodes,
  getConceptsByTradition 
} from '../../../data/philosophyData'
import type { ConceptProjection, RadarDimension } from '../../../data/philosophyData'

export default function MappingView() {
  const [selectedWestern, setSelectedWestern] = useState<string>('')
  const [selectedChinese, setSelectedChinese] = useState<string>('')

  const westernConcepts = useMemo(() => getConceptsByTradition('western'), [])
  const chineseConcepts = useMemo(() => getConceptsByTradition('chinese'), [])

  return (
    <div className="space-y-8">
      {/* 散点图 */}
      <ScatterPlot />

      {/* 雷达图对比 */}
      <div className="chart-container p-6">
        <h2 className="text-xl font-serif text-ink mb-2">双概念雷达图对比</h2>
        <p className="text-sm text-ink-light mb-4">Dual-Concept Radar Chart Comparison</p>

        {/* 选择器 */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="western-select" className="block text-sm text-ink-light mb-1">
              西方概念 Western Concept
            </label>
            <select
              id="western-select"
              value={selectedWestern}
              onChange={(e) => setSelectedWestern(e.target.value)}
              className="w-full px-3 py-2 bg-ivory border border-ink/20 rounded text-ink focus:outline-none focus:ring-2 focus:ring-accent-western"
            >
              <option value="">请选择...</option>
              {westernConcepts.map(c => (
                <option key={c.id} value={c.id}>{c.term.zh} ({c.term.en})</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="chinese-select" className="block text-sm text-ink-light mb-1">
              中国概念 Chinese Concept
            </label>
            <select
              id="chinese-select"
              value={selectedChinese}
              onChange={(e) => setSelectedChinese(e.target.value)}
              className="w-full px-3 py-2 bg-ivory border border-ink/20 rounded text-ink focus:outline-none focus:ring-2 focus:ring-accent-chinese"
            >
              <option value="">请选择...</option>
              {chineseConcepts.map(c => (
                <option key={c.id} value={c.id}>{c.term.zh} ({c.term.en})</option>
              ))}
            </select>
          </div>
        </div>

        {/* 雷达图 */}
        <RadarChart westernId={selectedWestern} chineseId={selectedChinese} />
      </div>
    </div>
  )
}

function ScatterPlot() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 })
  const [hoveredPoint, setHoveredPoint] = useState<ConceptProjection | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect()
        setDimensions({
          width: Math.max(400, width - 48),
          height: Math.max(400, Math.min(500, window.innerHeight * 0.5))
        })
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    if (!svgRef.current) return

    // 模拟数据加载
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 500)

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const { width, height } = dimensions
    const margin = { top: 40, right: 40, bottom: 60, left: 60 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // 比例尺
    const xScale = d3.scaleLinear()
      .domain([0, 1])
      .range([0, innerWidth])

    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([innerHeight, 0])

    // 主容器
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // 网格线
    g.append('g')
      .attr('class', 'grid')
      .selectAll('line.horizontal')
      .data(d3.range(0, 1.1, 0.2))
      .join('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', '#E2E8F0')
      .attr('stroke-dasharray', '2,2')

    g.append('g')
      .attr('class', 'grid')
      .selectAll('line.vertical')
      .data(d3.range(0, 1.1, 0.2))
      .join('line')
      .attr('x1', d => xScale(d))
      .attr('x2', d => xScale(d))
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#E2E8F0')
      .attr('stroke-dasharray', '2,2')

    // X轴
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(5))
      .selectAll('text')
      .attr('fill', '#374151')
      .attr('font-weight', '500')

    // Y轴
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .attr('fill', '#374151')
      .attr('font-weight', '500')

    // 轴标签
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1a202c')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .text('抽象 ← → 具体 (Abstract - Concrete)')

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1a202c')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .text('实践 ← → 形而上 (Practical - Metaphysical)')

    // 绘制点
    const points = g.selectAll('circle')
      .data(conceptProjections)
      .join('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 12)
      .attr('fill', d => d.tradition === 'western' ? '#1E40AF' : '#DC2626')
      .attr('stroke', '#FDFBF7')
      .attr('stroke-width', 2)
      .attr('cursor', 'pointer')
      .attr('opacity', 0.85)

    // 标签 - 中文
    g.selectAll('text.label-zh')
      .data(conceptProjections)
      .join('text')
      .attr('class', 'label-zh')
      .attr('x', d => xScale(d.x))
      .attr('y', d => yScale(d.y) - 28)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('fill', '#1a202c')
      .text(d => d.term.zh)

    // 标签 - 英文
    g.selectAll('text.label-en')
      .data(conceptProjections)
      .join('text')
      .attr('class', 'label-en')
      .attr('x', d => xScale(d.x))
      .attr('y', d => yScale(d.y) - 16)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('font-weight', '500')
      .attr('fill', '#374151')
      .text(d => d.term.en)

    // 交互
    points
      .on('mouseenter', (event, d) => {
        setHoveredPoint(d)
        d3.select(event.currentTarget)
          .transition()
          .duration(100)
          .attr('r', 16)
          .attr('opacity', 1)
      })
      .on('mouseleave', (event) => {
        setHoveredPoint(null)
        d3.select(event.currentTarget)
          .transition()
          .duration(100)
          .attr('r', 12)
          .attr('opacity', 0.85)
      })

    return () => clearTimeout(timer)
  }, [dimensions])

  // 计算最近邻距离
  const getNearestNeighbor = (point: ConceptProjection): { nearest: ConceptProjection | null; distance: string } => {
    let minDist = Infinity
    let nearest: ConceptProjection | null = null
    
    conceptProjections.forEach(p => {
      if (p.conceptId === point.conceptId) return
      const dist = Math.sqrt(Math.pow(p.x - point.x, 2) + Math.pow(p.y - point.y, 2))
      if (dist < minDist) {
        minDist = dist
        nearest = p
      }
    })
    
    return { nearest, distance: minDist.toFixed(3) }
  }

  return (
    <div ref={containerRef} className="chart-container p-6">
      <h2 className="text-xl font-serif text-ink mb-2">跨文化语义散点图</h2>
      <p className="text-sm text-ink-light mb-4">Cross-Cultural Semantic Scatter Plot</p>

      {/* 图例 */}
      <div className="flex gap-6 mb-4 text-sm font-semibold">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent-western" />
          <span className="text-gray-900">西方哲学词汇 Western</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent-chinese" />
          <span className="text-gray-900">中国哲学词汇 Chinese</span>
        </div>
      </div>

      {/* 散点图 */}
      <div className="relative bg-parchment rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-parchment/80 z-10">
            <div className="loading-spinner" />
          </div>
        )}
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          role="img"
          aria-label="中西方哲学词汇语义散点图"
        />

        {/* 悬停提示 */}
        {hoveredPoint && (
          <div className="absolute top-4 right-4 bg-ivory p-3 rounded shadow-lg text-sm max-w-[200px]">
            <p className="font-medium text-ink">{hoveredPoint.term.zh}</p>
            <p className="text-ink-light text-xs">{hoveredPoint.term.en}</p>
            <p className="text-ink-lighter text-xs mt-1">
              {hoveredPoint.tradition === 'western' ? '西方' : '中国'}哲学
            </p>
            <div className="mt-2 pt-2 border-t border-ink/10">
              <p className="text-xs text-ink-light">
                最近邻: {getNearestNeighbor(hoveredPoint).nearest?.term.zh}
              </p>
              <p className="text-xs text-ink-lighter">
                距离: {getNearestNeighbor(hoveredPoint).distance}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function RadarChart({ westernId, chineseId }: { westernId: string; chineseId: string }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 })

  const westernData = radarDimensions.find(r => r.conceptId === westernId)
  const chineseData = radarDimensions.find(r => r.conceptId === chineseId)

  const westernConcept = conceptNodes.find(c => c.id === westernId)
  const chineseConcept = conceptNodes.find(c => c.id === chineseId)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const { width, height } = dimensions
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2 - 60

    const dimensions_labels = [
      { key: 'ontology', zh: '本体论', en: 'Ontology' },
      { key: 'epistemology', zh: '认识论', en: 'Epistemology' },
      { key: 'ethics', zh: '伦理学', en: 'Ethics' },
      { key: 'aesthetics', zh: '美学', en: 'Aesthetics' },
      { key: 'logic', zh: '逻辑学', en: 'Logic' },
    ]

    const angleSlice = (Math.PI * 2) / dimensions_labels.length

    // 主容器
    const g = svg.append('g')
      .attr('transform', `translate(${centerX},${centerY})`)

    // 绘制网格
    const levels = 5
    for (let level = 1; level <= levels; level++) {
      const r = (radius / levels) * level
      g.append('circle')
        .attr('r', r)
        .attr('fill', 'none')
        .attr('stroke', '#E2E8F0')
        .attr('stroke-dasharray', '2,2')

      // 刻度值
      g.append('text')
        .attr('x', 5)
        .attr('y', -r)
        .attr('font-size', '10px')
        .attr('fill', '#A0AEC0')
        .text(`${level * 20}`)
    }

    // 绘制轴线和标签
    dimensions_labels.forEach((dim, i) => {
      const angle = angleSlice * i - Math.PI / 2
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius

      g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', x)
        .attr('y2', y)
        .attr('stroke', '#CBD5E0')

      const labelX = Math.cos(angle) * (radius + 30)
      const labelY = Math.sin(angle) * (radius + 30)

      g.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '12px')
        .attr('font-weight', '600')
        .attr('fill', '#1a202c')
        .text(dim.zh)
    })

    // 绘制数据区域
    const drawArea = (data: RadarDimension | undefined, color: string, label: string) => {
      if (!data) return

      const values = [
        data.ontology,
        data.epistemology,
        data.ethics,
        data.aesthetics,
        data.logic,
      ]

      const points = values.map((v, i) => {
        const angle = angleSlice * i - Math.PI / 2
        const r = (v / 100) * radius
        return [Math.cos(angle) * r, Math.sin(angle) * r]
      })

      // 填充区域
      g.append('polygon')
        .attr('points', points.map(p => p.join(',')).join(' '))
        .attr('fill', color)
        .attr('fill-opacity', 0.3)
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0.8)

      // 数据点
      points.forEach(([x, y]) => {
        g.append('circle')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', 4)
          .attr('fill', color)
      })
    }

    drawArea(westernData, '#1E40AF', westernConcept?.term.zh || '')
    drawArea(chineseData, '#DC2626', chineseConcept?.term.zh || '')

  }, [dimensions, westernData, chineseData, westernConcept, chineseConcept])

  if (!westernId && !chineseId) {
    return (
      <div className="flex items-center justify-center h-64 bg-parchment rounded-lg">
        <p className="text-ink-lighter">请选择两个概念进行对比</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        role="img"
        aria-label={`雷达图对比: ${westernConcept?.term.zh || '未选择'} vs ${chineseConcept?.term.zh || '未选择'}`}
      />

      {/* 图例 */}
      <div className="flex gap-6 mt-4 text-sm">
        {westernConcept && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-accent-western/30 border-2 border-accent-western" />
            <span className="text-ink-light">{westernConcept.term.zh}</span>
          </div>
        )}
        {chineseConcept && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-accent-chinese/30 border-2 border-accent-chinese" />
            <span className="text-ink-light">{chineseConcept.term.zh}</span>
          </div>
        )}
      </div>
    </div>
  )
}
