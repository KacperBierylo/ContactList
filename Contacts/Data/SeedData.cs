using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using Contacts.Models;

namespace Contacts.Data
{
    public static class SeedData    //dodanie początkowych danych do bazy
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
             SQLitePCL.Batteries.Init();
              using (var context = new ApplicationDbContext(
               ))
              {
        
                  if (context.Contacts.Any())
                  {
                      return;
                  }
                //dodanie kategorii i ich podkategorii
                context.Categories.AddRange(
                    new Category
                    {
                        Name = "Prywatny",
                        SubCategories = new List<SubCategory> {  },
                        CanChoose = false
                    },
                    new Category
                    {
                        Name = "Służbowy",
                        SubCategories = new List<SubCategory> {
                        new SubCategory{Name = "Szef"},
                        new SubCategory{Name = "Klient"},
                        new SubCategory{Name = "Współpracownik"} },
                        CanChoose = true
                    },
                    new Category
                    {
                        Name = "Inny",
                        SubCategories = new List<SubCategory> { },
                        CanChoose = true
                    }
                );
                context.SaveChanges();
                //dodanie początkowych kontaktów
                context.Contacts.AddRange(
                      new Contact
                      {
                          FirstName = "Jan",
                          LastName = "Xyz",
                          Email = "jan.xyz@gmail.com",
                          Category = "Służbowy",
                          SubCategory = "Współpracownik",
                          Phone = "123-456-789",
                          BirthDate = new DateTime(1980, 1, 1)
                      },
                      new Contact
                      {
                          FirstName = "Adam",
                          LastName = "Abc",
                          Email = "adam.abc@onet.com",
                          Category = "Inny",
                          SubCategory = "Kolega",
                          Phone = "513-765-430",
                          BirthDate = new DateTime(1990, 2, 2)
                      }
                  );
                //dodanie początkowych użytkowników

                context.Users.AddRange(
                      new User
                      {
                          Username = "admin",
                          PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin")
                      },
                      new User
                      {
                          Username = "user",
                          PasswordHash = BCrypt.Net.BCrypt.HashPassword("user")
                      }
                  );

                  context.SaveChanges();
              }
          }

    }
}
