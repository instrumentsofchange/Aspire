namespace Aspire.Areas.Instruments.Models
{
    public class Instrument
    {
        public int Id { get; set; }
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public string InstrumentType { get; set; } = string.Empty;
        public string Program { get; set; } = string.Empty;
        public string Student { get; set; } = string.Empty;
        public string SerialNumber { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
    }
}
