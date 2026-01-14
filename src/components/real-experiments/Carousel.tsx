/**
 * Carousel Component - 水平滚动轮播组件
 *
 * 提供平滑的水平滚动体验，支持鼠标拖拽和按钮导航
 * Provides smooth horizontal scrolling with mouse drag and button navigation
 */

import { useRef, useState, useEffect, ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface CarouselProps {
  children: ReactNode[]
  itemsPerView?: number // How many items visible at once
  gap?: number // Gap between items in pixels
  className?: string
  showNavigation?: boolean
  autoScroll?: boolean
  autoScrollInterval?: number
}

export function Carousel({
  children,
  itemsPerView = 5,
  gap = 16,
  className = '',
  showNavigation = true,
  autoScroll = false,
  autoScrollInterval = 5000,
}: CarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Check scroll position to show/hide navigation buttons
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current
    if (!container) return

    setCanScrollLeft(container.scrollLeft > 0)
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1
    )
  }

  useEffect(() => {
    checkScrollPosition()
    const container = scrollContainerRef.current
    if (!container) return

    container.addEventListener('scroll', checkScrollPosition)
    return () => container.removeEventListener('scroll', checkScrollPosition)
  }, [children])

  // Auto-scroll functionality
  useEffect(() => {
    if (!autoScroll) return

    const interval = setInterval(() => {
      const container = scrollContainerRef.current
      if (!container) return

      if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
        // Reset to start
        container.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        scrollRight()
      }
    }, autoScrollInterval)

    return () => clearInterval(interval)
  }, [autoScroll, autoScrollInterval])

  const scrollRight = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = container.clientWidth * 0.8
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  const scrollLeftFn = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = container.clientWidth * 0.8
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
  }

  // Mouse drag scrolling
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0))
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const container = scrollContainerRef.current
    if (!container) return

    const x = e.pageX - container.offsetLeft
    const walk = (x - startX) * 2 // Multiply for faster scroll
    container.scrollLeft = scrollLeft - walk
  }

  const handleMouseUpOrLeave = () => {
    setIsDragging(false)
  }

  // Calculate item width based on itemsPerView
  const itemWidth = `calc((100% - ${gap * (itemsPerView - 1)}px) / ${itemsPerView})`

  return (
    <div className={`relative group ${className}`}>
      {/* Left Navigation Button */}
      {showNavigation && canScrollLeft && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={scrollLeftFn}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-slate-900/80 dark:bg-slate-100/80 text-white dark:text-slate-900 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-800 dark:hover:bg-slate-200"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
      )}

      {/* Scroll Container */}
      <div
        ref={scrollContainerRef}
        className={`flex overflow-x-auto scrollbar-hide ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ gap: `${gap}px` }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        {children.map((child, index) => (
          <div
            key={index}
            className="flex-shrink-0"
            style={{ width: itemWidth }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Right Navigation Button */}
      {showNavigation && canScrollRight && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-slate-900/80 dark:bg-slate-100/80 text-white dark:text-slate-900 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-800 dark:hover:bg-slate-200"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  )
}

// Hide scrollbar CSS (add to global styles if not already present)
// .scrollbar-hide::-webkit-scrollbar { display: none; }
// .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
