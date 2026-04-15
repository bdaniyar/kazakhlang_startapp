import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Басты бет' },
  { to: '/zhanuarlar', label: 'Жануарлар' },
  { to: '/qalai-komektesemiz', label: 'Қалай көмектесеміз' },
  { to: '/zhoba-turaly', label: 'Жоба туралы' },
  { to: '/bailanys', label: 'Байланыс' },
]

function Navbar() {
  return (
    <header className="navbar">
      <div className="brand">QamqorZoo</div>
      <nav className="nav-links">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default Navbar
