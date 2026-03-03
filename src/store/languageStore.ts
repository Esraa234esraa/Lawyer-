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
    set({ language: lang })
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  },
  toggleLanguage: () => {
    set((state) => {
      const newLang = state.language === 'ar' ? 'en' : 'ar'
      document.documentElement.lang = newLang
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr'
      return { language: newLang }
    })
  },
}))