'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

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

  const tabs: { key: TabKey; label: string; labelEn: string }[] = [
    { key: 'timeline', label: '历史时间轴', labelEn: 'Timeline' },
    { key: 'network', label: '概念网络', labelEn: 'Concept Network' },
    { key: 'mapping', label: '跨文化映射', labelEn: 'Cross-Cultural Mapping' },
  ]

  return (
    <main id="main-content" className="min-h-screen">
      {/* 页头 */}
      <header className="border-b border-ink/10 bg-ivory/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-serif text-ink">
            中西方哲学概念演变与跨文化映射
          </h1>
          <p className="text-ink-light mt-1 text-sm sm:text-base">
            Cross-Cultural Mapping of Philosophical Concepts
          </p>
        </div>
      </header>

      {/* 导航标签 */}
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
        role="tablist"
        aria-label="功能模块导航"
      >
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              aria-controls={`panel-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm sm:text-base transition-colors ${
                activeTab === tab.key
                  ? 'bg-ink text-ivory'
                  : 'bg-parchment text-ink hover:bg-ink/10'
              }`}
            >
              <span className="block">{tab.label}</span>
              <span className="block text-xs opacity-70">{tab.labelEn}</span>
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

      {/* 页脚 */}
      <footer className="border-t border-ink/10 py-6 text-center text-ink-lighter text-sm">
        <p>数字人文可视化平台 · Digital Humanities Visualization Platform</p>
      </footer>
    </main>
  )
}
