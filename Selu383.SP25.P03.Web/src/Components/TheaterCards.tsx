import '../styles/TheaterCard.css'

interface Props {
  imageUrl: string
  title: string
  subtitle: string
}

export default function TheaterCard({ imageUrl, title, subtitle }: Props) {
  return (
    <div className="theaterCard">
      <img src={imageUrl} alt={title} className="theaterCard__image" />
      <div className="theaterCard__body">
        <h2>{title}</h2>
        <p>{subtitle}</p>
        <button className="theaterCard__button">Choose This Theater</button>
      </div>
    </div>
  )
}
