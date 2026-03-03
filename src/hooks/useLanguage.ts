import { useLanguageStore } from '@/store/languageStore'

export const useLanguage = () => {
  const { language, setLanguage, toggleLanguage } = useLanguageStore()

  const isArabic = language === 'ar'
  const isRTL = isArabic

  return {
    language,
    setLanguage,
    toggleLanguage,
    isArabic,
    isRTL,
    dir: isArabic ? 'rtl' : 'ltr',
  }
}