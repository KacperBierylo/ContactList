namespace Contacts.Dtos
{
    public class ContactDto //obiekt transferu danych dla kontaktu
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public int Category { get; set; }
        public string SubCategory { get; set; }
        public string Phone { get; set; }
        public DateTime BirthDate { get; set; }
        public bool HasEmptyOrNullFields()
        {
            return string.IsNullOrWhiteSpace(FirstName) ||
                   string.IsNullOrWhiteSpace(LastName) ||
                   string.IsNullOrWhiteSpace(Email) ||
                   string.IsNullOrWhiteSpace(SubCategory) ||
                   string.IsNullOrWhiteSpace(Phone) ||
                   BirthDate.ToString() == "";
        }
    }

}
