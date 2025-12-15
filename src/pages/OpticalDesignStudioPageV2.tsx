/**
 * Optical Design Studio V2 - 光学设计室 V2
 *
 * Completely redesigned with:
 * - Clean three-column layout
 * - Unified toolbar header
 * - Collapsible left/right panels
 * - Bottom status bar with hints and formulas
 * - Better visual hierarchy
 * - Improved interaction patterns
 */

import { useState, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { useOpticalBenchStore } from '@/stores/opticalBenchStore'
import type { Device } from '@/data'

// Import redesigned components
import {
  OpticalCanvas,
  TutorialOverlay,
  PrinciplesPanel,
  useKeyboardShortcuts,
} from '@/components/optical-studio'
import { UnifiedToolbar } from '@/components/optical-studio/UnifiedToolbar'
import { LeftPanel } from '@/components/optical-studio/LeftPanel'
import { RightPanel } from '@/components/optical-studio/RightPanel'
import { StatusBar } from '@/components/optical-studio/StatusBar'

// ============================================
// Main Page Component
// ============================================

export function OpticalDesignStudioPageV2() {
  const { theme } = useTheme()

  // Panel states
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false)
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)

  // Store
  const {
    loadSavedDesigns,
    currentTutorial,
    selectedComponentId,
  } = useOpticalBenchStore()

  // Load saved designs on mount
  useEffect(() => {
    loadSavedDesigns()
  }, [loadSavedDesigns])

  // Auto-expand right panel when component is selected
  useEffect(() => {
    if (selectedComponentId && rightPanelCollapsed) {
      setRightPanelCollapsed(false)
    }
  }, [selectedComponentId])

  // Keyboard shortcuts
  useKeyboardShortcuts({
    enabled: true,
    onEscape: () => {
      if (selectedDevice) {
        setSelectedDevice(null)
      }
    },
  })

  return (
    <div className={cn(
      'h-screen flex flex-col overflow-hidden',
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
        : 'bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#f0f9ff]'
    )}>
      {/* Unified Header Toolbar */}
      <UnifiedToolbar />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Toolbox */}
        <LeftPanel
          collapsed={leftPanelCollapsed}
          onToggleCollapse={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
        />

        {/* Main Canvas Area */}
        <main className="flex-1 relative flex flex-col overflow-hidden">
          {/* Floating Principles Panel */}
          <PrinciplesPanel />

          {/* Canvas Container */}
          <div className="flex-1 relative">
            <OpticalCanvas />
          </div>
        </main>

        {/* Right Panel - Properties & Info */}
        <RightPanel
          collapsed={rightPanelCollapsed}
          onToggleCollapse={() => setRightPanelCollapsed(!rightPanelCollapsed)}
          selectedDevice={selectedDevice}
          onCloseDevice={() => setSelectedDevice(null)}
        />
      </div>

      {/* Bottom Status Bar */}
      <StatusBar />

      {/* Tutorial Overlay (when active) */}
      {currentTutorial && <TutorialOverlay />}
    </div>
  )
}

export default OpticalDesignStudioPageV2
