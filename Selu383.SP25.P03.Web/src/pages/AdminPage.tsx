import { useEffect, useState } from 'react'

interface Theater {
  id: number
  name: string
  address: string
  seatCount: number
}

interface ShowTime {
  id: number
  theaterId: number
  movieTitle: string
  startTime: string
  price: number
}

export default function AdminPage() {
  const [theaters, setTheaters] = useState<Theater[]>([])
  const [showTimes, setShowTimes] = useState<ShowTime[]>([])
  const [selectedTheaterId, setSelectedTheaterId] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/theaters')
      .then(r => r.json())
      .then(data => setTheaters(data))
      .catch(err => console.error(err))
  }, [])

  function loadShowTimes(id: number) {
    setSelectedTheaterId(id)
    fetch(`/api/theaters/${id}/showtimes`)
      .then(r => r.json())
      .then(data => setShowTimes(data))
      .catch(err => console.error(err))
  }

  function createShowTime() {
    if (!selectedTheaterId) return
    const body = {
      theaterId: selectedTheaterId,
      movieTitle: 'New Movie',
      startTime: '2025-12-31T19:00:00',
      price: 9.99
    }
    fetch(`/api/theaters/${selectedTheaterId}/showtimes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(r => r.json())
      .then(() => loadShowTimes(selectedTheaterId))
      .catch(err => console.error(err))
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Panel</h1>
      <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
        <div>
          <h2>Theaters</h2>
          <ul>
            {theaters.map(t => (
              <li key={t.id} style={{ margin: '0.5rem 0' }}>
                {t.name}
                <button
                  style={{ marginLeft: '1rem' }}
                  onClick={() => loadShowTimes(t.id)}
                >
                  Load ShowTimes
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>ShowTimes</h2>
          <button onClick={createShowTime} disabled={!selectedTheaterId}>
            Create New ShowTime
          </button>
          <ul style={{ marginTop: '1rem' }}>
            {showTimes.map(st => (
              <li key={st.id} style={{ margin: '0.5rem 0' }}>
                {st.movieTitle} @ {st.startTime} - ${st.price}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
