import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { createDonation, getAnimals } from '../services/api'

const presetAmounts = [1000, 5000, 10000]

function DonatePage() {
  const [animals, setAnimals] = useState([])
  const [animalId, setAnimalId] = useState('')
  const [selectedAmount, setSelectedAmount] = useState(presetAmounts[0])
  const [customAmount, setCustomAmount] = useState('')
  const [message, setMessage] = useState('')
  const location = useLocation()

  const queryAnimalId = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return params.get('animalId')
  }, [location.search])

  const amount = useMemo(() => {
    const custom = Number(customAmount)
    if (Number.isFinite(custom) && custom > 0) return custom
    return selectedAmount
  }, [customAmount, selectedAmount])

  useEffect(() => {
    getAnimals()
      .then((data) => {
        setAnimals(data)
        setAnimalId(queryAnimalId || String(data[0]?.id || ''))
      })
      .catch(() => setAnimals([]))
  }, [queryAnimalId])

  const onPickPreset = (value) => {
    setSelectedAmount(value)
    setCustomAmount('')
    setMessage('')
  }

  const onCustomChange = (event) => {
    const next = event.target.value
    // allow only digits
    if (next !== '' && !/^[0-9]+$/.test(next)) return

    setCustomAmount(next)
    setMessage('')
  }

  const submitDonation = async (event) => {
    event.preventDefault()
    if (!animalId) return

    if (!Number.isFinite(amount) || amount <= 0) {
      setMessage('Соманы дұрыс енгізіңіз.')
      return
    }

    try {
      await createDonation({ animal_id: Number(animalId), amount })
      setMessage('Рақмет! Қолдауыңыз базаға тіркелді.')
    } catch {
      setMessage('Қателік пайда болды. Кейінірек қайталап көріңіз.')
    }
  }

  return (
    <section className="page">
      <header className="donate-header">
        <h1>Қолдау беті</h1>
        <p className="lead-text">
          Бұл бетте төлем жасалмайды. Тек қолдау ниетіңіз прототипке жазылады.
        </p>
      </header>

      <form className="donate-form" onSubmit={submitDonation}>
        <div className="donate-form-row">
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
        </div>

        <div className="donate-form-row">
          <div className="donate-amount-section">
            <div className="donate-amount-top">
              <span className="donate-label">Соманы таңдаңыз</span>
              <span className="donate-badge">Ұсынылатын</span>
            </div>

            <div className="amount-grid">
              {presetAmounts.map((value) => (
                <button
                  className={value === selectedAmount && !customAmount ? 'amount-btn selected' : 'amount-btn'}
                  type="button"
                  key={value}
                  onClick={() => onPickPreset(value)}
                >
                  {value.toLocaleString('kk-KZ')} ₸
                </button>
              ))}
            </div>

            <div className="donate-custom">
              <label>
                Өз соманы енгізіңіз
                <div className="donate-input-wrap">
                  <input
                    inputMode="numeric"
                    placeholder="Мысалы: 2500"
                    value={customAmount}
                    onChange={onCustomChange}
                  />
                  <span className="donate-currency">₸</span>
                </div>
              </label>
              <p className="donate-hint">Егер өз соманы енгізсеңіз, жоғарыдағы батырмалар автоматты түрде өшеді.</p>
            </div>

            <div className="donate-summary">
              <span>Таңдалған сома:</span>
              <strong>{amount.toLocaleString('kk-KZ')} ₸</strong>
            </div>
          </div>
        </div>

        <button className="btn btn-primary donate-submit" type="submit">
          Қолдауды тіркеу
        </button>
      </form>

      {message && (
        <p className={message.includes('Рақмет') ? 'success-text' : 'error-text'}>{message}</p>
      )}
    </section>
  )
}

export default DonatePage
