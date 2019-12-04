using System;
namespace Aspire.Areas.Schedules.Models
{
    public class Schedule
    {
        public int Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Program { get; set; }
        public bool SpecialEvent { get; set; }
        public string Description { get; set; }
    }
}
