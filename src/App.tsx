import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import BrowsePage from './pages/BrowsePage'
import LessonPage from './pages/LessonPage'
import PathwaysPage from './pages/PathwaysPage'
import PathwayDetailPage from './pages/PathwayDetailPage'
import TweetsPage from './pages/TweetsPage'
import PipelinePage from './pages/PipelinePage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1, paddingTop: 'var(--header-height)' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/lesson/:id" element={<LessonPage />} />
          <Route path="/pathways" element={<PathwaysPage />} />
          <Route path="/pathway/:id" element={<PathwayDetailPage />} />
          <Route path="/tweets" element={<TweetsPage />} />
          <Route path="/pipeline" element={<PipelinePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer style={{
        textAlign: 'center',
        padding: '32px 24px',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        borderTop: '1px solid var(--border)',
      }}>
        Draft Academy — Learn data science through Magic: The Gathering
      </footer>
    </div>
  )
}

export default App
