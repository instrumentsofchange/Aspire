using System.Linq;
using System.Collections.Generic;
using Aspire.Areas.Instruments.Models.Enums;
using Aspire.Areas.Shared.Models;
using Aspire.Areas.Shared.Utils;

namespace Aspire.Areas.Instruments.Models
{
  public class InstrumentConstants
  {
    public IEnumerable<SelectOption> TypeOptions { get; }
    public IEnumerable<SelectOption> MakeOptions { get; }
    public IEnumerable<SelectOption> ProgramOptions { get; }
    public IEnumerable<SelectOption> StatusOptions { get; }

    public InstrumentConstants(IEnumerable<SelectOption> makeOptions, IEnumerable<SelectOption> programOptions)
    {
      MakeOptions = makeOptions;
      ProgramOptions = programOptions;
      TypeOptions = EnumUtil.GetValues<InstrumentType>().Select(type => new SelectOption(type, type.ToString()));
      StatusOptions = EnumUtil.GetValues<Status>().Select(status => new SelectOption(status, status.GetDescription()));
    }
  }
}