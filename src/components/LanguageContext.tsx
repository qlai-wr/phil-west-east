'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type Lang = 'zh' | 'en'

interface LanguageContextType {
  lang: Lang
  toggleLang: () => void
  t: (zh: string, en: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'zh',
  toggleLang: () => {},
  t: (zh) => zh,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('zh')

  const toggleLang = useCallback(() => {
    setLang(prev => (prev === 'zh' ? 'en' : 'zh'))
  }, [])

  const t = useCallback((zh: string, en: string) => {
    return lang === 'zh' ? zh : en
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
