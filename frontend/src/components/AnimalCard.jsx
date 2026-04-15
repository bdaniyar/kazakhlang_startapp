import { Link } from 'react-router-dom'

function AnimalCard({ animal }) {
  return (
    <article className="animal-card">
      <img src={animal.image_url} alt={animal.name} className="animal-image" />
      <div className="animal-content">
        <h3>{animal.name}</h3>
        <p className="animal-description">{animal.description}</p>
        <div className="animal-actions">
          <Link to={`/zhanuarlar/${animal.id}`} className="btn btn-outline">
            Толығырақ
          </Link>
          <Link to={`/qoldau?animalId=${animal.id}`} className="btn btn-primary">
            Қолдау
          </Link>
        </div>
      </div>
    </article>
  )
}

export default AnimalCard
