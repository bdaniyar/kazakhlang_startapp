import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import AnimalDetailPage from './pages/AnimalDetailPage'
import DonatePage from './pages/DonatePage'
import HowToHelpPage from './pages/HowToHelpPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'

function App() {
  const location = useLocation()
  const isDonatePage = location.pathname === '/qoldau'

  return (
    <div className="app-shell">
      <Navbar />
      <main className={isDonatePage ? 'container container-wide' : 'container'}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/zhanuarlar" element={<CatalogPage />} />
          <Route path="/zhanuarlar/:id" element={<AnimalDetailPage />} />
          <Route path="/qoldau" element={<DonatePage />} />
          <Route path="/qalai-komektesemiz" element={<HowToHelpPage />} />
          <Route path="/zhoba-turaly" element={<AboutPage />} />
          <Route path="/bailanys" element={<ContactPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
