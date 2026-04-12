import { create } from 'zustand'
import { Language } from '@/types'

interface LanguageState {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'ar',
  setLanguage: (lang) => {
    const forcedLang: Language = 'ar'
    set({ language: forcedLang })
    document.documentElement.lang = forcedLang
    document.documentElement.dir = 'rtl'
  },
  toggleLanguage: () => {
    set({ language: 'ar' })
    document.documentElement.lang = 'ar'
    document.documentElement.dir = 'rtl'
  },
}))