import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import AnimalDetailPage from './pages/AnimalDetailPage'
import DonatePage from './pages/DonatePage'
import StoriesPage from './pages/StoriesPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/zhanuarlar" element={<CatalogPage />} />
          <Route path="/zhanuarlar/:id" element={<AnimalDetailPage />} />
          <Route path="/qoldau" element={<DonatePage />} />
          <Route path="/angimeler" element={<StoriesPage />} />
          <Route path="/zhoba-turaly" element={<AboutPage />} />
          <Route path="/bailanys" element={<ContactPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
