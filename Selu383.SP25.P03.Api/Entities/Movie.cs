public class Movie
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string Genre { get; set; }

    public DateTime ReleaseDate { get; set; }
    public bool NowPlaying { get; set; }
    public TimeSpan Duration { get; set; }
    public string PosterURL { get; set; }
}
