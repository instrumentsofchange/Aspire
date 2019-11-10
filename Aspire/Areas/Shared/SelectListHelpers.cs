using System;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Aspire.Areas.Shared
{
    public static class SelectListHelpers
    {
        public static SelectListItem GetDefaultItem()
        {
            return new SelectListItem("Select One...", "Select One...", true, true);
        }
    }
}
