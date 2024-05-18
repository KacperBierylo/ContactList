namespace Contacts.Models
{
    public class User   //określa tabelę użytkowników
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
    }
}
