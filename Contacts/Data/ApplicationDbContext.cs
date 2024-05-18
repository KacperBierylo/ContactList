using Contacts.Models;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
namespace Contacts.Data
{
    public class ApplicationDbContext : DbContext   //Struktura bazy danych
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<Category> Categories { get; set; }

        public DbSet<SubCategory> SubCategories { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=contacts.db");
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>() //zapewnia unikalność nazwy użytkownika
                .HasIndex(u => u.Username)
                .IsUnique();
        }
    }
}
