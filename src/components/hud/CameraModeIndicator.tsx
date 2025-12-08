import { useTranslation } from 'react-i18next'
import { useGameStore, CameraMode } from '@/stores/gameStore'

const MODE_ICONS: Record<CameraMode, string> = {
  'first-person': '🎮',
  'isometric': '🔷',
  'top-down': '📐',
}

const MODE_KEYS: Record<CameraMode, string> = {
  'first-person': 'game.firstPerson',
  'isometric': 'game.isometric',
  'top-down': 'game.topDown',
}

export function CameraModeIndicator() {
  const { t } = useTranslation()
  const { cameraMode, setCameraMode } = useGameStore()

  const cycleMode = () => {
    const modes: CameraMode[] = ['first-person', 'isometric', 'top-down']
    const currentIndex = modes.indexOf(cameraMode)
    const nextMode = modes[(currentIndex + 1) % modes.length]
    setCameraMode(nextMode)
  }

  return (
    <button
      onClick={cycleMode}
      className="px-4 py-3 rounded-lg text-sm
                 bg-black/70 border border-cyan-400/30 text-gray-300
                 transition-all duration-300 cursor-pointer
                 hover:bg-black/80 hover:border-cyan-400/50"
    >
      {MODE_ICONS[cameraMode]} {t(MODE_KEYS[cameraMode])}
    </button>
  )
}
