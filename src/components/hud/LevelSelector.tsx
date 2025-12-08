import { useTranslation } from 'react-i18next'
import { useGameStore } from '@/stores/gameStore'
import { TUTORIAL_LEVELS } from '@/core/World'
import { cn } from '@/lib/utils'

export function LevelSelector() {
  const { t } = useTranslation()
  const { currentLevelIndex, loadLevel } = useGameStore()

  return (
    <div className="flex gap-1.5">
      {TUTORIAL_LEVELS.map((_, index) => (
        <button
          key={index}
          onClick={() => loadLevel(index)}
          className={cn(
            "w-8 h-8 rounded-lg text-xs font-medium transition-all",
            "border",
            currentLevelIndex === index
              ? "bg-cyan-400/20 border-cyan-400 text-cyan-400"
              : "bg-slate-800/50 border-slate-600/50 text-gray-400 hover:border-cyan-400/50 hover:text-gray-200"
          )}
          title={t(`game.tutorials.${index}.name`)}
        >
          {index + 1}
        </button>
      ))}
      <button
        onClick={() => {
          const { world } = useGameStore.getState()
          if (world) {
            world.clear()
          }
        }}
        className="px-3 h-8 rounded-lg text-xs font-medium transition-all
                   bg-orange-400/20 border border-orange-400/50 text-orange-400
                   hover:bg-orange-400/30 hover:border-orange-400"
        title={t('game.sandboxMode')}
      >
        {t('game.sandbox')}
      </button>
    </div>
  )
}
