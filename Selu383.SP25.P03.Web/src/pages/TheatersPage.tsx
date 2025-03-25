import '../styles/TheatersPage.css'

export default function TheatersPage() {
  const theaters = [
    { id: 1, name: 'Hammond Louisiana', address: '123 Oak Street Hammond, LA 70401' },
    { id: 2, name: 'Covington Louisiana', address: '321 Maple Street Covington, LA 70401' },
    { id: 3, name: 'Baton Rouge Louisiana', address: '321 Paint Road Baton Rouge, LA 70801' }
  ]

  return (
    <div className="theatersPage">
      <h1>Theaters</h1>
      <p>Discover the best theaters in your area!</p>
      <div className="theatersPage__list">
        {theaters.map(t => (
          <div key={t.id} className="theatersPage__card">
            <img src="/public/Cinema.jpg" alt={t.name} />
            <h2>{t.name}</h2>
            <p>{t.address}</p>
            <button>Choose This Theater</button>
          </div>
        ))}
      </div>
    </div>
  )
}
