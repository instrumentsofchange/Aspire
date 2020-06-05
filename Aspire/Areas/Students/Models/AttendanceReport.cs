using System;

namespace Aspire.Areas.Students.Models
{
    public class AttendanceReport
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Status { get; set; }
        public DateTime MeetDay { get; set; }
    }
}