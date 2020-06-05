using System;
using Aspire.Areas.Shared.Models;
namespace Aspire.Areas.Students.Models
{
  public class Student
  {
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string MiddleInitial { get; set; }
    public string LastName { get; set; }
    public long StudentNumber { get; set; }
    public string HomeroomTeacher { get; set; }
    // public string StreetAddress { get; set; }
    // public string City { get; set; }
    // public string ZipCode { get; set; }
    public DateTime DateOfBirth { get; set; }
    public string ShirtSize { get; set; }
    public string Program { get; set; }
    public string Allergies { get; set; }

		public Address Address { get; set; }

    //Parent/Guardian 1 Info
    public ParentGuardian ParentGuardianOne { get; set; }
    // public string ParentOneFirstName { get; set; }
    // public string ParentOneLastName { get; set; }
    // public string ParentOnePhoneNumber { get; set; }
    // public string ParentOneEmail { get; set; }
    // public bool ParentOneCanContact { get; set; }

    //Parent/Guardian 2 Info:
    public ParentGuardian ParentGuardianTwo { get; set; }
    // public string ParentTwoFirstName { get; set; }
    // public string ParentTwoLastName { get; set; }
    // public string ParentTwoPhoneNumber { get; set; }
    // public string ParentTwoEmail { get; set; }
    // public bool ParentTwoCanContact { get; set; }

    //Emergency Contact 1 Info:
		public EmergencyContact EmergencyContactOne { get; set; }
    // public string EmergencyContactOneName { get; set; }
    // public string EmergencyContactOneRelationship { get; set; }
    // public string EmergencyContactOnePhoneNumber { get; set; }

    //Emergency Contact 2 Info:
		public EmergencyContact EmergencyContactTwo { get; set; }
    // public string EmergencyContactTwoName { get; set; }
    // public string EmergencyContactTwoRelationship { get; set; }
    // public string EmergencyContactTwoPhoneNumber { get; set; }
  }
}
