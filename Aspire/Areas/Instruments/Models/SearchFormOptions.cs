using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Aspire.Areas.Instruments.Models
{
    public class SearchFormOptions
    {
        public IEnumerable<SelectListItem> ProgramOptions { get; }
        public IEnumerable<SelectListItem> MakeOptions { get; }

        public SearchFormOptions(IEnumerable<string> programs, IEnumerable<string> makes)
        {
            var defaultSelectListItem = new SelectListItem("None", "");

            ProgramOptions = programs.Select(program => new SelectListItem(program, program));
            ProgramOptions = ProgramOptions.Prepend(defaultSelectListItem);

            MakeOptions = makes.Select(make => new SelectListItem(make, make));
            MakeOptions = MakeOptions.Prepend(defaultSelectListItem);
        }
    }
}