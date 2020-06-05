using System.Collections.Generic;
using System.Linq;
using Aspire.Areas.Shared;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Aspire.Areas.Instruments.Models
{
    public class CreateInstrumentInitialFormOptions
    {
        public IList<SelectListItem> InstrumentTypeOptions { get; }
        public IList<SelectListItem> MakeOptions { get; }
        public IList<SelectListItem> ProgramOptions { get; }
        public IList<SelectListItem> StatusOptions { get; }

        public CreateInstrumentInitialFormOptions(
            IEnumerable<string> instrumentTypes,
            IEnumerable<string> makes,
            IEnumerable<string> programs,
            IEnumerable<string> statuses)
        {
            InstrumentTypeOptions = new List<SelectListItem>(instrumentTypes.Count() + 1);
            foreach(var instrumentType in instrumentTypes)
            {
                InstrumentTypeOptions.Add(new SelectListItem(instrumentType, instrumentType));
            }

            MakeOptions = new List<SelectListItem>(makes.Count() + 1);
            foreach (var make in makes)
            {
                MakeOptions.Add(new SelectListItem(make, make));
            }

            ProgramOptions = new List<SelectListItem>(programs.Count() + 1);
            foreach (var program in programs)
            {
                ProgramOptions.Add(new SelectListItem(program, program));
            }

            StatusOptions = new List<SelectListItem>(statuses.Count() + 1);
            foreach(var status in statuses)
            {
                StatusOptions.Add(new SelectListItem(status, status));
            }
        }
    }
}
