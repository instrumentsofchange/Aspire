using System;
using Aspire.Areas.Instruments.Models.Enums;
using Aspire.Areas.Shared.Utils;

namespace Aspire.Areas.Instruments.Models
{
  public class Instrument : IComparable
  {
    public int? Id { get; set; }

    public InstrumentType Type { get; set; }
    public string TypeFromatted => Type.GetDescription();

    public string SerialNumber { get; set; } = string.Empty;

    public Status Status { get; set; }
    public string StatusFormatted => Status.GetDescription();

    public string Notes { get; set; } = string.Empty;
    public Make Make { get; set; }
    public Model Model { get; set; }
    public Shared.Models.Program Program { get; set; }
    public Student Student { get; set; }

    public Instrument()
    {
      Id = null;
      Type = InstrumentType.Trumpet;
      SerialNumber = string.Empty;
      Notes = string.Empty;
      Status = Status.Active;
      Make = new Make();
      Model = new Model();
      Program = new Shared.Models.Program();
      Student = new Student();
    }

    public bool Assigned() => Student != null && Student.Id > 0;

    public int CompareTo(object otherObject) {
      if(otherObject == null) return 1;

      Instrument otherInstrument = otherObject as Instrument;
      if (otherInstrument != null) 
      {
        if(this.Program.Name.Equals(otherInstrument.Program.Name)) {
          return this.Make.Description.CompareTo(otherInstrument.Make.Description);
        }
        else {
          return this.Program.Name.CompareTo(otherInstrument.Program.Name);
        }
      }
      else
        throw new ArgumentException("Object is not an Instrument");
    }
  }
}
