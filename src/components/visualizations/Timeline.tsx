'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { philosophers, getCoreTextsByPhilosopher } from '../../../data/philosophyData'
import type { Philosopher } from '../../../data/philosophyData'
import { useLanguage } from '../LanguageContext'

interface TimelineProps {
  className?: string
}

export default function Timeline({ className = '' }: TimelineProps) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedPhilosopher, setSelectedPhilosopher] = useState<Philosopher | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const { lang, t } = useLanguage()

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
    const minGap = 300 // 如果两个哲学家相差小于300年，需要错开
    const levelHeights = [5, 45, 85, 125] // 四级高度交替
    
    for (let i = 0; i < philosopherList.length; i++) {
      if (i === 0) {
        heights.push(levelHeights[0])
        continue
      }
      
      const prevYear = (philosopherList[i - 1].birth + philosopherList[i - 1].death) / 2
      const currYear = (philosopherList[i].birth + philosopherList[i].death) / 2
      const gap = currYear - prevYear
      
      if (gap < minGap) {
        // 找一个与前一个不同的高度级别
        const prevLevel = levelHeights.indexOf(heights[i - 1])
        const nextLevel = (prevLevel + 1) % levelHeights.length
        heights.push(levelHeights[nextLevel])
      } else {
        heights.push(levelHeights[0])
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
    if (lang === 'en') {
      if (year < 0) return `${Math.abs(year)} BCE`
      return `${year} CE`
    }
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
                {lang === 'zh' ? philosopher.name.zh : philosopher.name.en}
              </p>
              {isActive && texts.length > 0 && (
                <p className="text-xs font-medium text-western mt-1 max-w-[100px] truncate">
                  {lang === 'zh' ? `《${texts[0].title.zh}》` : texts[0].title.en}
                </p>
              )}
            </div>
            {/* 连接线 */}
            <div 
              className={`w-px ${isActive ? 'bg-western' : 'bg-western/30'}`}
              style={{ height: `${lineHeight}px` }}
            />
            {/* 节点圆点 - 在轨道上 */}
            <div
              className={`
                w-3.5 h-3.5 rounded-full border-2 transition-colors flex-shrink-0
                border-western
                ${isActive ? 'bg-western shadow-md' : 'bg-western-light'}
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
                w-3.5 h-3.5 rounded-full border-2 transition-colors flex-shrink-0
                border-chinese
                ${isActive ? 'bg-chinese shadow-md' : 'bg-chinese-light'}
              `}
            />
            {/* 连接线 */}
            <div 
              className={`w-px ${isActive ? 'bg-chinese' : 'bg-chinese/30'}`}
              style={{ height: `${lineHeight}px` }}
            />
            {/* 名称标签 - 最下方 */}
            <div className="text-center mt-1">
              <p className="text-sm font-bold whitespace-nowrap text-gray-900">
                {lang === 'zh' ? philosopher.name.zh : philosopher.name.en}
              </p>
              {isActive && texts.length > 0 && (
                <p className="text-xs font-medium text-chinese mt-1 max-w-[100px] truncate">
                  {lang === 'zh' ? `《${texts[0].title.zh}》` : texts[0].title.en}
                </p>
              )}
            </div>
          </button>
        </div>
      )
    }
  }

  return (
    <div className={`chart-container p-6 ${className}`} role="region" aria-label={t('双轨历史时间轴', 'Dual-Track Historical Timeline')}>
      <h2 className="text-xl font-serif text-ink mb-4">{t('双轨历史时间轴', 'Dual-Track Historical Timeline')}</h2>

      {/* 时间轴容器 */}
      <div className="mt-48 mb-8 px-16">
        {/* 时间轴主体 */}
        <div className="relative mb-32">
        {/* 西方轨道 (上方) */}
        <div 
          className="absolute w-full h-1.5 rounded-full bg-gradient-to-r from-western-light to-western -top-16"
          role="list"
          aria-label="西方哲学家时间轴"
        >
          <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-xs text-western font-semibold">
            {t('西方', 'Western')}
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
          className="relative w-full h-2.5 bg-gradient-to-r from-ink-faint via-ink-lighter to-ink-faint rounded-full cursor-pointer select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          role="slider"
          aria-label={t('时间选择滑块', 'Time selection slider')}
          aria-valuemin={minYear}
          aria-valuemax={maxYear}
          aria-valuenow={selectedYear || 0}
          aria-valuetext={selectedYear ? formatYear(selectedYear) : t('未选择', 'Not selected')}
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
          className="absolute w-full h-1.5 rounded-full bg-gradient-to-r from-chinese-light to-chinese top-16"
          role="list"
          aria-label="中国哲学家时间轴"
        >
          <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-xs text-chinese font-semibold">
            {t('中国', 'Chinese')}
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
          <div className="w-3.5 h-3.5 rounded-full bg-western" />
          <span className="text-ink-light">{t('西方哲学', 'Western Philosophy')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-chinese" />
          <span className="text-ink-light">{t('中国哲学', 'Chinese Philosophy')}</span>
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
  const { lang, t } = useLanguage()

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const formatYear = (year: number) => {
    if (lang === 'en') {
      if (year < 0) return `${Math.abs(year)} BCE`
      return `${year} CE`
    }
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
                {lang === 'zh' ? philosopher.name.zh : philosopher.name.en}
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

          {/* 生卒年份 */}
          <div className="mb-4">
            <span className={`
              inline-block px-2 py-1 rounded text-xs
              ${philosopher.tradition === 'western' ? 'bg-western/10 text-western' : 'bg-chinese/10 text-chinese'}
            `}>
              {formatYear(philosopher.birth)} — {formatYear(philosopher.death)}
            </span>
            <span className="ml-2 text-sm text-ink-light">{lang === 'zh' ? philosopher.era.zh : philosopher.era.en}</span>
          </div>

          {/* 核心思想摘要 */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-ink mb-2">{t('核心思想', 'Core Ideas')}</h4>
            <p className="text-sm text-ink-light leading-relaxed">{lang === 'zh' ? philosopher.summary.zh : philosopher.summary.en}</p>
          </div>

          {/* 主要著作 */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-ink mb-2">{t('主要著作', 'Major Works')}</h4>
            <ul className="space-y-1">
              {philosopher.works.map((work, i) => (
                <li key={i} className="text-sm text-ink-light">
                  {lang === 'zh' ? `《${work.zh}》` : work.en}
                </li>
              ))}
            </ul>
          </div>

          {/* 经典摘录 */}
          {texts.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-ink mb-2">{t('经典摘录', 'Classic Excerpts')}</h4>
              {texts.map((text, i) => (
                <blockquote key={i} className="border-l-2 border-ink/20 pl-4 mb-3">
                  <p className="text-sm text-ink italic mb-1">"{lang === 'zh' ? text.excerpt.zh : text.excerpt.en}"</p>
                  <cite className="text-xs text-ink-lighter not-italic">
                    {lang === 'zh' ? (
                      <>—— 《{text.title.zh}》{text.chapter?.zh && `· ${text.chapter.zh}`}</>
                    ) : (
                      <>— {text.title.en}{text.chapter?.en && `, ${text.chapter.en}`}</>
                    )}
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
