namespace Contacts.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool CanChoose { get; set; }
        public List<SubCategory> SubCategories { get; set; }
    }
}

