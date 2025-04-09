public class GetMenuItemDto
{
    public string Category { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string ImageURL { get; set; }
    public decimal Price { get; set; }
    public int Calories { get; set; }
}

public class CreateMenuItemDto
{
    public string Category { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string ImageURL { get; set; }
    public decimal Price { get; set; }
    public int Calories { get; set; }
    public bool Showcase { get; set; }
}
