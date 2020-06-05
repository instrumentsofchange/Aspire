namespace Aspire.Areas.Shared.Models
{
  public class Program
  {
    public int? Id { get; set; }
    public string Name { get; set; }

    public Program()
    {
        Id = null;
        Name = string.Empty;
    }
  }
}