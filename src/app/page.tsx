'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useLanguage } from '@/components/LanguageContext'

// 懒加载可视化组件 - 代码分割策略
const Timeline = dynamic(() => import('@/components/visualizations/Timeline'), {
  loading: () => <LoadingPlaceholder label="时间轴" />,
  ssr: false,
})

const ConceptNetwork = dynamic(() => import('@/components/visualizations/ConceptNetwork'), {
  loading: () => <LoadingPlaceholder label="概念网络" />,
  ssr: false,
})

const MappingView = dynamic(() => import('@/components/visualizations/MappingView'), {
  loading: () => <LoadingPlaceholder label="映射视图" />,
  ssr: false,
})

function LoadingPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center h-64 bg-parchment rounded-lg">
      <div className="text-center">
        <div className="loading-spinner mx-auto mb-4" />
        <p className="text-ink-light">加载{label}中...</p>
      </div>
    </div>
  )
}

type TabKey = 'timeline' | 'network' | 'mapping'

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabKey>('timeline')
  const { lang, toggleLang, t } = useLanguage()

  const tabs: { key: TabKey; label: string; labelEn: string }[] = [
    { key: 'timeline', label: '历史时间轴', labelEn: 'Timeline' },
    { key: 'network', label: '概念网络', labelEn: 'Concept Network' },
    { key: 'mapping', label: '跨文化映射', labelEn: 'Cross-Cultural Mapping' },
  ]

  return (
    <main id="main-content" className="min-h-screen">
      {/* 顶部渐变条 */}
      <div className="header-bar" />

      {/* 页头 */}
      <header className="border-b border-ink-faint bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-serif text-ink">
            {t('中西方哲学概念演变与跨文化映射', 'Cross-Cultural Mapping of Philosophical Concepts')}
          </h1>
          <button
            onClick={toggleLang}
            className="flex-shrink-0 px-3 py-1.5 rounded-lg border border-ink-faint text-sm text-ink-light hover:bg-parchment hover:border-gold-light transition-all"
            aria-label={lang === 'zh' ? 'Switch to English' : '切换到中文'}
          >
            {lang === 'zh' ? 'EN' : '中文'}
          </button>
        </div>
      </header>

      {/* 导航标签 */}
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
        role="tablist"
        aria-label={t('功能模块导航', 'Module Navigation')}
      >
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              aria-controls={`panel-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-lg text-sm sm:text-base font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-ink text-white shadow-card'
                  : 'bg-white text-ink-light border border-ink-faint hover:border-western-light hover:text-western hover:shadow-card'
              }`}
            >
              <span>{lang === 'zh' ? tab.label : tab.labelEn}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* 内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div
          id="panel-timeline"
          role="tabpanel"
          aria-labelledby="tab-timeline"
          hidden={activeTab !== 'timeline'}
        >
          {activeTab === 'timeline' && <Timeline />}
        </div>

        <div
          id="panel-network"
          role="tabpanel"
          aria-labelledby="tab-network"
          hidden={activeTab !== 'network'}
        >
          {activeTab === 'network' && <ConceptNetwork />}
        </div>

        <div
          id="panel-mapping"
          role="tabpanel"
          aria-labelledby="tab-mapping"
          hidden={activeTab !== 'mapping'}
        >
          {activeTab === 'mapping' && <MappingView />}
        </div>
      </div>

      {/* 关于本平台 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <details className="chart-container p-6">
          <summary className="cursor-pointer text-sm font-medium text-ink-light hover:text-ink transition-colors">
            {t('关于本平台', 'About This Platform')}
          </summary>
          <div className="mt-4 space-y-3 text-sm text-ink-light leading-relaxed">
            <p>
              {t(
                '本平台是一个哲学学习项目的可视化成果，旨在帮助学习者直观地了解中西方哲学核心概念及其演变关系。',
                'This platform is the visual outcome of a philosophy learning project, designed to help learners intuitively understand core philosophical concepts and their evolution across Chinese and Western traditions.'
              )}
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                {t(
                  '概念演变链是基于二手文献综合整理的简化模型，不涵盖每个传统内部的所有复杂流派和争议。',
                  'The concept evolution chains are simplified models based on secondary literature, and do not cover all complex schools and debates within each tradition.'
                )}
              </li>
              <li>
                {t(
                  '跨文化对照关系（虚线连接）是探索性的对照假说，其成立与否在学术界存在广泛讨论。它们被呈现出来是为了激发思考，而非声称定论。',
                  'Cross-cultural contrast relations (dashed lines) are exploratory hypotheses widely debated in academia. They are presented to provoke thinking, not to claim conclusions.'
                )}
              </li>
              <li>
                {t(
                  '散点图和雷达图的数据基于项目团队对相关文献的阅读理解和主观评估，而非大规模语料库的自动计算。',
                  'Scatter plot and radar chart data are based on the team\'s reading assessment of relevant literature, not automated computation from large-scale corpora.'
                )}
              </li>
            </ul>
            <p className="text-ink-lighter italic">
              {t(
                '本平台不是一个权威的学术研究工具，而是一个开放的、可争辩的学习邀请。',
                'This platform is not an authoritative academic research tool, but an open, debatable invitation to learn.'
              )}
            </p>
          </div>
        </details>
      </section>

      {/* 页脚 */}
      <footer className="border-t border-ink-faint py-6 text-center text-ink-lighter text-sm">
        <p>{t('数字人文可视化平台', 'Digital Humanities Visualization Platform')}</p>
      </footer>
    </main>
  )
}
