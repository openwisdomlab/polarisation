/**
 * Real Experiment Micro Gallery (真实实验微画廊)
 *
 * 嵌入式组件，在演示页面底部显示相关的真实实验照片/视频
 * 自动根据 relatedModules 匹配并展示相关资源
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Play, X, ChevronLeft, ChevronRight, Eye, Sparkles, Palette, FlaskConical, Lightbulb } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  getResourcesByModule,
  type PolarizationResource
} from '@/data/resource-gallery'
import {
  getMediaByTag,
} from '@/data/cultural-creations'
import { TripleViewToggle } from './TripleViewToggle'
import { CategoryCarousel } from './CategoryCarousel'

// ===== Helper Functions =====

interface ResourceCategory {
  id: string
  title: string
  titleZh: string
  description?: string
  descriptionZh?: string
  icon: React.ReactNode
  resources: PolarizationResource[]
}

/**
 * Auto-categorize resources based on their properties
 */
function categorizeResources(
  resources: PolarizationResource[]
): ResourceCategory[] {
  const categories: ResourceCategory[] = []

  // Category 1: Art Creations
  const artResources = resources.filter(r => r.category === 'art')
  if (artResources.length > 0) {
    categories.push({
      id: 'art',
      title: 'Artistic Creations',
      titleZh: '艺术创作系列',
      description: 'Polarization art and creative explorations',
      descriptionZh: '偏振光艺术与创意探索',
      icon: <Palette className="w-5 h-5" />,
      resources: artResources,
    })
  }

  // Category 2: Setup & Equipment
  const setupResources = resources.filter(
    r =>
      r.title.toLowerCase().includes('setup') ||
      r.titleZh?.includes('装置') ||
      r.titleZh?.includes('设备') ||
      r.description?.toLowerCase().includes('apparatus') ||
      r.descriptionZh?.includes('设备')
  )
  if (setupResources.length > 0) {
    categories.push({
      id: 'setup',
      title: 'Experimental Setup',
      titleZh: '实验装置',
      description: 'Laboratory equipment and configurations',
      descriptionZh: '实验室设备与配置',
      icon: <FlaskConical className="w-5 h-5" />,
      resources: setupResources,
    })
  }

  // Category 3: Polarization Effects
  const effectsResources = resources.filter(
    r =>
      !artResources.includes(r) &&
      !setupResources.includes(r) &&
      (r.category === 'birefringence' ||
        r.category === 'interference' ||
        r.category === 'stress' ||
        r.metadata.polarizationSystem === 'parallel' ||
        r.metadata.polarizationSystem === 'crossed')
  )
  if (effectsResources.length > 0) {
    categories.push({
      id: 'effects',
      title: 'Polarization Effects',
      titleZh: '偏振效应',
      description: 'Observable polarization phenomena',
      descriptionZh: '可观察的偏振现象',
      icon: <Lightbulb className="w-5 h-5" />,
      resources: effectsResources,
    })
  }

  // Category 4: Videos (if any remaining)
  const videoResources = resources.filter(
    r =>
      r.type === 'video' &&
      !artResources.includes(r) &&
      !setupResources.includes(r) &&
      !effectsResources.includes(r)
  )
  if (videoResources.length > 0) {
    categories.push({
      id: 'videos',
      title: 'Video Demonstrations',
      titleZh: '视频演示',
      description: 'Dynamic experimental recordings',
      descriptionZh: '动态实验记录',
      icon: <Play className="w-5 h-5" />,
      resources: videoResources,
    })
  }

  return categories
}

interface RealExperimentMicroGalleryProps {
  /** Related module IDs to filter resources */
  relatedModules: string[]
  /** Optional title override */
  title?: string
  /** Maximum number of items to show initially */
  initialShowCount?: number
  /** Include cultural creations (art) */
  includeCulturalArt?: boolean
  /** Layout mode: 'grid' (default) or 'hybrid' (featured + carousels) */
  layoutMode?: 'grid' | 'hybrid'
  /** Number of featured items to show in hybrid mode */
  featuredCount?: number
}

export function RealExperimentMicroGallery({
  relatedModules,
  title,
  initialShowCount = 6,
  includeCulturalArt = false,
  layoutMode = 'grid',
  featuredCount = 3,
}: RealExperimentMicroGalleryProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  // State
  const [selectedResource, setSelectedResource] = useState<PolarizationResource | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Filter resources by related modules
  const experimentResources = relatedModules.flatMap(module =>
    getResourcesByModule(module)
  )

  // Optionally include cultural art
  const culturalResources = includeCulturalArt
    ? getMediaByTag('chromatic-polarization').map(media => ({
        ...media,
        // Convert CulturalMedia to PolarizationResource-compatible format
        url: media.path,
        thumbnail: media.thumbnail || media.path,
        category: 'art' as const,
        relatedModules: media.tags || [],
        metadata: {
          polarizationSystem: media.polarizationSystem,
        },
      } as unknown as PolarizationResource))
    : []

  // Combine and deduplicate
  const allResources = [...experimentResources, ...culturalResources].filter(
    (resource, index, self) =>
      index === self.findIndex(r => r.id === resource.id)
  )

  // Categorize resources for hybrid layout
  const categorizedResources = categorizeResources(allResources)

  // Select featured items (highest quality/most representative)
  const featuredResources = allResources
    .filter(r => r.type === 'video' || r.category === 'art')
    .slice(0, featuredCount)

  // Limit display count for grid mode
  const displayResources = showAll
    ? allResources
    : allResources.slice(0, initialShowCount)

  if (allResources.length === 0) {
    return null // Don't show if no related resources
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? allResources.length - 1 : prev - 1))
    setSelectedResource(allResources[currentIndex === 0 ? allResources.length - 1 : currentIndex - 1])
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === allResources.length - 1 ? 0 : prev + 1))
    setSelectedResource(allResources[currentIndex === allResources.length - 1 ? 0 : currentIndex + 1])
  }

  const handleResourceClick = (resource: PolarizationResource, index: number) => {
    setSelectedResource(resource)
    setCurrentIndex(index)
  }

  return (
    <div className="mt-12 border-t border-cyan-500/20 pt-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 text-cyan-400">
          <Sparkles className="w-5 h-5" />
          <h3 className="text-xl font-bold">
            {title || (isZh ? '真实实验场景' : 'Real Experiments')}
          </h3>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/30 to-transparent" />
      </div>

      {/* Description */}
      <p className="text-slate-400 text-sm mb-8">
        {isZh
          ? '以下是与当前演示相关的真实实验照片和视频。点击查看详细的偏振系统对比。'
          : 'Real experiment photos and videos related to this demo. Click to view detailed polarization system comparisons.'}
      </p>

      {/* Conditional Layout Rendering */}
      {layoutMode === 'hybrid' ? (
        // Hybrid Layout: Featured + Categorized Carousels
        <div className="space-y-12">
          {/* Featured Section */}
          {featuredResources.length > 0 && (
            <section>
              <h4 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                {isZh ? '精选实验' : 'Featured'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredResources.map((resource, index) => (
                  <FeaturedCard
                    key={resource.id}
                    resource={resource}
                    onClick={() => handleResourceClick(resource, index)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Categorized Carousels */}
          {categorizedResources.map(category => (
            <CategoryCarousel
              key={category.id}
              title={category.title}
              titleZh={category.titleZh}
              description={category.description}
              descriptionZh={category.descriptionZh}
              icon={category.icon}
              count={category.resources.length}
              itemsPerView={5}
              gap={16}
            >
              {category.resources.map((resource) => (
                <ResourceThumbnail
                  key={resource.id}
                  resource={resource}
                  onClick={() => handleResourceClick(resource, allResources.indexOf(resource))}
                />
              ))}
            </CategoryCarousel>
          ))}
        </div>
      ) : (
        // Grid Layout (Original)
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
            {displayResources.map((resource, index) => (
              <ResourceThumbnail
                key={resource.id}
                resource={resource}
                onClick={() => handleResourceClick(resource, index)}
              />
            ))}
          </div>

          {/* Show More Button */}
          {allResources.length > initialShowCount && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="w-full py-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors
                         border border-cyan-500/30 rounded-lg hover:bg-cyan-500/5"
            >
              {isZh
                ? `显示更多 (${allResources.length - initialShowCount} 项)`
                : `Show More (${allResources.length - initialShowCount} items)`}
            </button>
          )}
        </>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedResource && (
          <ResourceDetailModal
            resource={selectedResource}
            onClose={() => setSelectedResource(null)}
            onPrevious={handlePrevious}
            onNext={handleNext}
            currentIndex={currentIndex}
            totalCount={allResources.length}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ===== Sub-components =====

interface FeaturedCardProps {
  resource: PolarizationResource
  onClick: () => void
}

function FeaturedCard({ resource, onClick }: FeaturedCardProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const isVideo = resource.type === 'video'

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-800
                 border border-slate-700 hover:border-cyan-500/50 transition-all group"
    >
      {/* Thumbnail Image */}
      <img
        src={resource.thumbnail || resource.url}
        alt={isZh ? resource.titleZh : resource.title}
        className="w-full h-full object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent">
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h4 className="text-white text-lg font-semibold mb-2">
            {isZh ? resource.titleZh : resource.title}
          </h4>
          <p className="text-slate-300 text-sm line-clamp-2">
            {isZh ? resource.descriptionZh : resource.description}
          </p>
        </div>
      </div>

      {/* Type Badge */}
      <div className="absolute top-4 right-4">
        {isVideo && (
          <div className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2">
            <Play className="w-4 h-4" />
            {isZh ? '视频' : 'Video'}
          </div>
        )}
        {resource.category === 'art' && (
          <div className="bg-purple-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2">
            <Palette className="w-4 h-4" />
            {isZh ? '艺术' : 'Art'}
          </div>
        )}
      </div>

      {/* View Icon */}
      <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-black/50 backdrop-blur-sm p-2 rounded-lg">
          <Eye className="w-5 h-5 text-white" />
        </div>
      </div>
    </motion.button>
  )
}

interface ResourceThumbnailProps {
  resource: PolarizationResource
  onClick: () => void
}

function ResourceThumbnail({ resource, onClick }: ResourceThumbnailProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const isVideo = resource.type === 'video'
  const isSequence = resource.type === 'sequence'

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative aspect-square rounded-lg overflow-hidden bg-slate-800
                 border border-slate-700 hover:border-cyan-500/50 transition-all group"
    >
      {/* Thumbnail Image */}
      <img
        src={resource.thumbnail || resource.url}
        alt={isZh ? resource.titleZh : resource.title}
        className="w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <p className="text-white text-xs font-medium line-clamp-2">
            {isZh ? resource.titleZh : resource.title}
          </p>
        </div>
      </div>

      {/* Type Badge */}
      <div className="absolute top-2 right-2">
        {isVideo && (
          <div className="bg-red-500/90 text-white px-2 py-0.5 rounded text-xs flex items-center gap-1">
            <Play className="w-3 h-3" />
            Video
          </div>
        )}
        {isSequence && (
          <div className="bg-purple-500/90 text-white px-2 py-0.5 rounded text-xs">
            {resource.frames?.length || 0} {isZh ? '帧' : 'Frames'}
          </div>
        )}
      </div>

      {/* View Icon */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Eye className="w-4 h-4 text-white drop-shadow-lg" />
      </div>
    </motion.button>
  )
}

interface ResourceDetailModalProps {
  resource: PolarizationResource
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
  currentIndex: number
  totalCount: number
}

function ResourceDetailModal({
  resource,
  onClose,
  onPrevious,
  onNext,
  currentIndex,
  totalCount,
}: ResourceDetailModalProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  // Check if resource has view pairs (parallel/crossed)
  const hasViewPairs = resource.views && (resource.views.parallel || resource.views.crossed)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 rounded-xl border border-slate-700 max-w-5xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white">
              {isZh ? resource.titleZh : resource.title}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {isZh ? resource.descriptionZh : resource.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {hasViewPairs ? (
            // Triple View Toggle for resources with view pairs
            <TripleViewToggle resource={resource} />
          ) : (
            // Single view for resources without view pairs
            <div className="p-6">
              {resource.type === 'video' ? (
                <video
                  src={resource.url}
                  controls
                  className="w-full rounded-lg"
                  poster={resource.thumbnail}
                />
              ) : resource.type === 'sequence' && resource.frames ? (
                <SequenceViewer frames={resource.frames} />
              ) : (
                <img
                  src={resource.url}
                  alt={isZh ? resource.titleZh : resource.title}
                  className="w-full rounded-lg"
                />
              )}

              {/* Metadata */}
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">{isZh ? '类别' : 'Category'}:</span>{' '}
                  <span className="text-white">{resource.category}</span>
                </div>
                {resource.metadata.material && (
                  <div>
                    <span className="text-slate-400">{isZh ? '材质' : 'Material'}:</span>{' '}
                    <span className="text-white">{resource.metadata.material}</span>
                  </div>
                )}
                {resource.metadata.polarizationSystem && (
                  <div>
                    <span className="text-slate-400">{isZh ? '偏振系统' : 'Polarization'}:</span>{' '}
                    <span className="text-white">{resource.metadata.polarizationSystem}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {totalCount > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-700">
            <button
              onClick={onPrevious}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700
                       rounded-lg transition-colors text-white"
            >
              <ChevronLeft className="w-4 h-4" />
              {isZh ? '上一个' : 'Previous'}
            </button>

            <span className="text-sm text-slate-400">
              {currentIndex + 1} / {totalCount}
            </span>

            <button
              onClick={onNext}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700
                       rounded-lg transition-colors text-white"
            >
              {isZh ? '下一个' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

interface SequenceViewerProps {
  frames: Array<{ time: number; label: string; labelZh: string; url: string }>
}

function SequenceViewer({ frames }: SequenceViewerProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const [currentFrame, setCurrentFrame] = useState(0)

  return (
    <div>
      <img
        src={frames[currentFrame].url}
        alt={isZh ? frames[currentFrame].labelZh : frames[currentFrame].label}
        className="w-full rounded-lg"
      />

      {/* Frame Selector */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">
            {isZh ? frames[currentFrame].labelZh : frames[currentFrame].label}
          </span>
          <span className="text-xs text-slate-500">
            {currentFrame + 1} / {frames.length}
          </span>
        </div>

        <div className="flex gap-2">
          {frames.map((frame, index) => (
            <button
              key={index}
              onClick={() => setCurrentFrame(index)}
              className={`flex-1 py-2 rounded text-xs transition-colors ${
                currentFrame === index
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {isZh ? frame.labelZh : frame.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
