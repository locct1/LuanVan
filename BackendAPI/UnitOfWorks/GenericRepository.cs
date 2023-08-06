using Microsoft.EntityFrameworkCore.Query;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using PagedList;

namespace BackendAPI.UnitOfWorks
{
    public class GenericRepository<TEntity> : IGenericRepository<TEntity> where TEntity : class
    {
        protected readonly DbContext _context;
        protected readonly DbSet<TEntity> _dbSet;
        public GenericRepository(DbContext context)
        {
            _context = context;
            _dbSet = context.Set<TEntity>();
        }
        public async virtual Task<IEnumerable<TEntity>> GetAll(
           Expression<Func<TEntity, bool>> filter = null,
           Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
           Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null)
        {
            IQueryable<TEntity> query = _dbSet;
            if (filter != null)
            {
                query = query.Where(filter);
            }
            if (include != null)
            {
                query = include(query);
            }
            if (orderBy is null)
            {
                return query.ToList();
            }
            return orderBy(query).ToList();
        }
        public async virtual Task<IEnumerable<TEntity>> GetPagedList(Expression<Func<TEntity, bool>> predicate = null,
                                               Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
                                               Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
                                               int page = 1,
                                               int limit = 10
                                              )
        {
            IQueryable<TEntity> query = _dbSet;

            if (include != null)
            {
                query = include(query);
            }

            if (predicate != null)
            {
                query = query.Where(predicate);
            }

            if (orderBy != null)
            {
                return orderBy(query).ToPagedList(page, limit);
            }
            else
            {
                return query.ToPagedList(page, limit);
            }
        }
        public async virtual Task<TEntity> Get(
          Expression<Func<TEntity, bool>> filter = null,
          Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
                 Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null
)
        {
            IQueryable<TEntity> query = _dbSet;
            if (filter != null)
            {
                query = query.Where(filter);
            }
            if (include != null)
            {
                query = include(query);
            }
            if (orderBy != null)
            {
                return orderBy(query).FirstOrDefault();
            }
            else
            {
                return query.FirstOrDefault();
            }
        }
        public async virtual Task<TEntity> GetByID(object id)
        {
            return _dbSet.Find(id);
        }
        public async virtual Task Insert(TEntity entity)
        {
            _dbSet.Add(entity);
        }
        public async virtual Task Delete(object id)
        {
            TEntity entityDelete = _dbSet.Find(id);
            Delete(entityDelete);

        }
        public async virtual Task Delete(TEntity entityDelete)
        {
            if (_context.Entry(entityDelete).State == EntityState.Detached)
            {
                _dbSet.Attach(entityDelete);
            }
            _dbSet.Remove(entityDelete);

        }
        public async virtual Task Update(TEntity entityUpdate)
        {
            _dbSet.Attach(entityUpdate);
            _context.Entry(entityUpdate).State = EntityState.Modified;

        }
    }
}
