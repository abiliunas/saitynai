using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;

namespace API.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(DataContext context, UserManager<User> userManager)
        {
            var isInitial = !userManager.Users.Any();
            if (!userManager.Users.Any())
            {
                var user = new User
                {
                    UserName = "demouser1"
                };

                await userManager.CreateAsync(user, "demouser1");
                await userManager.AddToRoleAsync(user, "User");

                var member = new User
                {
                    UserName = "vaikas1"
                };

                await userManager.CreateAsync(member, "vaikas1");
                await userManager.AddToRoleAsync(member, "Member");

                var admin = new User
                {
                    UserName = "tevas1"
                };

                await userManager.CreateAsync(admin, "tevas1");
                await userManager.AddToRoleAsync(admin, "Admin");
                await userManager.AddToRoleAsync(admin, "Member");
            }

            if (!context.PersonalFinances.Any() && isInitial)
            {
                var list = new List<PersonalFinance> {
                    new PersonalFinance {
                        Username = "tevas1",
                        ExpenceIncomeName = "Draugas dave",
                        Amount = 111,
                        ExpenceIncomeType = "income",
                        CreatedOn = new DateTime(2024, 1, 1),
                        EditedOn = DateTime.Now,
                        FormatedDateTimeString = new DateTime(2024, 1, 1).ToString("yyyy-MM-dd")
                    },
                    new PersonalFinance {
                        Username = "tevas1",
                        ExpenceIncomeName = "Radau ant zemes",
                        Amount = 111,
                        ExpenceIncomeType = "income",
                        CreatedOn = new DateTime(2024, 1, 2),
                        EditedOn = DateTime.Now,
                        FormatedDateTimeString = new DateTime(2024, 1, 2).ToString("yyyy-MM-dd")
                    },
                    new PersonalFinance {
                        Username = "tevas1",
                        ExpenceIncomeName = "Pasiskolinau",
                        Amount = 111,
                        ExpenceIncomeType = "income",
                        CreatedOn = new DateTime(2024, 1, 3),
                        EditedOn = DateTime.Now,
                        FormatedDateTimeString = new DateTime(2024, 1, 3).ToString("yyyy-MM-dd")
                    },
                    new PersonalFinance {
                        Username = "vaikas1",
                        ExpenceIncomeName = "Pirkau megztini ir kelnes",
                        Amount = 111,
                        ExpenceIncomeType = "expense",
                        CreatedOn = new DateTime(2024, 1, 4),
                        EditedOn = DateTime.Now,
                        FormatedDateTimeString = new DateTime(2024, 1, 4).ToString("yyyy-MM-dd")
                    },
                    new PersonalFinance {
                        Username = "vaikas1",
                        ExpenceIncomeName = "Pavalgiau",
                        Amount = 20,
                        ExpenceIncomeType = "expense",
                        CreatedOn = new DateTime(2024, 1, 5),
                        EditedOn = DateTime.Now,
                        FormatedDateTimeString = new DateTime(2024, 1, 5).ToString("yyyy-MM-dd")
                    },
                };

                await context.PersonalFinances.AddRangeAsync(list);
                await context.SaveChangesAsync();
            }
        }
    }
}