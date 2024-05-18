namespace Contacts.Models
{
    public class Category   //określa tabelę kategorii
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool CanChoose { get; set; } //czy można wybrać podkategorię dla danej kategorii
        public List<SubCategory> SubCategories { get; set; }
    }
}

