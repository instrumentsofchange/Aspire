using System;
using System.Collections.Generic;

namespace Aspire.Areas.Schedules.Models
{
  public class Schedule
  {
    public int Id { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int ProgramId { get; set; }
    public IEnumerable<string> MeetDays { get; set; }
    public bool SpecialEvent { get; set; }
    public string Description { get; set; }

    public string StartDateFormatted => StartDate.ToShortDateString();
    public string EndDateFormatted => EndDate.ToShortDateString();
		public bool IsActive => DateTime.Now < EndDate && DateTime.Now > StartDate;
  }
}
