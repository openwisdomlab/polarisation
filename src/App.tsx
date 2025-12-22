import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'

// Lazy load all page components for code splitting
const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })))
const GamePage = lazy(() => import('@/pages/GamePage').then(m => ({ default: m.GamePage })))
const Game2DPage = lazy(() => import('@/pages/Game2DPage').then(m => ({ default: m.Game2DPage })))
const DemosPage = lazy(() => import('@/pages/DemosPage').then(m => ({ default: m.DemosPage })))
const HardwarePage = lazy(() => import('@/pages/HardwarePage').then(m => ({ default: m.HardwarePage })))
const CardGamePage = lazy(() => import('@/pages/CardGamePage').then(m => ({ default: m.CardGamePage })))
const MerchandisePage = lazy(() => import('@/pages/MerchandisePage').then(m => ({ default: m.MerchandisePage })))
const GameHubPage = lazy(() => import('@/pages/GameHubPage').then(m => ({ default: m.GameHubPage })))
const EscapeRoomPage = lazy(() => import('@/pages/EscapeRoomPage').then(m => ({ default: m.EscapeRoomPage })))
const ChroniclesPage = lazy(() => import('@/pages/ChroniclesPage').then(m => ({ default: m.ChroniclesPage })))
const LabPage = lazy(() => import('@/pages/LabPage').then(m => ({ default: m.LabPage })))
const OpticalDesignPage = lazy(() => import('@/pages/OpticalDesignPage').then(m => ({ default: m.OpticalDesignPage })))
const OpticalDesignStudioPage = lazy(() => import('@/pages/OpticalDesignStudioPageV2').then(m => ({ default: m.OpticalDesignStudioPageV2 })))
const ApplicationsPage = lazy(() => import('@/pages/ApplicationsPage').then(m => ({ default: m.ApplicationsPage })))
const ExperimentsPage = lazy(() => import('@/pages/ExperimentsPage').then(m => ({ default: m.ExperimentsPage })))
const CalculationWorkshopPage = lazy(() => import('@/pages/CalculationWorkshopPage').then(m => ({ default: m.CalculationWorkshopPage })))
const PoincareSphereViewerPage = lazy(() => import('@/pages/PoincareSphereViewerPage').then(m => ({ default: m.PoincareSphereViewerPage })))
const JonesCalculatorPage = lazy(() => import('@/pages/JonesCalculatorPage').then(m => ({ default: m.JonesCalculatorPage })))
const StokesCalculatorPage = lazy(() => import('@/pages/StokesCalculatorPage').then(m => ({ default: m.StokesCalculatorPage })))
const MuellerCalculatorPage = lazy(() => import('@/pages/MuellerCalculatorPage').then(m => ({ default: m.MuellerCalculatorPage })))
const DetectiveGamePage = lazy(() => import('@/pages/DetectiveGamePage').then(m => ({ default: m.DetectiveGamePage })))
const CoursePage = lazy(() => import('@/pages/CoursePage').then(m => ({ default: m.CoursePage })))

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-slate-400 text-sm">Loading...</span>
      </div>
    </div>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Games Hub - PolarQuest module */}
          <Route path="/games" element={<GameHubPage />} />
          <Route path="/games/2d" element={<Game2DPage />} />
          <Route path="/games/3d" element={<GamePage />} />
          <Route path="/games/card" element={<CardGamePage />} />
          <Route path="/games/escape" element={<EscapeRoomPage />} />
          <Route path="/games/detective" element={<DetectiveGamePage />} />

          {/* Standalone game routes (for backwards compatibility) */}
          <Route path="/game" element={<Navigate to="/games/3d" replace />} />
          <Route path="/game2d" element={<Navigate to="/games/2d" replace />} />
          <Route path="/cardgame" element={<Navigate to="/games/card" replace />} />
          <Route path="/escape" element={<Navigate to="/games/escape" replace />} />

          {/* Other modules - Demos with optional demo ID for deep linking */}
          <Route path="/demos" element={<DemosPage />} />
          <Route path="/demos/:demoId" element={<DemosPage />} />
          <Route path="/hardware" element={<HardwarePage />} />
          <Route path="/merchandise" element={<MerchandisePage />} />
          <Route path="/chronicles" element={<ChroniclesPage />} />
          <Route path="/course" element={<CoursePage />} />
          <Route path="/lab" element={<LabPage />} />

          {/* Optical Design Studio - 光学设计室 (模块化版本) */}
          <Route path="/optical-studio" element={<OpticalDesignPage />} />

          {/* Legacy optical studio route */}
          <Route path="/optical-studio-v2" element={<OpticalDesignStudioPage />} />

          {/* Legacy routes - redirect to merged optical studio */}
          <Route path="/devices" element={<Navigate to="/optical-studio" replace />} />
          <Route path="/bench" element={<Navigate to="/optical-studio" replace />} />
          <Route path="/optics" element={<Navigate to="/optical-studio" replace />} />

          {/* Other modules */}
          <Route path="/applications" element={<ApplicationsPage />} />

          {/* Experiments - 偏振造物局 (with sub-routes) */}
          <Route path="/experiments" element={<ExperimentsPage />} />
          <Route path="/experiments/:tabId" element={<ExperimentsPage />} />

          {/* Legacy redirects */}
          <Route path="/creative" element={<Navigate to="/experiments" replace />} />
          <Route path="/simulation" element={<Navigate to="/lab" replace />} />

          {/* Calculation Workshop - 计算工坊 */}
          <Route path="/calc" element={<CalculationWorkshopPage />} />
          <Route path="/calc/jones" element={<JonesCalculatorPage />} />
          <Route path="/calc/mueller" element={<MuellerCalculatorPage />} />
          <Route path="/calc/stokes" element={<StokesCalculatorPage />} />
          <Route path="/calc/poincare" element={<PoincareSphereViewerPage />} />

          {/* Lab tools (legacy routes, redirect to /calc) */}
          <Route path="/lab/poincare" element={<Navigate to="/calc/poincare" replace />} />
          <Route path="/lab/jones" element={<Navigate to="/calc/jones" replace />} />
          <Route path="/lab/stokes" element={<Navigate to="/calc/stokes" replace />} />
          <Route path="/lab/mueller" element={<Navigate to="/calc/mueller" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
