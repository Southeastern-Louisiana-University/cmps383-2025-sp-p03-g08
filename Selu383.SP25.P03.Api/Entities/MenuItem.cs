using System.ComponentModel.DataAnnotations;

public class MenuItem
{
    public int Id { get; set; }
    public string Category { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string ImageURL { get; set; }

    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be a positive value.")]
    public decimal Price { get; set; }
    public int Calories { get; set; }
    public bool Showcase { get; set; }
}

