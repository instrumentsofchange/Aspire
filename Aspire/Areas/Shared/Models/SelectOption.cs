using System;
namespace Aspire.Areas.Shared.Models
{
    public class SelectOption
    {
        public string Value { get; set; }
        public string Label { get; set; }

        public SelectOption(Object value, Object label)
        {
            Value = value.ToString();
            Label = label.ToString();
        }

        public SelectOption(string value, string label)
        {
            Value = value;
            Label = label;
        }

        public SelectOption() { }
    }
}