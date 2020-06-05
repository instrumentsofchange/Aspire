namespace Aspire.Areas.Instruments.Models
{
    public class Make
    {
        public int? Id { get; set; }
        public string Description { get; set; }

        public Make() 
        {
            Id = null;
            Description = string.Empty;
        }
    }
}