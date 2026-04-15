import { useState } from 'react'

function PollBlock() {
  const [selected, setSelected] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const submitPoll = (event) => {
    event.preventDefault()
    if (!selected) {
      setError('Алдымен бір нұсқаны таңдаңыз.')
      return
    }
    setError('')
    setSent(true)
  }

  const selectOption = (value) => {
    setSelected(value)
    setSent(false)
    setError('')
  }

  return (
    <section className="poll-block">
      <h2>Қай жануарға көмектесер едіңіз?</h2>
      <form onSubmit={submitPoll} className="poll-form">
        <div className="poll-options" role="group" aria-label="Таңдау">
          <label className="poll-option">
            <input
              type="radio"
              name="poll"
              value="Жолбарыс"
              checked={selected === 'Жолбарыс'}
              onChange={(event) => selectOption(event.target.value)}
            />
            <span className="poll-option-text">Жолбарыс</span>
          </label>
          <label className="poll-option">
            <input
              type="radio"
              name="poll"
              value="Аю"
              checked={selected === 'Аю'}
              onChange={(event) => selectOption(event.target.value)}
            />
            <span className="poll-option-text">Аю</span>
          </label>
        </div>
        <button className="btn btn-primary poll-submit" type="submit">
          Дауыс беру
        </button>
      </form>
      {error && <p className="error-text">{error}</p>}
      {sent && <p className="success-text">Рақмет! Сіздің таңдауыңыз сақталды.</p>}
    </section>
  )
}

export default PollBlock
