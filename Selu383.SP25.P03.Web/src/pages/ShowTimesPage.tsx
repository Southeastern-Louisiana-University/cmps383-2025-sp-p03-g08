import { useParams } from 'react-router-dom'

export default function ShowTimesPage() {
  const { movieId } = useParams()
  const showTimes = [
    { time: '6:30 PM', location: 'Dolly Cinema' },
    { time: '9:00 PM', location: 'IMAX' },
    { time: '11:00 PM', location: 'Dolly Cinema' }
  ]

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Show Times</h1>
      <h2>{movieId}</h2>
      <div>
        {showTimes.map((st, i) => (
          <div key={i} style={{ marginBottom: '1rem' }}>
            <p>{st.time}</p>
            <p>{st.location}</p>
            <button>Choose Seats</button>
          </div>
        ))}
      </div>
    </div>
  )
}
