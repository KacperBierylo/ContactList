using Contacts.Data;
using Contacts.Dtos;
using Contacts.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Text.RegularExpressions;

namespace Contacts.Services
{
    public class ContactsService : IContactsService
    {
        private readonly ApplicationDbContext _context;

        public ContactsService(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<Contact> GetContacts()
        {
            var contacts = _context.Contacts.ToList();
            return contacts;
        }

        public Contact GetContact(int id)
        {
            var contact = _context.Contacts.Find(id);

            return contact;
        }

        public Contact CreateContact([FromBody] ContactDto contactDto)
        {
            var categoryName = _context.Categories.Where(c => c.Id == contactDto.Category) // szukanie nazwy kategorii po jej ID
                                         .Select(c => c.Name)
                                         .FirstOrDefault();
            if (categoryName != null)
            {
                var contact = new Contact
                {
                    FirstName = contactDto.FirstName,
                    LastName = contactDto.LastName,
                    Email = contactDto.Email,
                    Phone = contactDto.Phone,
                    BirthDate = contactDto.BirthDate,
                    Category = categoryName,
                    SubCategory = contactDto.SubCategory
                };

                _context.Contacts.Add(contact);
                _context.SaveChanges();

                return contact;
            }
            return null;
        }

        public Contact UpdateContact(int id, [FromBody] ContactDto contactDto)
        {
 
            var categoryName = _context.Categories.Where(c => c.Id == contactDto.Category)
                                         .Select(c => c.Name)
                                         .FirstOrDefault();
            var contact = _context.Contacts.Find(id);
            if (contact == null)
                return null;
            if (categoryName != null)
            {
                contact.FirstName = contactDto.FirstName;
                contact.LastName = contactDto.LastName;
                contact.Email = contactDto.Email;
                contact.Phone = contactDto.Phone;
                contact.BirthDate = contactDto.BirthDate;
                contact.Category = categoryName;
                contact.SubCategory = contactDto.SubCategory;

                _context.SaveChanges();

                return contact;
            }
            return null;
        }

        public Contact DeleteContact(int id)
        {
            var contact = _context.Contacts.Find(id);
            if (contact == null)
                return null;

            _context.Contacts.Remove(contact);
            _context.SaveChanges();

            return contact;
        }
    }
}
