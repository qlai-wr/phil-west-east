'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { philosophers, getCoreTextsByPhilosopher } from '../../../data/philosophyData'
import type { Philosopher } from '../../../data/philosophyData'

interface TimelineProps {
  className?: string
}

export default function Timeline({ className = '' }: TimelineProps) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedPhilosopher, setSelectedPhilosopher] = useState<Philosopher | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  const westernPhilosophers = useMemo(
    () => philosophers.filter(p => p.tradition === 'western').sort((a, b) => a.birth - b.birth),
    []
  )
  const chinesePhilosophers = useMemo(
    () => philosophers.filter(p => p.tradition === 'chinese').sort((a, b) => a.birth - b.birth),
    []
  )

  // 计算每个哲学家的连接线高度，避免相邻哲学家文字重叠
  const calculateLineHeights = useCallback((philosopherList: Philosopher[]) => {
    const heights: number[] = []
    const minGap = 200 // 如果两个哲学家相差小于200年，需要错开
    const shortHeight = 5
    const tallHeight = 45
    
    for (let i = 0; i < philosopherList.length; i++) {
      if (i === 0) {
        heights.push(shortHeight)
        continue
      }
      
      const prevYear = (philosopherList[i - 1].birth + philosopherList[i - 1].death) / 2
      const currYear = (philosopherList[i].birth + philosopherList[i].death) / 2
      const gap = currYear - prevYear
      
      // 如果与前一个太近，就用不同的高度
      if (gap < minGap) {
        heights.push(heights[i - 1] === shortHeight ? tallHeight : shortHeight)
      } else {
        // 距离够远，可以用短高度
        heights.push(shortHeight)
      }
    }
    return heights
  }, [])

  const westernHeights = useMemo(
    () => calculateLineHeights(westernPhilosophers),
    [westernPhilosophers, calculateLineHeights]
  )
  const chineseHeights = useMemo(
    () => calculateLineHeights(chinesePhilosophers),
    [chinesePhilosophers, calculateLineHeights]
  )

  const minYear = -600
  const maxYear = 2000
  const timelineWidth = 100 // percentage

  const yearToPosition = useCallback((year: number) => {
    return ((year - minYear) / (maxYear - minYear)) * timelineWidth
  }, [])

  const positionToYear = useCallback((position: number, containerWidth: number) => {
    const percentage = position / containerWidth
    return Math.round(minYear + percentage * (maxYear - minYear))
  }, [])

  const isPhilosopherActive = useCallback((philosopher: Philosopher) => {
    if (!selectedYear) return false
    const tolerance = 50 // 50年容差
    return philosopher.birth - tolerance <= selectedYear && philosopher.death + tolerance >= selectedYear
  }, [selectedYear])

  const handleSliderMove = useCallback((clientX: number) => {
    if (!sliderRef.current) return
    const rect = sliderRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    const year = positionToYear(x, rect.width)
    setSelectedYear(year)
  }, [positionToYear])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    handleSliderMove(e.clientX)
  }, [handleSliderMove])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    handleSliderMove(e.clientX)
  }, [isDragging, handleSliderMove])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true)
    handleSliderMove(e.touches[0].clientX)
  }, [handleSliderMove])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return
    handleSliderMove(e.touches[0].clientX)
  }, [isDragging, handleSliderMove])

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false)
    window.addEventListener('mouseup', handleGlobalMouseUp)
    window.addEventListener('touchend', handleGlobalMouseUp)
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp)
      window.removeEventListener('touchend', handleGlobalMouseUp)
    }
  }, [])

  const formatYear = (year: number) => {
    if (year < 0) return `公元前${Math.abs(year)}年`
    return `公元${year}年`
  }

  const PhilosopherNode = ({ philosopher, isTop, lineHeight }: { philosopher: Philosopher; isTop: boolean; lineHeight: number }) => {
    const isActive = isPhilosopherActive(philosopher)
    const position = yearToPosition((philosopher.birth + philosopher.death) / 2)
    const texts = getCoreTextsByPhilosopher(philosopher.id)

    // 轨道高度是 h-1 (4px)，圆点大小是 w-3 h-3 (12px)
    // 圆点中心需要对齐轨道中心：(12-4)/2 = 4px 偏移
    // 西方轨道：圆点在底部，文字向上延伸
    // 中国轨道：圆点在顶部，文字向下延伸
    
    if (isTop) {
      // 西方轨道：整个组件从轨道向上延伸
      // bottom: -4px 让圆点中心对齐轨道中心
      return (
        <div
          className="absolute transform -translate-x-1/2 flex flex-col items-center"
          style={{ 
            left: `${position}%`,
            bottom: '-4px'
          }}
        >
          <button
            onClick={() => setSelectedPhilosopher(philosopher)}
            onKeyDown={(e) => e.key === 'Enter' && setSelectedPhilosopher(philosopher)}
            className={`
              flex flex-col items-center transition-all duration-100
              ${isActive ? 'scale-110' : 'opacity-70 hover:opacity-100'}
            `}
            aria-label={`${philosopher.name.zh} (${philosopher.name.en})`}
            aria-pressed={selectedPhilosopher?.id === philosopher.id}
          >
            {/* 名称标签 - 最上方 */}
            <div className="text-center mb-1">
              <p className="text-sm font-bold whitespace-nowrap text-gray-900">
                {philosopher.name.zh}
              </p>
              <p className="text-xs font-semibold whitespace-nowrap text-gray-700">
                {philosopher.name.en}
              </p>
              {isActive && texts.length > 0 && (
                <p className="text-xs font-medium text-accent-western mt-1 max-w-[100px] truncate">
                  《{texts[0].title.zh}》
                </p>
              )}
            </div>
            {/* 连接线 */}
            <div 
              className={`w-px ${isActive ? 'bg-accent-western' : 'bg-accent-western/30'}`}
              style={{ height: `${lineHeight}px` }}
            />
            {/* 节点圆点 - 在轨道上 */}
            <div
              className={`
                w-3 h-3 rounded-full border-2 transition-colors flex-shrink-0
                border-accent-western
                ${isActive ? 'bg-accent-western' : 'bg-ivory'}
              `}
            />
          </button>
        </div>
      )
    } else {
      // 中国轨道：整个组件从轨道向下延伸
      // top: -4px 让圆点中心对齐轨道中心
      return (
        <div
          className="absolute transform -translate-x-1/2 flex flex-col items-center"
          style={{ 
            left: `${position}%`,
            top: '-4px'
          }}
        >
          <button
            onClick={() => setSelectedPhilosopher(philosopher)}
            onKeyDown={(e) => e.key === 'Enter' && setSelectedPhilosopher(philosopher)}
            className={`
              flex flex-col items-center transition-all duration-100
              ${isActive ? 'scale-110' : 'opacity-70 hover:opacity-100'}
            `}
            aria-label={`${philosopher.name.zh} (${philosopher.name.en})`}
            aria-pressed={selectedPhilosopher?.id === philosopher.id}
          >
            {/* 节点圆点 - 在轨道上 */}
            <div
              className={`
                w-3 h-3 rounded-full border-2 transition-colors flex-shrink-0
                border-accent-chinese
                ${isActive ? 'bg-accent-chinese' : 'bg-ivory'}
              `}
            />
            {/* 连接线 */}
            <div 
              className={`w-px ${isActive ? 'bg-accent-chinese' : 'bg-accent-chinese/30'}`}
              style={{ height: `${lineHeight}px` }}
            />
            {/* 名称标签 - 最下方 */}
            <div className="text-center mt-1">
              <p className="text-sm font-bold whitespace-nowrap text-gray-900">
                {philosopher.name.zh}
              </p>
              <p className="text-xs font-semibold whitespace-nowrap text-gray-700">
                {philosopher.name.en}
              </p>
              {isActive && texts.length > 0 && (
                <p className="text-xs font-medium text-accent-chinese mt-1 max-w-[100px] truncate">
                  《{texts[0].title.zh}》
                </p>
              )}
            </div>
          </button>
        </div>
      )
    }
  }

  return (
    <div className={`chart-container p-6 ${className}`} role="region" aria-label="双轨历史时间轴">
      <h2 className="text-xl font-serif text-ink mb-2">双轨历史时间轴</h2>
      <p className="text-sm text-ink-light">Dual-Track Historical Timeline</p>

      {/* 时间轴容器 */}
      <div className="mt-48 mb-8 px-16">
        {/* 时间轴主体 */}
        <div className="relative mb-32">
        {/* 西方轨道 (上方) */}
        <div 
          className="absolute w-full h-1 bg-accent-western/30 -top-16"
          role="list"
          aria-label="西方哲学家时间轴"
        >
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 text-xs text-accent-western font-medium">
            西方
          </div>
          {westernPhilosophers.map((p, index) => (
            <PhilosopherNode 
              key={p.id} 
              philosopher={p} 
              isTop={true} 
              lineHeight={westernHeights[index]} 
            />
          ))}
        </div>

        {/* 时间刻度轴 */}
        <div 
          ref={sliderRef}
          className="relative w-full h-2 bg-gray-300 rounded cursor-pointer select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          role="slider"
          aria-label="时间选择滑块"
          aria-valuemin={minYear}
          aria-valuemax={maxYear}
          aria-valuenow={selectedYear || 0}
          aria-valuetext={selectedYear ? formatYear(selectedYear) : '未选择'}
          tabIndex={0}
        >
          {/* 时间刻度 */}
          {[-500, 0, 500, 1000, 1500, 2000].map(year => (
            <div
              key={year}
              className="absolute top-full mt-2 transform -translate-x-1/2"
              style={{ left: `${yearToPosition(year)}%` }}
            >
              <div className="w-px h-3 bg-gray-600 mx-auto" />
              <span className="text-xs font-semibold text-gray-700">
                {year < 0 ? `${Math.abs(year)}BCE` : year === 0 ? '0' : `${year}CE`}
              </span>
            </div>
          ))}

          {/* 滑块指示器 */}
          {selectedYear !== null && (
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-ink rounded-full shadow-lg cursor-grab active:cursor-grabbing"
              style={{ left: `${yearToPosition(selectedYear)}%` }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-ink text-ivory text-xs px-2 py-1 rounded whitespace-nowrap">
                {formatYear(selectedYear)}
              </div>
            </div>
          )}
        </div>

        {/* 中国轨道 (下方) */}
        <div 
          className="absolute w-full h-1 bg-accent-chinese/30 top-16"
          role="list"
          aria-label="中国哲学家时间轴"
        >
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 text-xs text-accent-chinese font-medium">
            中国
          </div>
          {chinesePhilosophers.map((p, index) => (
            <PhilosopherNode 
              key={p.id} 
              philosopher={p} 
              isTop={false} 
              lineHeight={chineseHeights[index]} 
            />
          ))}
        </div>
      </div>
      </div>

      {/* 图例 */}
      <div className="flex justify-center gap-8 mt-16 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent-western" />
          <span className="text-ink-light">Western Philosophy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent-chinese" />
          <span className="text-ink-light">Chinese Philosophy</span>
        </div>
      </div>

      {/* 哲学家详情面板 */}
      {selectedPhilosopher && (
        <PhilosopherDetailPanel
          philosopher={selectedPhilosopher}
          onClose={() => setSelectedPhilosopher(null)}
        />
      )}
    </div>
  )
}

function PhilosopherDetailPanel({ 
  philosopher, 
  onClose 
}: { 
  philosopher: Philosopher
  onClose: () => void 
}) {
  const texts = getCoreTextsByPhilosopher(philosopher.id)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const formatYear = (year: number) => {
    if (year < 0) return `公元前${Math.abs(year)}年`
    return `公元${year}年`
  }

  return (
    <div 
      className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="philosopher-name"
    >
      <div 
        className="bg-ivory rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          {/* 头部 */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 id="philosopher-name" className="text-xl font-serif text-ink">
                {philosopher.name.zh}
              </h3>
              <p className="text-ink-light">{philosopher.name.en}</p>
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

          {/* 生卒年份 */}
          <div className="mb-4">
            <span className={`
              inline-block px-2 py-1 rounded text-xs
              ${philosopher.tradition === 'western' ? 'bg-accent-western/10 text-accent-western' : 'bg-accent-chinese/10 text-accent-chinese'}
            `}>
              {formatYear(philosopher.birth)} — {formatYear(philosopher.death)}
            </span>
            <span className="ml-2 text-sm text-ink-light">{philosopher.era.zh}</span>
          </div>

          {/* 核心思想摘要 */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-ink mb-2">核心思想</h4>
            <p className="text-sm text-ink-light leading-relaxed">{philosopher.summary.zh}</p>
          </div>

          {/* 主要著作 */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-ink mb-2">主要著作</h4>
            <ul className="space-y-1">
              {philosopher.works.map((work, i) => (
                <li key={i} className="text-sm text-ink-light">
                  《{work.zh}》<span className="text-ink-lighter ml-1">({work.en})</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 经典摘录 */}
          {texts.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-ink mb-2">经典摘录</h4>
              {texts.map((text, i) => (
                <blockquote key={i} className="border-l-2 border-ink/20 pl-4 mb-3">
                  <p className="text-sm text-ink italic mb-1">"{text.excerpt.zh}"</p>
                  <cite className="text-xs text-ink-lighter not-italic">
                    —— 《{text.title.zh}》{text.chapter?.zh && `· ${text.chapter.zh}`}
                  </cite>
                </blockquote>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
