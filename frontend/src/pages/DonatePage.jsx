import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { createDonation, getAnimals } from '../services/api'

const presetAmounts = [1000, 5000, 10000]
const goalAmount = 100_000

function DonatePage() {
  const [animals, setAnimals] = useState([])
  const [animalId, setAnimalId] = useState('')
  const [selectedAmount, setSelectedAmount] = useState(presetAmounts[0])
  const [customAmount, setCustomAmount] = useState('')
  const [message, setMessage] = useState('')
  const [progressByAnimal, setProgressByAnimal] = useState({})
  const [paymentMethod, setPaymentMethod] = useState('kaspi')
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
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
    try {
      const raw = localStorage.getItem('qamqor_progress')
      if (raw) setProgressByAnimal(JSON.parse(raw))
    } catch {
      // ignore
    }
  }, [])

  const getProgress = (id) => {
    const value = progressByAnimal[String(id)]
    const numeric = Number(value)

    // If you already have progress from backend/story text (e.g., 25, 35), keep it as-is.
    // Otherwise start from a consistent default.
    if (Number.isFinite(numeric) && numeric >= 0) return Math.min(100, Math.round(numeric))

    // Default starting point so the UI matches the previously shown examples (25%, 35%, etc.)
    return 25
  }

  const setProgress = (id, nextValue) => {
    const clamped = Math.max(0, Math.min(100, Math.round(nextValue)))
    setProgressByAnimal((prev) => {
      const next = { ...prev, [String(id)]: clamped }
      try {
        localStorage.setItem('qamqor_progress', JSON.stringify(next))
      } catch {
        // ignore
      }
      return next
    })
  }

  const selectedProgress = useMemo(() => {
    if (!animalId) return 0
    return getProgress(animalId)
  }, [animalId, progressByAnimal])

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

  const onPaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value)
    setMessage('')
  }

  const onCardNumberChange = (event) => {
    const next = event.target.value.replace(/\s+/g, '')
    if (next !== '' && !/^[0-9]{0,19}$/.test(next)) return

    // regroup into chunks for readability
    const grouped = next.replace(/(.{4})/g, '$1 ').trim()
    setCardNumber(grouped)
    setMessage('')
  }

  const onCardExpiryChange = (event) => {
    const raw = event.target.value.replace(/[^0-9]/g, '').slice(0, 4)
    const formatted = raw.length <= 2 ? raw : `${raw.slice(0, 2)}/${raw.slice(2)}`
    setCardExpiry(formatted)
    setMessage('')
  }

  const onCardCvcChange = (event) => {
    const next = event.target.value.replace(/[^0-9]/g, '').slice(0, 4)
    setCardCvc(next)
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
      // Payment logic is intentionally not implemented (prototype UI only).
      // Here we only register the intent in backend.
      const result = await createDonation({ animal_id: Number(animalId), amount })

      // Backend updates progress; update UI immediately as well.
      if (typeof result?.progress === 'number') {
        setProgress(animalId, result.progress)
      }

      setCardNumber('')
      setCardName('')
      setCardExpiry('')
      setCardCvc('')

      setMessage('Рақмет! Қолдауыңыз базаға тіркелді.')
    } catch {
      setMessage('Қателік пайда болды. Кейінірек қайталап көріңіз.')
    }
  }

  return (
    <section className="page donate-page">
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

        <div className="progress-box donate-progress" aria-label="Қолдау прогресі">
          <div className="donate-progress-top">
            <strong>Қолдау прогресі</strong>
            <span className="donate-progress-value">{selectedProgress}%</span>
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-valuenow={selectedProgress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span style={{ width: `${selectedProgress}%` }} />
          </div>
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

            <div className="donate-payment">
              <h3>Төлем тәсілі</h3>

              <div className="donate-payment-methods" role="radiogroup" aria-label="Төлем тәсілін таңдаңыз">
                <label className="pay-option">
                  <input
                    type="radio"
                    name="payment"
                    value="kaspi"
                    checked={paymentMethod === 'kaspi'}
                    onChange={onPaymentMethodChange}
                  />
                  <span className="pay-option-text">Kaspi.kz</span>
                </label>

                <label className="pay-option">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={onPaymentMethodChange}
                  />
                  <span className="pay-option-text">Карта (Visa / MasterCard)</span>
                </label>
              </div>

              {paymentMethod === 'kaspi' ? (
                <div className="pay-kaspi">
                  <p className="lead-text">
                    Kaspi арқылы төлеу логикасы әзірге қосылмаған. Бұл жерде тек интерфейс көрсетіледі.
                  </p>
                  <button className="btn btn-outline" type="button" onClick={() => setMessage('Kaspi төлемі әзірге қосылмаған (UI ғана).')}
                  >
                    Kaspi арқылы төлеу
                  </button>
                </div>
              ) : (
                <div className="pay-card">
                  <div className="pay-card-grid">
                    <label>
                      Карта нөмірі
                      <input
                        inputMode="numeric"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={onCardNumberChange}
                      />
                    </label>
                    <label>
                      Карта иесі
                      <input
                        placeholder="NAME SURNAME"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </label>
                    <label>
                      Жарамдылық мерзімі
                      <input
                        inputMode="numeric"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={onCardExpiryChange}
                      />
                    </label>
                    <label>
                      CVC/CVV
                      <input
                        inputMode="numeric"
                        placeholder="123"
                        value={cardCvc}
                        onChange={onCardCvcChange}
                      />
                    </label>
                  </div>
                  <p className="donate-hint">
                    Бұл — тек макет. Нақты төлем өңдеу қосылмаған.
                  </p>
                </div>
              )}
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
