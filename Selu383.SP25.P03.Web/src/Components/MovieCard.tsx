import { Link } from "react-router";
import "../styles/MovieCard.css";

type MovieCardProps = {
  poster: string;
  title: string;
  linkUrl?: string;
  onClick?: () => void;
};

export default function MovieCard({ poster, title, linkUrl, onClick}: MovieCardProps) {
  return (
    <div className="movieCard">
      <img src={poster} alt={title} className="movieCard__poster" />
      <h3 className="movieCard__title">{title}</h3>
      {linkUrl && (
        <Link to={linkUrl} onClick={onClick} className="movieCard__link">
          View Showtimes
        </Link>
      )}
    </div>
  );
}
