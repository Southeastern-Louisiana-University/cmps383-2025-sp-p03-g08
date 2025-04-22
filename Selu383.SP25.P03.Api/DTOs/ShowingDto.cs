public class GetShowingDto
{
    public DateTime StartTime { get; set; }
    public string ShowType { get; set; }
    public bool IsSoldOut { get; set; }

    public string MovieName { get; set; }
    public string CinemaHallName { get; set; }
}

public class ShowingForTheater 
{   
    public int Id {get;set;}
     public DateTime StartTime { get; set; }
      public string ShowType { get; set; }
      public bool IsSoldOut { get; set; }

}

public class CreateShowingDto
{
    public string ShowType { get; set; }
    public DateTime StartTime { get; set; }

    public int MovieId { get; set; }

    public int CinemaHallId { get; set; }

    public int PricingModelId { get; set; }
}
