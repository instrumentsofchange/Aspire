using System;
using System.ComponentModel;
using Aspire.Areas.Shared.Utils;

namespace Aspire.Areas.Instruments.Models.Enums
{
    public enum Status
    {
        //WARNING: Do not change the int value of these enums as they correspond to values in the DB
        [Description("Active")]
        Active = 0,

        [Description("Needs Repair")]
        NeedsRepair = 1,

        [Description("Out For Repair")]
        OutForRepair = 2
    }
}