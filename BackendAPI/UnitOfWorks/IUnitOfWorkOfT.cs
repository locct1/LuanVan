using Microsoft.EntityFrameworkCore;

namespace BackendAPI.UnitOfWorks
{
    public interface IUnitOfWork<TContext> : IUnitOfWork where TContext : DbContext
    {
        TContext DbContext { get; }
    }
}
