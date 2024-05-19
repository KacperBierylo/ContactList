using Contacts.Models;

namespace Contacts.Services
{
    public interface ICategoriesService
    {
        public List<Category> GetCategoriesWithSubCategories();
        public Category GetCategoryWithSubCategories(int id);
    }
}
