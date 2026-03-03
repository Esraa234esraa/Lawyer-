import { motion } from 'framer-motion'
import { useLanguage } from '@/hooks/useLanguage'

interface PageTransitionProps {
  children: React.ReactNode
}

const pageVariants = {
  initial: (isRTL: boolean) => ({
    opacity: 0,
    x: isRTL ? -20 : 20,
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
  exit: (isRTL: boolean) => ({
    opacity: 0,
    x: isRTL ? 20 : -20,
    transition: {
      duration: 0.4,
      ease: 'easeIn',
    },
  }),
}

export default function PageTransition({ children }: PageTransitionProps) {
  const { isRTL } = useLanguage()

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      custom={isRTL}
    >
      {children}
    </motion.div>
  )
}