import { useRef } from 'react'

interface SwipeHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
}

export const useSwipe = (handlers: SwipeHandlers) => {
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX
  }

  const handleTouchEnd = (e: TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX
    handleSwipe()
  }

  const handleSwipe = () => {
    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && handlers.onSwipeLeft) {
      handlers.onSwipeLeft()
    }
    if (isRightSwipe && handlers.onSwipeRight) {
      handlers.onSwipeRight()
    }
  }

  return { handleTouchStart, handleTouchEnd }
}