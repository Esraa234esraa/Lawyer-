import { LOGO_DARK } from '@/constants/logo'

interface LoadingProps {
  message?: string
  inline?: boolean
}

export default function Loading({ message, inline = false }: LoadingProps) {
  if (inline) {
    return (
      <div className="inline-flex items-center gap-3 text-gray-300 font-cairo">
        <svg className="animate-spin h-4 w-4 text-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <span className="text-sm">{message || (typeof window !== 'undefined' && document?.dir === 'rtl' ? 'جاري التحميل...' : 'Loading...')}</span>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/20 p-6" dir="rtl">
      <img src={LOGO_DARK} alt="logo" className="h-20 w-auto" />
      <svg className="h-8 w-8 animate-spin text-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      <p className="font-cairo text-gray-300">{message || (typeof window !== 'undefined' && document?.dir === 'rtl' ? 'جاري التحميل...' : 'Loading...')}</p>
    </div>
  )
}
