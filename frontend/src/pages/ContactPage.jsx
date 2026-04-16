import { useState } from 'react'

function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [topic, setTopic] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const submitForm = (event) => {
    event.preventDefault()
    if (!name || !email || !message) return

    setSent(true)
    setName('')
    setEmail('')
    setTopic('')
    setMessage('')
  }

  return (
    <section className="page contact">
      <section className="contact-block">
        <h1>Байланыс</h1>
        <p className="lead-text">
          Сұрақтарыңыз, ұсыныстарыңыз немесе волонтерлік туралы ақпарат керек болса — бізге жазыңыз.
          Әрбір хабарлама маңызды.
        </p>
      </section>

      <section className="contact-block contact-info" aria-label="Байланыс деректері">
        <h3>Байланыс деректері</h3>
        <ul>
          <li>
            <span className="contact-label">Email:</span>{' '}
            <a href="mailto:qamqorzoo@demo.kz">qamqorzoo@demo.kz</a>
          </li>
          <li>
            <span className="contact-label">Телефон:</span>{' '}
            <a href="tel:+77000000000">+7 (700) 000-00-00</a>
          </li>
          <li>
            <span className="contact-label">Қала:</span> Алматы, Қазақстан
          </li>
          <li>
            <span className="contact-label">Жұмыс уақыты:</span> Дс–Жм 10:00–18:00
          </li>
        </ul>
        <p className="contact-note">
          Қаласаңыз, «Қолдау көрсету» беті арқылы да көмектесе аласыз.
        </p>
        <div className="contact-actions">
          <a className="btn btn-outline" href="/qoldau">
            Қолдау көрсету
          </a>
          <a className="btn btn-primary" href="/qalai-komektesemiz">
            Қалай көмектесеміз
          </a>
        </div>
      </section>

      <form className="contact-form contact-block" onSubmit={submitForm}>
        <label>
          Атыңыз
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Мысалы: Айдос"
            autoComplete="name"
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
            autoComplete="email"
          />
        </label>
        <label>
          Тақырып (қалауыңызша)
          <input
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="Мысалы: Волонтер болу"
          />
        </label>
        <label>
          Хабарлама
          <textarea
            rows="6"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Қысқаша жазыңыз: не көмегі керек, қай қала, қандай жағдай..."
          />
        </label>
        <button className="btn btn-primary" type="submit">
          Жіберу
        </button>
        <p className="lead-text" style={{ fontSize: '0.95rem' }}>
          Жіберу арқылы сіз байланыс деректеріңізді жауап беру мақсатында қолдануға келісесіз.
        </p>
      </form>

      <section className="contact-block contact-faq" aria-label="Жиі қойылатын сұрақтар">
        <h3>Жиі қойылатын сұрақтар</h3>
        <div className="contact-faq-items">
          <div className="contact-faq-item">
            <h4>Қашан жауап бересіздер?</h4>
            <p>Әдетте 1–2 жұмыс күні ішінде жауап береміз.</p>
          </div>
          <div className="contact-faq-item">
            <h4>Волонтер болу үшін не керек?</h4>
            <p>Қысқаша өзіңіз туралы жазыңыз, қай күндері бос екеніңізді көрсетіңіз — біз хабарласамыз.</p>
          </div>
          <div className="contact-faq-item">
            <h4>Жедел жағдай болса ше?</h4>
            <p>Телефон арқылы хабарласыңыз — тезірек бағыт береміз.</p>
          </div>
        </div>
      </section>

      {sent && <p className="success-text">Хабарламаңыз қабылданды. Рақмет!</p>}
    </section>
  )
}

export default ContactPage
