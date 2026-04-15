import { useEffect, useState } from 'react'
import { getAnimals } from '../services/api'

function StoriesPage() {
  const [animals, setAnimals] = useState([])

  useEffect(() => {
    getAnimals().then(setAnimals).catch(() => setAnimals([]))
  }, [])

  return (
    <section className="page">
      <h1>Жануарлар әңгімелері</h1>
      <div className="story-list">
        {animals.map((animal) => (
          <article key={animal.id} className="story-item">
            <h3>{animal.name}</h3>
            <p>{animal.story.split('\n\n')[0]}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default StoriesPage
