using BackendAPI.Data;
using BackendAPI.Interfaces;
using BackendAPI.UnitOfWorks;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace BackendAPI.Services
{
    public class ProductService : IProductService

    {
        private readonly IUnitOfWork _unitOfWork;
        public ProductService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<Product>> GetAll()
        {
            return await _unitOfWork.GetRepository<Product>().GetAll(include: p => p.Include(p => p.Brand).Include(p => p.WareHouse).Include(p => p.ProductColorProducts).Include(p => p.ProductVersions), orderBy: x => x.OrderByDescending(x => x.Id), filter: x => x.ProductCategoryCode == "DIENTHOAI"); ;
        }
        public async Task<IEnumerable<Product>> GetAllAccessories()
        {
            return await _unitOfWork.GetRepository<Product>().GetAll(include: p => p.Include(p => p.Brand).Include(p => p.WareHouse).Include(p => p.ProductColorProducts).Include(p => p.ProductVersions), orderBy: x => x.OrderByDescending(x => x.Id), filter: x => x.ProductCategoryCode != "DIENTHOAI");
        }
        public async Task<IEnumerable<Product>> GetPagedList(int page, int limit)
        {
            return await _unitOfWork.GetRepository<Product>().GetPagedList(null, null, include: p => p.Include(p => p.Brand).Include(p => p.WareHouse), page, limit);
        }
        public async Task<Product?> GetProductById(int id)
        {
            return await _unitOfWork.GetRepository<Product>().GetByID(id);
        }

        public async Task CreateProduct(Product newProduct)
        {
            await _unitOfWork.GetRepository<Product>().Insert(newProduct);
        }
        public async Task UpdateProduct(int id, Product updateProduct)
        {
            await _unitOfWork.GetRepository<Product>().Update(updateProduct);
        }
        public async Task DeleteProduct(int id)
        {
            await _unitOfWork.GetRepository<Product>().Delete(id);
        }

        public async Task<Product?> Get(int id)
        {
            return await _unitOfWork.GetRepository<Product>().Get(include: p => p.Include(p => p.Brand).Include(p => p.WareHouse)
            .Include(p => p.ProductColorProducts).ThenInclude(p => p.ColorProduct).Include(p => p.ProductVersions).Include(x => x.ProductColorProducts).ThenInclude(x => x.ColorProduct).Include(x => x.ProductColorProducts).ThenInclude(x => x.Photos),
                                                    filter: x => x.Id == id);

        }

        public async Task<IEnumerable<Chip>> GetAllChips()
        {
            return await _unitOfWork.GetRepository<Chip>().GetAll(include: p => p.Include(p => p.ChipType));
        }

        public async Task<IEnumerable<ChipType>> GetAllChipTypes()
        {
            return await _unitOfWork.GetRepository<ChipType>().GetAll();

        }

        public async Task<IEnumerable<Ram>> GetAllRams()
        {
            return await _unitOfWork.GetRepository<Ram>().GetAll();

        }

        public async Task<IEnumerable<Rom>> GetAllRoms()
        {
            return await _unitOfWork.GetRepository<Rom>().GetAll();

        }

        public async Task<IEnumerable<OperatingSystemType>> GetAllOpertingSystemTypes()
        {
            return await _unitOfWork.GetRepository<OperatingSystemType>().GetAll();
        }

        public async Task<IEnumerable<OperatingSystemProduct>> GetAllOpertingSystems()
        {
            return await _unitOfWork.GetRepository<OperatingSystemProduct>().GetAll(include: p => p.Include(p => p.OperatingSystemType));

        }

        public async Task<IEnumerable<ScreenTechnology>> GetAllScreenTechnologies()
        {
            return await _unitOfWork.GetRepository<ScreenTechnology>().GetAll();
        }
        public async Task<IEnumerable<JackPlug>> GetAllJackPlugs()
        {
            return await _unitOfWork.GetRepository<JackPlug>().GetAll();
        }
        public async Task<IEnumerable<ChargerPort>> GetAllChargePorts()
        {
            return await _unitOfWork.GetRepository<ChargerPort>().GetAll();
        }
    }
}
