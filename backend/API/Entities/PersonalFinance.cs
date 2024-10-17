using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class PersonalFinance
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string ExpenceIncomeName { get; set; }
        public double Amount { get; set; }
        public string ExpenceIncomeType { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime EditedOn { get; set; }
        public string FormatedDateTimeString { get; set; }
    }
}