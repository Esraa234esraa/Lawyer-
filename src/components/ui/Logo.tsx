import { LOGO_DARK, LOGO_LIGHT } from '@/constants/logo'

type LogoVariant = 'dark' | 'light'

interface LogoProps {
  /** dark = شعار رقم 1 (خلفية كحلي)، light = شعار رقم 2 (خلفية بيضاء) */
  variant?: LogoVariant
  className?: string
  alt?: string
}

export default function Logo({ variant = 'dark', className = '', alt = 'شعار مكتب مريم بنت محمد' }: LogoProps) {
  const src = variant === 'dark' ? LOGO_DARK : LOGO_LIGHT
  return <img src={src} alt={alt} className={className} />
}
