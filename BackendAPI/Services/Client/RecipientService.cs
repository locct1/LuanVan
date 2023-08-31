using BackendAPI.Data;
using BackendAPI.Interfaces;
using BackendAPI.Interfaces.Client;
using BackendAPI.UnitOfWorks;

namespace BackendAPI.Services.Client
{
    public class RecipientService : IRecipientService

    {
        private readonly IUnitOfWork _unitOfWork;
        public RecipientService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<Recipient>> GetAll()
        {
            return await _unitOfWork.GetRepository<Recipient>().GetAll(orderBy: x => x.OrderByDescending(x => x.Id));
        }
        public async Task<IEnumerable<Recipient>> GetPagedList(int page, int limit)
        {
            return await _unitOfWork.GetRepository<Recipient>().GetPagedList(null, null, null, page, limit);
        }
        public async Task<Recipient?> GetRecipientById(int id)
        {
            return await _unitOfWork.GetRepository<Recipient>().GetByID(id);
        }

        public async Task CreateRecipient(Recipient newRecipient)
        {
            await _unitOfWork.GetRepository<Recipient>().Insert(newRecipient);
        }
        public async Task UpdateRecipient(int id, Recipient updateRecipient)
        {
            await _unitOfWork.GetRepository<Recipient>().Update(updateRecipient);
        }
        public async Task DeleteRecipient(int id)
        {
            await _unitOfWork.GetRepository<Recipient>().Delete(id);
        }
    }
}
