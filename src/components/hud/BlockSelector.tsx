import { useTranslation } from 'react-i18next'
import { useGameStore } from '@/stores/gameStore'
import { BlockType } from '@/core/types'
import { cn } from '@/lib/utils'

const BLOCK_TYPES: Array<{
  type: BlockType
  key: string
  icon: string
  labelKey: string
}> = [
  { type: 'emitter', key: '1', icon: '💡', labelKey: 'game.blocks.emitter' },
  { type: 'polarizer', key: '2', icon: '▤', labelKey: 'game.blocks.polarizer' },
  { type: 'rotator', key: '3', icon: '↻', labelKey: 'game.blocks.rotator' },
  { type: 'splitter', key: '4', icon: '◇', labelKey: 'game.blocks.splitter' },
  { type: 'sensor', key: '5', icon: '◎', labelKey: 'game.blocks.sensor' },
  { type: 'mirror', key: '6', icon: '▯', labelKey: 'game.blocks.mirror' },
  { type: 'solid', key: '7', icon: '■', labelKey: 'game.blocks.solid' },
]

export function BlockSelector() {
  const { t } = useTranslation()
  const { selectedBlockType, setSelectedBlockType } = useGameStore()

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 bg-black/80 p-3 rounded-xl border border-cyan-400/30">
      {BLOCK_TYPES.map(({ type, key, icon, labelKey }) => (
        <button
          key={type}
          onClick={() => setSelectedBlockType(type)}
          className={cn(
            "relative w-14 h-14 flex flex-col items-center justify-center",
            "bg-slate-700/60 border-2 border-slate-600/50 rounded-lg",
            "transition-all duration-200 cursor-pointer",
            "hover:border-cyan-400/80 hover:bg-slate-600/80",
            selectedBlockType === type && "border-cyan-400 shadow-[0_0_15px_rgba(100,200,255,0.5)]"
          )}
        >
          <span className="absolute top-0.5 left-1 text-[10px] text-gray-500">
            {key}
          </span>
          <span className="text-2xl mb-0.5">{icon}</span>
          <span className="text-[9px] text-gray-400">{t(labelKey)}</span>
        </button>
      ))}
    </div>
  )
}
