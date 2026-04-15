import { useEffect, useState } from 'react'
import AnimalCard from '../components/AnimalCard'
import { getAnimals } from '../services/api'

function CatalogPage() {
  const [animals, setAnimals] = useState([])

  useEffect(() => {
    getAnimals().then(setAnimals).catch(() => setAnimals([]))
  }, [])

  return (
    <section className="page">
      <h1>Жануарлар каталогы</h1>
      <p className="lead-text">
        Алматы зообағындағы жануарлармен танысып, жүрегіңізге жақын жануарды қолдаңыз.
      </p>
      <div className="card-grid">
        {animals.map((animal) => (
          <AnimalCard key={animal.id} animal={animal} />
        ))}
      </div>
    </section>
  )
}

export default CatalogPage
