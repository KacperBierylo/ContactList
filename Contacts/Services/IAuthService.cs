using Contacts.Models;

namespace Contacts.Services
{
    public interface IAuthService
    {
        string Authenticate(string username, string password);
        User Register(string username, string password);
    }
}
