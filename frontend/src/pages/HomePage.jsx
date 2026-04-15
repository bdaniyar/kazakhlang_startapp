import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AnimalCard from '../components/AnimalCard'
import PollBlock from '../components/PollBlock'
import { getAnimals } from '../services/api'

function HomePage() {
  const [animals, setAnimals] = useState([])

  useEffect(() => {
    getAnimals().then(setAnimals).catch(() => setAnimals([]))
  }, [])

  return (
    <div className="page">
      <section className="hero">
        <h1>Жануарларға қамқор бол!</h1>
        <p>
          Қазақстандағы кейбір хайуанаттар бағында жануарлар жайлы ортаға мұқтаж.
          Қоғамдық қолдау арқылы біз олар туралы ақпаратты кең таратып, жанашырлық
          мәдениетін күшейте аламыз.
        </p>
        <Link className="btn btn-primary hero-cta" to="/qoldau">
          Қолдау бастау
        </Link>
      </section>

      <section className="info-strip">
        <div className="info-strip-item">
          <strong>Бағдарлама</strong>
          <span>Бұл жобада төлем жоқ — тек қолдау ниетіңізді көрсету үшін прототип.</span>
        </div>
        <div className="info-strip-item">
          <strong>Мақсат</strong>
          <span>Жануарларға жанашырлық пен экологиялық сауаттылықты арттыру.</span>
        </div>
        <div className="info-strip-item">
          <strong>Қалай қосыласыз</strong>
          <span>Каталогтан жануарды таңдап, әңгімесін оқыңыз және қолдауды тіркеңіз.</span>
        </div>
      </section>

      <section className="section home-facts">
        <h2>Білесіз бе?</h2>
        <div className="facts-grid">
          <article className="fact-card">
            <h3>Тыныштық маңызды</h3>
            <p>
              Көптеген жануарлар қатты дыбыс пен тосын қимылға сезімтал. Сондықтан
              зообақта сабырлы мінез пен қауіпсіз қашықтық сақтау — олардың әл-ауқатына
              көмектеседі.
            </p>
          </article>
          <article className="fact-card">
            <h3>Қорек сапасы</h3>
            <p>
              Дұрыс рацион жануардың иммунитеті мен белсенділігіне тікелей әсер етеді.
              Күтім мамандары әр түрдің ерекшелігіне қарай тамақ режимін реттейді.
            </p>
          </article>
          <article className="fact-card">
            <h3>Байыту рөлі</h3>
            <p>
              Ойыншықтар, серуен жолдары және зерттеу элементтері жануардың шаршауын
              азайтып, табиғи мінезін сақтауға көмектеседі.
            </p>
          </article>
        </div>
      </section>

      <section className="section">
        <h2>Ерекше жануарлар</h2>
        <div className="card-grid">
          {animals.slice(0, 3).map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </div>
        <p className="lead-text">
          Толық тізімді көру үшін{' '}
          <Link to="/zhanuarlar" className="inline-link">
            жануарлар каталогына
          </Link>{' '}
          өтіңіз.
        </p>
      </section>

      <section className="section home-tips">
        <h2>Қысқа кеңестер</h2>
        <ul className="tips-list">
          <li>Жануарларды тамақтандырмаңыз — олардың рационы мамандарға сеніп тапсырылған.</li>
          <li>Суретке түсерде жарқыл мен тікелей жарықтан аулақ болыңыз.</li>
          <li>Балаларға жануарға жақындау қауіпсіз екенін түсіндіріңіз.</li>
        </ul>
      </section>

      <PollBlock />
    </div>
  )
}

export default HomePage
