using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : IdentityDbContext<User>
    {
        public DataContext(DbContextOptions options) : base(options) { }

        public DbSet<PersonalFinance> PersonalFinances { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<IdentityRole>()
                .HasData(
                    new IdentityRole() { Name = "User", NormalizedName = "USER" },
                    new IdentityRole() { Name = "Member", NormalizedName = "MEMBER" },
                    new IdentityRole() { Name = "Admin", NormalizedName = "ADMIN" }
                );
        }
    }
}