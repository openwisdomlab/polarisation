/**
 * CategoryCarousel Component - 分类轮播组件
 *
 * 为内容分类添加标题和描述的轮播包装器
 * Carousel wrapper with category headers and descriptions
 */

import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Carousel } from './Carousel'

interface CategoryCarouselProps {
  title: string
  titleZh?: string
  description?: string
  descriptionZh?: string
  icon?: ReactNode
  count: number
  children: ReactNode[]
  itemsPerView?: number
  gap?: number
  showViewAll?: boolean
  onViewAll?: () => void
  className?: string
}

export function CategoryCarousel({
  title,
  titleZh,
  description,
  descriptionZh,
  icon,
  count,
  children,
  itemsPerView = 5,
  gap = 16,
  showViewAll = false,
  onViewAll,
  className = '',
}: CategoryCarouselProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const displayTitle = isZh && titleZh ? titleZh : title
  const displayDescription = isZh && descriptionZh ? descriptionZh : description

  return (
    <section className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && <div className="text-2xl">{icon}</div>}
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              {displayTitle}{' '}
              <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                ({count})
              </span>
            </h3>
            {displayDescription && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {displayDescription}
              </p>
            )}
          </div>
        </div>

        {showViewAll && onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline"
          >
            {isZh ? '查看全部' : 'View All'} →
          </button>
        )}
      </div>

      {/* Carousel */}
      <Carousel itemsPerView={itemsPerView} gap={gap}>
        {children}
      </Carousel>
    </section>
  )
}
