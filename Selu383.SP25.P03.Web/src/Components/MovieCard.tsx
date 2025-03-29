import { Link } from "react-router";
import "../styles/MovieCard.css";

type MovieCardProps = {
  poster: string;
  title: string;
  linkUrl?: string;
};

export default function MovieCard({ poster, title, linkUrl }: MovieCardProps) {
  return (
    <div className="movieCard">
      <img src={poster} alt={title} className="movieCard__poster" />
      <h3 className="movieCard__title">{title}</h3>
      {linkUrl && (
        <Link to={linkUrl} className="movieCard__link">
          View Showtimes
        </Link>
      )}
    </div>
  );
}
