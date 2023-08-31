using BackendAPI.Data;

namespace BackendAPI.Interfaces.Client
{
    public interface IRecipientService
    {
        Task<IEnumerable<Recipient>> GetAll();
        Task<IEnumerable<Recipient>> GetPagedList(int page, int limit);
        Task<Recipient> GetRecipientById(int id);
        Task CreateRecipient(Recipient recipient);
        Task UpdateRecipient(int id, Recipient recipient);
        Task DeleteRecipient(int id);
    }
}
