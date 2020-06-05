using System.Collections.Generic;
using System.Linq;
using Aspire.Areas.Instruments.Models.Enums;
using Aspire.Areas.Shared.Models;
using Aspire.Areas.Shared.Utils;

namespace Aspire.Areas.Instruments.Models
{
  public class InstrumentFilterConstants
  {
    public IEnumerable<SelectOption> StatusOptions
    {
      get
      {
        var result = new List<SelectOption>()
        {
          new SelectOption(null, "All")
        };

        result.AddRange(EnumUtil.GetValues<Status>().Select(status => new SelectOption(status, status.GetDescription())));

        return result;
      }
    }
    public IEnumerable<SelectOption> ProgramOptions { get; }

    public InstrumentFilterConstants(IEnumerable<SelectOption> programOptions)
    {
      ProgramOptions = programOptions;
    }
  }
}