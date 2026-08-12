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
import { useLanguage } from '../LanguageContext'

export default function MappingView() {
  const [selectedWestern, setSelectedWestern] = useState<string>('')
  const [selectedChinese, setSelectedChinese] = useState<string>('')
  const { lang, t } = useLanguage()

  const westernConcepts = useMemo(() => getConceptsByTradition('western'), [])
  const chineseConcepts = useMemo(() => getConceptsByTradition('chinese'), [])

  return (
    <div className="space-y-8">
      {/* 散点图 */}
      <ScatterPlot />

      {/* 雷达图对比 */}
      <div className="chart-container p-6">
        <h2 className="text-xl font-serif text-ink mb-2">{t('双概念雷达图对比', 'Dual-Concept Radar Chart Comparison')}</h2>

        {/* 说明文字 */}
        <p className="text-xs text-ink-lighter mb-4">
          {t(
            '本雷达图使用西方哲学的五维度框架（本体论/认识论/伦理学/美学/逻辑学）作为对比透镜，评分基于项目团队的文献阅读评估。中国哲学概念在此框架下的评分可能无法完全反映其内在特质。试想：如果使用一套中国哲学的维度（天/人、体/用、知/行），这些概念会呈现怎样不同的形状？',
            'This radar chart uses a Western philosophical framework (Ontology/Epistemology/Ethics/Aesthetics/Logic) as a comparative lens, with scores based on the team\'s literature assessment. Chinese concepts may not be fully captured by this framework. Consider: how might these concepts look under a Chinese philosophical framework (Heaven/Human, Substance/Function, Knowledge/Action)?'
          )}
        </p>

        {/* 选择器 */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="western-select" className="block text-sm text-ink-light mb-1">
              {t('西方概念', 'Western Concept')}
            </label>
            <select
              id="western-select"
              value={selectedWestern}
              onChange={(e) => setSelectedWestern(e.target.value)}
              className="w-full px-3 py-2 bg-ivory border border-ink/20 rounded text-ink focus:outline-none focus:ring-2 focus:ring-western"
            >
              <option value="">{t('请选择...', 'Select...')}</option>
              {westernConcepts.map(c => (
                <option key={c.id} value={c.id}>
                  {lang === 'zh' ? c.term.zh : c.term.en}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="chinese-select" className="block text-sm text-ink-light mb-1">
              {t('中国概念', 'Chinese Concept')}
            </label>
            <select
              id="chinese-select"
              value={selectedChinese}
              onChange={(e) => setSelectedChinese(e.target.value)}
              className="w-full px-3 py-2 bg-ivory border border-ink/20 rounded text-ink focus:outline-none focus:ring-2 focus:ring-chinese"
            >
              <option value="">{t('请选择...', 'Select...')}</option>
              {chineseConcepts.map(c => (
                <option key={c.id} value={c.id}>
                  {lang === 'zh' ? c.term.zh : c.term.en}
                </option>
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
  const { lang, t } = useLanguage()

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
      .text(lang === 'zh' ? '抽象 ← → 具体 (Abstract - Concrete)' : 'Abstract ← → Concrete')

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1a202c')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .text(lang === 'zh' ? '实践 ← → 形而上 (Practical - Metaphysical)' : 'Practical ← → Metaphysical')

    // 绘制点
    const points = g.selectAll('circle')
      .data(conceptProjections)
      .join('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 12)
      .attr('fill', d => d.tradition === 'western' ? '#2B4C7E' : '#C53030')
      .attr('stroke', '#F0F2F5')
      .attr('stroke-width', 2)
      .attr('cursor', 'pointer')
      .attr('opacity', 0.85)

    // 标签
    g.selectAll('text.label-zh')
      .data(conceptProjections)
      .join('text')
      .attr('class', 'label-zh')
      .attr('x', d => xScale(d.x))
      .attr('y', d => yScale(d.y) - 18)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('fill', '#1a202c')
      .text(d => lang === 'zh' ? d.term.zh : d.term.en)

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
  }, [dimensions, lang])

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
      <h2 className="text-xl font-serif text-ink mb-2">{t('跨文化语义散点图', 'Cross-Cultural Semantic Scatter Plot')}</h2>

      {/* 说明文字 */}
      <p className="text-xs text-ink-lighter mb-4">
        {t(
          '本散点图坐标基于项目团队对相关哲学文献的阅读评估手动标注，非自动语义计算产出。轴标签为探索性假设，不代表绝对定义。',
          'Scatter plot coordinates are manually assigned based on the team\'s reading of philosophical literature, not automated semantic computation. Axis labels are exploratory hypotheses, not absolute definitions.'
        )}
      </p>

      {/* 图例 */}
      <div className="flex gap-6 mb-4 text-sm font-semibold">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-western" />
          <span className="text-gray-900">{t('西方哲学词汇', 'Western Philosophy')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-chinese" />
          <span className="text-gray-900">{t('中国哲学词汇', 'Chinese Philosophy')}</span>
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
            <p className="font-medium text-ink">{lang === 'zh' ? hoveredPoint.term.zh : hoveredPoint.term.en}</p>
            <p className="text-ink-lighter text-xs mt-1">
              {hoveredPoint.tradition === 'western' ? t('西方哲学', 'Western Philosophy') : t('中国哲学', 'Chinese Philosophy')}
            </p>
            <div className="mt-2 pt-2 border-t border-ink/10">
              <p className="text-xs text-ink-light">
                {t('最近邻', 'Nearest')}: {lang === 'zh' ? getNearestNeighbor(hoveredPoint).nearest?.term.zh : getNearestNeighbor(hoveredPoint).nearest?.term.en}
              </p>
              <p className="text-xs text-ink-lighter">
                {t('距离', 'Distance')}: {getNearestNeighbor(hoveredPoint).distance}
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
  const { lang, t } = useLanguage()

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
        .text(lang === 'zh' ? dim.zh : dim.en)
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

    drawArea(westernData, '#2B4C7E', westernConcept?.term.zh || '')
    drawArea(chineseData, '#C53030', chineseConcept?.term.zh || '')

  }, [dimensions, westernData, chineseData, westernConcept, chineseConcept, lang])

  if (!westernId && !chineseId) {
    return (
      <div className="flex items-center justify-center h-64 bg-parchment rounded-lg">
        <p className="text-ink-lighter">{t('请选择两个概念进行对比', 'Please select two concepts to compare')}</p>
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
        aria-label={t(
          `雷达图对比: ${westernConcept?.term.zh || '未选择'} vs ${chineseConcept?.term.zh || '未选择'}`,
          `Radar comparison: ${westernConcept?.term.en || 'Not selected'} vs ${chineseConcept?.term.en || 'Not selected'}`
        )}
      />

      {/* 图例 */}
      <div className="flex gap-6 mt-4 text-sm">
        {westernConcept && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-western/30 border-2 border-western" />
            <span className="text-ink-light">{lang === 'zh' ? westernConcept.term.zh : westernConcept.term.en}</span>
          </div>
        )}
        {chineseConcept && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-chinese/30 border-2 border-chinese" />
            <span className="text-ink-light">{lang === 'zh' ? chineseConcept.term.zh : chineseConcept.term.en}</span>
          </div>
        )}
      </div>
    </div>
  )
}
