using Contacts.Data;
using Contacts.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Contacts.Services
{
    public class CategoriesService:ICategoriesService
    {
        private readonly ApplicationDbContext _context;

        public CategoriesService(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<Category> GetCategoriesWithSubCategories()
        {
            var categoriesWithSubCategories = _context.Categories.Include(c => c.SubCategories).ToList();
            return categoriesWithSubCategories;
        }

        public Category GetCategoryWithSubCategories(int id)
        {
            var category =  _context.Categories.Include(c => c.SubCategories).FirstOrDefault(c => c.Id == id);
            return category;
        }
    }
}
