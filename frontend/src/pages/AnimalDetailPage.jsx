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

      <section className="progress-box donate-progress" aria-label="Қолдау прогресі">
        <div className="donate-progress-top">
          <strong>Қолдау прогресі</strong>
          <span className="donate-progress-value">{animal.progress}%</span>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-valuenow={animal.progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span style={{ width: `${animal.progress}%` }} />
        </div>
      </section>

      <Link to={`/qoldau?animalId=${animal.id}`} className="btn btn-primary">
        Қолдау
      </Link>
    </article>
  )
}

export default AnimalDetailPage
