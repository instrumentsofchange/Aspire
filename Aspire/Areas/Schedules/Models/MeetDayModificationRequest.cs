using System;

namespace Aspire.Areas.Schedules.Models
{
  public class MeetDayModificationRequest
  {
    public DateTime MeetDate { get; set; }
    public bool CancelMeetDay { get; set; }
    public bool RescheduleMeetDay { get; set; }
    public DateTime NewMeetDate { get; set; }
  }
}