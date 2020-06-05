using System.Collections.Generic;
using System.Linq;
using Aspire.Areas.Shared;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Aspire.Areas.Instruments.Models
{
    public class Model
    {
        public int? Id { get; set; }
        public string ModelNumber { get; set; }

        public Model()
        {
            Id = null;
            ModelNumber = string.Empty;
        }

        public static IEnumerable<SelectListItem> GetModelOptions(IEnumerable<Model> models)
        {
            var selectOptions = new List<SelectListItem>(models.Count() + 1);

            foreach(var model in models)
            {
                selectOptions.Add(new SelectListItem(model.ModelNumber, model.ModelNumber));
            }

            return selectOptions;
        }
    }
}
