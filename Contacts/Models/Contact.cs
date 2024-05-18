namespace Contacts.Models
{
    public class Contact    //określa tabelę kontaktów
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public DateTime BirthDate { get; set; }
        public string Category { get; set; }
        public string SubCategory { get; set; }
    }
}
