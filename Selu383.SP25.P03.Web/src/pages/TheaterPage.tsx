import TheaterCard from '../Components/TheaterCards'
import '../styles/TheaterPage.css'

export default function TheaterPage() {
  return (
    <div className="theatersPage">
      <h1 className="theatersPage__title">Theaters</h1>
      <div className="theatersPage__grid">
        <TheaterCard
          imageUrl="/Theater1.png"
          title="Lion's Den Cinemas 1"
          subtitle="address"
        />
        <TheaterCard
          imageUrl="/Theater2.png"
          title="Lion's Den Cinemas 2"
          subtitle="address"
        />
        <TheaterCard
          imageUrl="/Theater3.png"
          title="Lion's Den Cinemas 3"
          subtitle="address"
        />
      </div>
    </div>
  )
}
