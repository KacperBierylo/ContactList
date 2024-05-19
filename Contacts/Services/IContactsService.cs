using Contacts.Dtos;
using Contacts.Models;
using Microsoft.AspNetCore.Mvc;

namespace Contacts.Services
{
    public interface IContactsService
    {
        public List<Contact> GetContacts();
        public Contact GetContact(int id);
        public Contact CreateContact([FromBody] ContactDto contactDto);
        public Contact UpdateContact(int id, [FromBody] ContactDto contactDto);
        public Contact DeleteContact(int id);
    }
}
