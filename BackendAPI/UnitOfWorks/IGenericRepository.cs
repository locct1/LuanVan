using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;

namespace BackendAPI.UnitOfWorks
{
    public interface IGenericRepository<TEntity> where TEntity : class
    {
        Task<IEnumerable<TEntity>> GetAll(
           Expression<Func<TEntity, bool>> filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
            Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null);
        Task<TEntity> GetByID(object id);
        Task<TEntity> Get(
          Expression<Func<TEntity, bool>> filter = null,
           Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
                                                      Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null
);
        Task<IEnumerable<TEntity>> GetPagedList(Expression<Func<TEntity, bool>> predicate = null,
                                           Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
                                           Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
                                           int page = 1,
                                           int limit = 10
                                         );

        Task Insert(TEntity entity);
        Task Delete(object id);
        Task Delete(TEntity entityDelete);
        Task Update(TEntity entityUpdate);
        int Count(Expression<Func<TEntity, bool>> predicate = null);

        Task<int> CountAsync(Expression<Func<TEntity, bool>> predicate = null);
        decimal Sum(Expression<Func<TEntity, bool>> predicate = null, Expression<Func<TEntity, decimal>> selector = null);
        Task<decimal> SumAsync(Expression<Func<TEntity, bool>> predicate = null, Expression<Func<TEntity, decimal>> selector = null);

    }
}
