import { useState } from 'react'

function ContactPage() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const submitForm = (event) => {
    event.preventDefault()
    if (!name || !message) return
    setSent(true)
    setName('')
    setMessage('')
  }

  return (
    <section className="page">
      <h1>Байланыс</h1>
      <p className="lead-text">Электрондық пошта: qamqorzoo@demo.kz</p>
      <form className="contact-form" onSubmit={submitForm}>
        <label>
          Атыңыз
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label>
          Хабарлама
          <textarea
            rows="5"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </label>
        <button className="btn btn-primary" type="submit">
          Жіберу
        </button>
      </form>
      {sent && <p className="success-text">Хабарламаңыз қабылданды.</p>}
    </section>
  )
}

export default ContactPage
