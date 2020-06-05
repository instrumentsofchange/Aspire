namespace Aspire.Areas.Instruments.Models
{
    public class Student
    {
        public int? Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public Student()
        {
            Id = null;
            FirstName = string.Empty;
            LastName = string.Empty;
        }
    }
}