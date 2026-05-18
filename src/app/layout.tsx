import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '中西方哲学概念演变与跨文化映射',
  description: '数字人文可视化平台：展示中西方哲学核心概念的历史演变轨迹与跨文化语义映射',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-ink focus:text-ivory focus:rounded"
        >
          跳转到主要内容
        </a>
        {children}
      </body>
    </html>
  )
}
