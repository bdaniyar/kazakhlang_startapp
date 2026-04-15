import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { createDonation, getAnimals } from '../services/api'

const amounts = [1000, 5000, 10000]

function DonatePage() {
  const [animals, setAnimals] = useState([])
  const [animalId, setAnimalId] = useState('')
  const [amount, setAmount] = useState(amounts[0])
  const [message, setMessage] = useState('')
  const location = useLocation()

  const queryAnimalId = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return params.get('animalId')
  }, [location.search])

  useEffect(() => {
    getAnimals()
      .then((data) => {
        setAnimals(data)
        setAnimalId(queryAnimalId || String(data[0]?.id || ''))
      })
      .catch(() => setAnimals([]))
  }, [queryAnimalId])

  const submitDonation = async (event) => {
    event.preventDefault()
    if (!animalId) return

    try {
      await createDonation({ animal_id: Number(animalId), amount })
      setMessage('Рақмет! Қолдауыңыз базаға тіркелді.')
    } catch {
      setMessage('Қателік пайда болды. Кейінірек қайталап көріңіз.')
    }
  }

  return (
    <section className="page">
      <h1>Қолдау беті</h1>
      <p className="lead-text">
        Бұл бетте төлем жасалмайды. Тек қолдау ниетіңіз прототипке жазылады.
      </p>

      <form className="donate-form" onSubmit={submitDonation}>
        <label>
          Жануарды таңдаңыз
          <select value={animalId} onChange={(event) => setAnimalId(event.target.value)}>
            {animals.map((animal) => (
              <option key={animal.id} value={animal.id}>
                {animal.name}
              </option>
            ))}
          </select>
        </label>

        <div className="amount-grid">
          {amounts.map((value) => (
            <button
              className={value === amount ? 'amount-btn selected' : 'amount-btn'}
              type="button"
              key={value}
              onClick={() => setAmount(value)}
            >
              {value.toLocaleString('kk-KZ')} ₸
            </button>
          ))}
        </div>

        <button className="btn btn-primary" type="submit">
          Қолдауды тіркеу
        </button>
      </form>
      {message && <p className="success-text">{message}</p>}
    </section>
  )
}

export default DonatePage
