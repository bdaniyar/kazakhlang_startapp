import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getAnimalById } from '../services/api'

function AnimalDetailPage() {
  const { id } = useParams()
  const [animal, setAnimal] = useState(null)

  useEffect(() => {
    getAnimalById(id).then(setAnimal).catch(() => setAnimal(null))
  }, [id])

  if (!animal) {
    return <p className="page">Жануар туралы мәлімет жүктелуде...</p>
  }

  return (
    <article className="page detail-page">
      <img src={animal.image_url} alt={animal.name} className="detail-image" />
      <h1>{animal.name}</h1>
      {animal.story.split('\n\n').map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}

      <section className="progress-box">
        <h3>Қолдау прогресі</h3>
        <div className="progress-track">
          <span style={{ width: `${animal.progress}%` }} />
        </div>
        <strong>{animal.progress}%</strong>
      </section>

      <Link to={`/qoldau?animalId=${animal.id}`} className="btn btn-primary">
        Қолдау
      </Link>
    </article>
  )
}

export default AnimalDetailPage
