import { Link } from 'react-router'
import '../styles/TheatersPage.css'

export default function TheatersPage() {
  const theaters = [
    { id: 1, name: 'Hammond Louisiana', address: '123 Oak Street Hammond, LA 70401' },
    { id: 2, name: 'Covington Louisiana', address: '321 Maple Street Covington, LA 70401' },
    { id: 3, name: 'Baton Rouge Louisiana', address: '321 Paint Road Baton Rouge, LA 70801' }
  ]

  return (
    <div>    <div className = "heading-container"> <h1>Theaters</h1></div>
    <div className="theatersPage">

      <div className="theatersPage__list">
        {theaters.map(t => (
          <div key={t.id} className="theatersPage__card">
            <img src="https://imgur.com/ftrpBar.jpg" alt={t.name} />
            <div>
            <h2>{t.name}</h2>
            <p>{t.address}</p>
            <Link to={"/seating"}>
            <button>Choose This Theater</button>
            </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  )
}
