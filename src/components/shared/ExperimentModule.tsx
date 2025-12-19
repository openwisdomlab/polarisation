/**
 * ExperimentModule - 统一的实验资源展示模块
 *
 * 设计目标:
 * - 提供一致的实验资源展示体验
 * - 支持多种显示模式（紧凑、画廊、序列、对比）
 * - 可嵌入任何模块（demos, timeline, optical-studio）
 * - 智能推荐相关资源
 *
 * 使用方式:
 * 1. 按资源组展示: <ExperimentModule groupId="glass-stress-series" />
 * 2. 按模块展示: <ExperimentModule moduleId="stress-analysis" />
 * 3. 自定义资源: <ExperimentModule resourceIds={['glass-heating-cooling', 'tempered-glass']} />
 */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  Camera,
  Film,
  Play,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Beaker,
  Layers,
  Grid3X3,
  ArrowLeftRight,
  ExternalLink,
} from 'lucide-react'
import {
  getResourceById,
  type PolarizationResource,
} from '@/data/resource-gallery'
import {
  getResourceGroupWithData,
  getModuleResources,
  getResourceVideos,
  type ResourceGroup,
  type VideoResource,
  type ModuleType,
} from '@/data/resource-registry'

// ===== Types =====

export type DisplayMode = 'compact' | 'gallery' | 'sequence' | 'comparison' | 'full'

export interface ExperimentModuleProps {
  // 资源来源（三选一）
  groupId?: string           // 使用预定义资源组
  moduleId?: ModuleType      // 使用模块关联资源
  resourceIds?: string[]     // 自定义资源ID列表
  videoIds?: string[]        // 自定义视频ID列表

  // 显示配置
  mode?: DisplayMode
  title?: string
  titleZh?: string
  showVideos?: boolean
  showRelatedModules?: boolean
  maxImages?: number
  className?: string

  // 回调
  onResourceClick?: (resource: PolarizationResource) => void
  onVideoClick?: (video: VideoResource) => void
  onModuleClick?: (moduleId: string) => void
}

// ===== Component =====

export function ExperimentModule({
  groupId,
  moduleId,
  resourceIds,
  videoIds: _videoIds,
  mode = 'gallery',
  title,
  titleZh: _titleZh,
  showVideos = true,
  showRelatedModules = true,
  maxImages,
  className,
  onResourceClick,
  onVideoClick,
  onModuleClick,
}: ExperimentModuleProps) {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images')
  const [showLightbox, setShowLightbox] = useState(false)
  const [isExpanded, setIsExpanded] = useState(mode !== 'compact')

  // 解析资源数据
  const { resources, videos, group: _group, displayTitle, relatedModules } = useMemo(() => {
    let resources: PolarizationResource[] = []
    let videos: VideoResource[] = []
    let group: ResourceGroup | null = null
    let relatedModules: string[] = []

    if (groupId) {
      const data = getResourceGroupWithData(groupId)
      if (data) {
        resources = data.resources
        videos = data.videos
        group = data.group
        relatedModules = [...new Set(resources.flatMap(r => r.relatedModules))]
      }
    } else if (moduleId) {
      const data = getModuleResources(moduleId)
      resources = data.images
      videos = data.videos
    } else if (resourceIds) {
      resources = resourceIds
        .map(id => getResourceById(id))
        .filter((r): r is PolarizationResource => r !== undefined)
      // 收集所有关联视频
      videos = [...new Set(resources.flatMap(r => getResourceVideos(r.id)))]
      relatedModules = [...new Set(resources.flatMap(r => r.relatedModules))]
    }

    // 限制图片数量
    if (maxImages && resources.length > maxImages) {
      resources = resources.slice(0, maxImages)
    }

    const displayTitle = title || (group ? (isZh ? group.titleZh : group.title) : undefined)

    return { resources, videos, group, displayTitle, relatedModules }
  }, [groupId, moduleId, resourceIds, maxImages, title, isZh])

  if (resources.length === 0 && videos.length === 0) {
    return null
  }

  const hasVideos = showVideos && videos.length > 0
  const currentResource = resources[selectedIndex]

  // ===== Compact Mode =====
  if (mode === 'compact') {
    return (
      <CompactView
        resources={resources}
        videos={videos}
        isZh={isZh}
        theme={theme}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        displayTitle={displayTitle}
        className={className}
      />
    )
  }

  // ===== Sequence Mode =====
  if (mode === 'sequence') {
    return (
      <SequenceView
        resources={resources}
        videos={videos}
        isZh={isZh}
        theme={theme}
        displayTitle={displayTitle}
        showVideos={showVideos}
        className={className}
      />
    )
  }

  // ===== Comparison Mode =====
  if (mode === 'comparison' && resources.length >= 2) {
    return (
      <ComparisonView
        resources={resources}
        isZh={isZh}
        theme={theme}
        displayTitle={displayTitle}
        className={className}
      />
    )
  }

  // ===== Gallery / Full Mode =====
  return (
    <motion.div
      className={cn(
        'rounded-xl border overflow-hidden',
        theme === 'dark'
          ? 'bg-gradient-to-br from-cyan-950/40 via-slate-900/60 to-purple-950/40 border-cyan-700/40'
          : 'bg-gradient-to-br from-cyan-50/80 via-white to-purple-50/80 border-cyan-200/80',
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className={cn(
        'flex items-center justify-between px-4 py-3 border-b',
        theme === 'dark' ? 'border-cyan-800/50 bg-black/20' : 'border-cyan-200 bg-white/50'
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-2 rounded-lg',
            theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-100'
          )}>
            <Beaker className={cn(
              'w-5 h-5',
              theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
            )} />
          </div>
          <div>
            <h4 className={cn(
              'text-sm font-semibold',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {displayTitle || (isZh ? '实验资源' : 'Experimental Resources')}
            </h4>
            <p className={cn(
              'text-xs',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              {resources.length} {isZh ? '张图片' : 'images'}{hasVideos ? ` · ${videos.length} ${isZh ? '个视频' : 'videos'}` : ''}
            </p>
          </div>
        </div>

        {/* Mode indicator */}
        <div className={cn(
          'flex items-center gap-1 px-2 py-1 rounded-full text-xs',
          theme === 'dark' ? 'bg-slate-700/50 text-gray-400' : 'bg-gray-100 text-gray-500'
        )}>
          {mode === 'gallery' && <Grid3X3 className="w-3 h-3" />}
          {mode === 'full' && <Layers className="w-3 h-3" />}
          {mode === 'comparison' && <ArrowLeftRight className="w-3 h-3" />}
          <span className="ml-1 capitalize">{mode}</span>
        </div>
      </div>

      {/* Tab Switcher */}
      {hasVideos && (
        <div className={cn(
          'flex gap-2 px-4 py-2 border-b',
          theme === 'dark' ? 'border-cyan-800/30' : 'border-cyan-200/50'
        )}>
          <TabButton
            active={activeTab === 'images'}
            onClick={() => setActiveTab('images')}
            icon={<Camera className="w-4 h-4" />}
            label={isZh ? '图片' : 'Images'}
            count={resources.length}
            theme={theme}
            color="cyan"
          />
          <TabButton
            active={activeTab === 'videos'}
            onClick={() => setActiveTab('videos')}
            icon={<Film className="w-4 h-4" />}
            label={isZh ? '视频' : 'Videos'}
            count={videos.length}
            theme={theme}
            color="purple"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'images' ? (
            <motion.div
              key="images"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              {/* Main Image */}
              <div
                className={cn(
                  'relative rounded-xl overflow-hidden mb-3 cursor-pointer group',
                  theme === 'dark' ? 'bg-black/40' : 'bg-gray-100'
                )}
                onClick={() => {
                  onResourceClick?.(currentResource)
                  setShowLightbox(true)
                }}
              >
                <motion.img
                  key={selectedIndex}
                  src={currentResource.url}
                  alt={isZh ? currentResource.titleZh : currentResource.title}
                  className="w-full h-64 object-contain"
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                />
                {/* Hover overlay */}
                <div className={cn(
                  'absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity',
                  theme === 'dark' ? 'bg-black/30' : 'bg-white/30'
                )}>
                  <Maximize2 className={cn(
                    'w-8 h-8',
                    theme === 'dark' ? 'text-white' : 'text-gray-700'
                  )} />
                </div>
                {/* Navigation */}
                {resources.length > 1 && (
                  <>
                    <NavButton
                      direction="left"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedIndex(i => (i - 1 + resources.length) % resources.length)
                      }}
                      theme={theme}
                    />
                    <NavButton
                      direction="right"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedIndex(i => (i + 1) % resources.length)
                      }}
                      theme={theme}
                    />
                  </>
                )}
                {/* Counter */}
                <div className={cn(
                  'absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium',
                  'bg-black/60 text-white'
                )}>
                  {selectedIndex + 1} / {resources.length}
                </div>
                {/* Caption */}
                {(currentResource.description || currentResource.descriptionZh) && (
                  <div className={cn(
                    'absolute bottom-0 left-0 right-0 px-4 py-3',
                    'bg-gradient-to-t from-black/80 to-transparent'
                  )}>
                    <p className="text-sm text-white">
                      {isZh ? currentResource.descriptionZh : currentResource.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {resources.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {resources.map((resource, i) => (
                    <motion.button
                      key={resource.id}
                      onClick={() => setSelectedIndex(i)}
                      className={cn(
                        'flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all',
                        selectedIndex === i
                          ? theme === 'dark'
                            ? 'border-cyan-400 ring-2 ring-cyan-400/30'
                            : 'border-cyan-500 ring-2 ring-cyan-500/30'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={resource.thumbnail || resource.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="videos"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <VideoGallery
                videos={videos}
                isZh={isZh}
                theme={theme}
                onVideoClick={onVideoClick}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Related Modules */}
        {showRelatedModules && relatedModules.length > 0 && (
          <div className={cn(
            'mt-4 pt-4 border-t',
            theme === 'dark' ? 'border-slate-700/50' : 'border-gray-200'
          )}>
            <p className={cn(
              'text-xs mb-2',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              {isZh ? '相关学习模块：' : 'Related Modules:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {relatedModules.slice(0, 5).map(mod => (
                <motion.button
                  key={mod}
                  onClick={() => onModuleClick?.(mod)}
                  className={cn(
                    'px-2 py-1 text-xs rounded-full flex items-center gap-1 transition-colors',
                    theme === 'dark'
                      ? 'bg-slate-700/50 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400'
                      : 'bg-gray-100 text-gray-600 hover:bg-cyan-100 hover:text-cyan-700'
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {mod}
                  <ExternalLink className="w-3 h-3" />
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox
        isOpen={showLightbox}
        onClose={() => setShowLightbox(false)}
        images={resources.map(r => ({
          url: r.url,
          caption: isZh ? r.titleZh : r.title,
        }))}
        currentIndex={selectedIndex}
        onIndexChange={setSelectedIndex}
      />
    </motion.div>
  )
}

// ===== Sub-components =====

function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
  theme,
  color,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  count: number
  theme: string
  color: 'cyan' | 'purple'
}) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
        active
          ? theme === 'dark'
            ? `bg-${color}-500/20 text-${color}-400 border border-${color}-500/30`
            : `bg-${color}-100 text-${color}-700 border border-${color}-300`
          : theme === 'dark'
            ? 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {icon}
      {label} ({count})
    </motion.button>
  )
}

function NavButton({
  direction,
  onClick,
  theme: _theme,
}: {
  direction: 'left' | 'right'
  onClick: (e: React.MouseEvent) => void
  theme: string
}) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'absolute top-1/2 -translate-y-1/2 p-2 rounded-full',
        'bg-black/50 hover:bg-black/70 text-white transition-colors',
        direction === 'left' ? 'left-2' : 'right-2'
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {direction === 'left' ? (
        <ChevronLeft className="w-5 h-5" />
      ) : (
        <ChevronRight className="w-5 h-5" />
      )}
    </motion.button>
  )
}

function VideoGallery({
  videos,
  isZh,
  theme,
  onVideoClick,
}: {
  videos: VideoResource[]
  isZh: boolean
  theme: string
  onVideoClick?: (video: VideoResource) => void
}) {
  const [selectedVideo, setSelectedVideo] = useState(0)
  const video = videos[selectedVideo]

  if (videos.length === 0) return null

  return (
    <div>
      {/* Main Video */}
      <div className={cn(
        'relative rounded-xl overflow-hidden mb-3',
        'bg-black'
      )}>
        <video
          key={video.id}
          src={video.url}
          className="w-full h-64 object-contain bg-black"
          controls
          preload="metadata"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Video Info */}
      <div className={cn(
        'px-3 py-2 rounded-lg mb-3',
        theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-100'
      )}>
        <h5 className={cn(
          'text-sm font-medium mb-1',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {isZh ? video.titleZh : video.title}
        </h5>
        <p className={cn(
          'text-xs',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}>
          {isZh ? video.descriptionZh : video.description}
        </p>
      </div>

      {/* Video List */}
      {videos.length > 1 && (
        <div className="grid grid-cols-2 gap-2">
          {videos.map((v, i) => (
            <motion.button
              key={v.id}
              onClick={() => {
                setSelectedVideo(i)
                onVideoClick?.(v)
              }}
              className={cn(
                'p-2 rounded-lg text-left transition-all flex items-start gap-2',
                selectedVideo === i
                  ? theme === 'dark'
                    ? 'bg-purple-500/20 border border-purple-500/30'
                    : 'bg-purple-100 border border-purple-300'
                  : theme === 'dark'
                    ? 'bg-slate-800/30 hover:bg-slate-700/50'
                    : 'bg-gray-50 hover:bg-gray-100'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className={cn(
                'w-4 h-4 flex-shrink-0 mt-0.5',
                selectedVideo === i
                  ? theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                  : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              )} />
              <span className={cn(
                'text-xs line-clamp-2',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              )}>
                {isZh ? v.titleZh : v.title}
              </span>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  )
}

function CompactView({
  resources,
  videos,
  isZh,
  theme,
  isExpanded,
  setIsExpanded,
  displayTitle,
  className,
}: {
  resources: PolarizationResource[]
  videos: VideoResource[]
  isZh: boolean
  theme: string
  isExpanded: boolean
  setIsExpanded: (v: boolean) => void
  displayTitle?: string
  className?: string
}) {
  const previewImage = resources[0]

  return (
    <motion.div
      className={cn(
        'rounded-xl border overflow-hidden cursor-pointer',
        theme === 'dark'
          ? 'bg-gradient-to-br from-cyan-950/30 to-slate-900/50 border-cyan-700/30'
          : 'bg-gradient-to-br from-cyan-50 to-white border-cyan-200',
        className
      )}
      onClick={() => setIsExpanded(!isExpanded)}
      whileHover={{ scale: 1.01 }}
    >
      {/* Preview */}
      {!isExpanded && previewImage && (
        <div className="relative h-20 overflow-hidden">
          <img
            src={previewImage.thumbnail || previewImage.url}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className={cn(
            'absolute inset-0',
            theme === 'dark'
              ? 'bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent'
              : 'bg-gradient-to-t from-white via-white/60 to-transparent'
          )} />
          {/* Badges */}
          <div className="absolute top-2 right-2 flex gap-1">
            <span className={cn(
              'px-1.5 py-0.5 rounded text-xs font-medium',
              'bg-black/60 text-white'
            )}>
              {resources.length} <Camera className="w-3 h-3 inline" />
            </span>
            {videos.length > 0 && (
              <span className={cn(
                'px-1.5 py-0.5 rounded text-xs font-medium',
                'bg-purple-500/80 text-white'
              )}>
                {videos.length} <Film className="w-3 h-3 inline" />
              </span>
            )}
          </div>
        </div>
      )}
      {/* Info bar */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <Camera className={cn(
            'w-4 h-4',
            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
          )} />
          <span className={cn(
            'text-sm font-medium',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {displayTitle || (isZh ? '实验资源' : 'Resources')}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
        >
          <ChevronRight className={cn(
            'w-4 h-4',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )} />
        </motion.div>
      </div>
    </motion.div>
  )
}

function SequenceView({
  resources,
  videos: _videos,
  isZh,
  theme,
  displayTitle,
  showVideos: _showVideos,
  className,
}: {
  resources: PolarizationResource[]
  videos: VideoResource[]
  isZh: boolean
  theme: string
  displayTitle?: string
  showVideos: boolean
  className?: string
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [_isPlaying, _setIsPlaying] = useState(false)

  return (
    <motion.div
      className={cn(
        'rounded-xl border overflow-hidden',
        theme === 'dark'
          ? 'bg-gradient-to-br from-cyan-950/40 to-slate-900/60 border-cyan-700/40'
          : 'bg-gradient-to-br from-cyan-50 to-white border-cyan-200',
        className
      )}
    >
      {/* Header */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-3 border-b',
        theme === 'dark' ? 'border-cyan-800/30' : 'border-cyan-200'
      )}>
        <Layers className={cn('w-5 h-5', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />
        <span className={cn('font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
          {displayTitle || (isZh ? '序列播放' : 'Sequence Player')}
        </span>
      </div>

      <div className="p-4">
        {/* Main Image */}
        <div className={cn(
          'relative rounded-xl overflow-hidden mb-4',
          theme === 'dark' ? 'bg-black/40' : 'bg-gray-100'
        )}>
          <motion.img
            key={currentIndex}
            src={resources[currentIndex]?.url}
            alt=""
            className="w-full h-56 object-contain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
          {/* Title overlay */}
          <div className={cn(
            'absolute top-3 left-3 px-3 py-1.5 rounded-lg text-sm',
            'bg-black/70 text-white'
          )}>
            {isZh
              ? resources[currentIndex]?.titleZh
              : resources[currentIndex]?.title
            }
          </div>
        </div>

        {/* Timeline / Progress */}
        <div className="relative mb-4">
          <div className={cn(
            'h-2 rounded-full overflow-hidden',
            theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
          )}>
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentIndex + 1) / resources.length) * 100}%` }}
            />
          </div>
          {/* Progress markers */}
          <div className="flex justify-between mt-2">
            {resources.map((r, i) => (
              <button
                key={r.id}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  i === currentIndex
                    ? 'w-4 bg-cyan-500'
                    : i < currentIndex
                      ? theme === 'dark' ? 'bg-cyan-600' : 'bg-cyan-400'
                      : theme === 'dark' ? 'bg-slate-600' : 'bg-gray-300'
                )}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <motion.button
            onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className={cn(
              'p-2 rounded-full transition-colors',
              currentIndex === 0
                ? 'opacity-50 cursor-not-allowed'
                : theme === 'dark'
                  ? 'hover:bg-slate-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-600'
            )}
            whileHover={currentIndex > 0 ? { scale: 1.1 } : {}}
            whileTap={currentIndex > 0 ? { scale: 0.9 } : {}}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          <span className={cn(
            'text-sm font-medium min-w-[60px] text-center',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {currentIndex + 1} / {resources.length}
          </span>

          <motion.button
            onClick={() => setCurrentIndex(i => Math.min(resources.length - 1, i + 1))}
            disabled={currentIndex === resources.length - 1}
            className={cn(
              'p-2 rounded-full transition-colors',
              currentIndex === resources.length - 1
                ? 'opacity-50 cursor-not-allowed'
                : theme === 'dark'
                  ? 'hover:bg-slate-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-600'
            )}
            whileHover={currentIndex < resources.length - 1 ? { scale: 1.1 } : {}}
            whileTap={currentIndex < resources.length - 1 ? { scale: 0.9 } : {}}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

function ComparisonView({
  resources,
  isZh,
  theme,
  displayTitle,
  className,
}: {
  resources: PolarizationResource[]
  isZh: boolean
  theme: string
  displayTitle?: string
  className?: string
}) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const left = resources[0]
  const right = resources[1]

  return (
    <motion.div
      className={cn(
        'rounded-xl border overflow-hidden',
        theme === 'dark'
          ? 'bg-gradient-to-br from-cyan-950/40 to-slate-900/60 border-cyan-700/40'
          : 'bg-gradient-to-br from-cyan-50 to-white border-cyan-200',
        className
      )}
    >
      {/* Header */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-3 border-b',
        theme === 'dark' ? 'border-cyan-800/30' : 'border-cyan-200'
      )}>
        <ArrowLeftRight className={cn('w-5 h-5', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />
        <span className={cn('font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
          {displayTitle || (isZh ? '对比查看' : 'Comparison View')}
        </span>
      </div>

      <div className="p-4">
        {/* Comparison Slider */}
        <div className="relative h-56 rounded-xl overflow-hidden">
          {/* Right Image (full) */}
          <img
            src={right.url}
            alt={isZh ? right.titleZh : right.title}
            className="absolute inset-0 w-full h-full object-contain"
          />
          {/* Left Image (clipped) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={left.url}
              alt={isZh ? left.titleZh : left.title}
              className="w-full h-full object-contain"
              style={{ width: `${10000 / sliderPosition}%`, maxWidth: 'none' }}
            />
          </div>
          {/* Slider Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
              <ArrowLeftRight className="w-4 h-4 text-gray-600" />
            </div>
          </div>
          {/* Input Range */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
          />
          {/* Labels */}
          <div className={cn(
            'absolute bottom-3 left-3 px-2 py-1 rounded text-xs',
            'bg-black/70 text-white'
          )}>
            {isZh ? left.titleZh : left.title}
          </div>
          <div className={cn(
            'absolute bottom-3 right-3 px-2 py-1 rounded text-xs',
            'bg-black/70 text-white'
          )}>
            {isZh ? right.titleZh : right.title}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function Lightbox({
  isOpen,
  onClose,
  images,
  currentIndex,
  onIndexChange,
}: {
  isOpen: boolean
  onClose: () => void
  images: { url: string; caption?: string }[]
  currentIndex: number
  onIndexChange: (index: number) => void
}) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white hover:text-gray-300"
        >
          <X className="w-6 h-6" />
        </button>

        <motion.img
          key={currentIndex}
          src={images[currentIndex].url}
          alt={images[currentIndex].caption}
          className="max-w-[90vw] max-h-[90vh] object-contain"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={(e) => e.stopPropagation()}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onIndexChange((currentIndex - 1 + images.length) % images.length)
              }}
              className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onIndexChange((currentIndex + 1) % images.length)
              }}
              className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        {images[currentIndex].caption && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/70 rounded-lg text-white text-sm max-w-lg text-center">
            {images[currentIndex].caption}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default ExperimentModule
